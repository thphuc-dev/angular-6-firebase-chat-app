import { Component, OnInit, ChangeDetectorRef, ViewChild, TemplateRef} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { InnowayApiService } from '../../services/innoway/innoway-api.service';
import { Globals } from './../../globals';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
declare let swal: any;

@Component({
  templateUrl: 'room-manager.component.html',
  providers: [Globals],
  styleUrls: ['./room-manager.component.scss']
})
export class RoomManagerComponent implements OnInit {
  listBuildings: any;
  listRooms: any;
  listStudents: any = [];
  currentBuilding: any = {
    id : null,
    name: ''
  };
  currentRoom: any = {
    id: null,
    name: ''
  };
  loadListStudents: boolean = false;
  roomCriteria: any;
  building: any = null;
  modalRef: BsModalRef;
  idStudent: any;
  genderStudent: any;
  roomID: string;
  moveInDate: number = new Date().getTime();
  listRoomOfAllBuildings: any = [];
  constructor(
    private router: Router,
    private globals: Globals,
    public innowayApi: InnowayApiService,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private modalService: BsModalService,
  ) {
  }


  ngOnInit() {
    this.getListBuildings();
  }

  async getListBuildings() {
    try {
      this.listBuildings = await this.innowayApi.building.getList(); 
      this.ref.detectChanges();
    } catch (err) {
      console.log('ERR: ', err);
    }
  }

  async getListRooms(building) {
    try {
      this.currentBuilding = building;
      this.building = building.id;
      this.listRooms = await this.innowayApi.building.getListRooms(building.id); 
      this.ref.detectChanges();
    } catch (err) {
      console.log('ERR: ', err);
    }
  }
  async getListStudents(room) {
    this.loadListStudents = true;
    this.currentRoom = room;
    this.roomID = room.id;
    this.roomCriteria = {
      roomCriteria: { 
        building: this.currentBuilding.id,
        room: this.currentRoom.name
      }
    }
    this.listStudents = await this.innowayApi.staff.searchStudent(this.roomCriteria);
    this.ref.detectChanges();
  }

  openModalAction(templateAction: TemplateRef<any>, item: any) {
    this.modalRef = this.modalService.show(templateAction);
    this.idStudent = item.id;
    this.genderStudent = item.gender;
    this.getListRoomOfAllBuildings();
  }

  async changeRoom(room){
    try {
      try { await this.confirmChangeRoom(); } catch (err) { return; }
      this.roomID = room;
      const { roomID, moveInDate  } = this;
      const result = await this.innowayApi.staff.reservationForStudent(this.idStudent, { roomID, moveInDate });
      this.alertChangeRoomSuccess();
      this.getListRooms(this.currentBuilding);
      this.getListStudents(this.currentRoom);
      this.modalRef.hide();
    } catch (err) {
      console.log('err: ', err);
      this.alertCannotChangeRoom();
    }
  }

  async confirmChangeRoom() {
    return await swal({
      title: 'Chuyển phòng cho sinh viên',
      text: 'Are you sure?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Quay lại'
    });
  }

  async alertChangeRoomSuccess() {
    return await swal({
      title: 'Chuyển phòng cho sinh viên thành công',
      type: 'success',
      timer: 1000,
    });
  } 

  async alertCannotChangeRoom() {
    return await swal({
      title: 'Chuyển phòng không thành công',
      type: 'warning',
      timer: 1000,
    });
  }
  async kickStudent(idStudent){
    try {
      try { await this.confirmKickStudent(); } catch (err) { return; }
      this.idStudent = [idStudent];
      const result = await this.innowayApi.staff.kickStudent(this.idStudent);
      this.alertKickStudentSuccess();
      this.getListRooms(this.currentBuilding);
      this.getListStudents(this.currentRoom);
      this.modalRef.hide();
    } catch (err) {
      console.log('err: ', err);
      this.alertCannotKickStudent();
    }
  }

  async confirmKickStudent() {
    return await swal({
      title: 'Cho sinh viên ra khỏi KTX',
      text: 'Are you sure?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Quay lại'
    });
  }

  async alertKickStudentSuccess() {
    return await swal({
      title: 'Thao tác thành công',
      type: 'success',
      timer: 1000,
    });
  } 

  async alertCannotKickStudent() {
    return await swal({
      title: 'Thao tác không thành công',
      type: 'warning',
      timer: 1000,
    });
  }

  async getListRoomOfAllBuildings() {
    try {
      let listBuildings: any;
      listBuildings = await this.innowayApi.building.getList(); 
      for (let i = 0; i < listBuildings.length; i++) {
        var building = listBuildings[i];
        this.getRooms(building);
      }
      this.ref.detectChanges();
    } catch (err) {
      console.log('ERR: ', err);
    }
  }

  async getRooms(building) {
    try {
      let listRoomsOfBuilding: any;
      listRoomsOfBuilding = await this.innowayApi.building.getListRooms(building.id); 
      this.listRoomOfAllBuildings = this.listRoomOfAllBuildings.concat(listRoomsOfBuilding);
      const listRoomOfAllBuildingsMap = this.listRoomOfAllBuildings.filter(e => {
        return e.capacity - e.currentCapacity > 0 && e.gender === this.genderStudent;
      })
      this.listRoomOfAllBuildings = listRoomOfAllBuildingsMap;
      this.ref.detectChanges();
    } catch (err) {
      console.log('ERR: ', err);
    }
  }
}
