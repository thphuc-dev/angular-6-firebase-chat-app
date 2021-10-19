import { Component, OnInit, ChangeDetectorRef, ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { InnowayApiService } from '../../../services/innoway/innoway-api.service';
import { Globals } from './../../../globals';
import { DataTable } from 'angular-2-data-table-bootstrap4/dist';
import { NgForm } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
declare let swal: any;

@Component({
  templateUrl: 'reservation.component.html',
  providers: [Globals],
  styleUrls: ['./reservation.component.scss']
})
export class ReservationComponent implements OnInit {
  listStudentsRegisterRoomType: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  itemCount: number = 0;
  itemFields: any = [];
  sortName: any = 'createdDate';
  sortType: any = 'desc';
  pageSize: any = '10';
  pageIndex: any = '0';
  query: any = {};
  queryExport: any = {};
  searchTimeOut: number = 250;
  searchRef: any;
  decodeUrl: boolean = false;
  submitting: boolean = false;
  listRoomOfAllBuildings: any = [];
  rowStudentClicked: boolean = false;
  rowRoomClicked: boolean = false;
  selectedStudent: any;
  roomID: string;
  moveInDate: number = new Date().getTime();
  firstName: string = null;
  lastName: string = null;
  idcard: string = null;
  school: string = null;
  verified: boolean = null;
  listSchools: any;
  schoolYearStart: number = null;
  registered: boolean = true;

  @ViewChild('studentsTable') studentsTable: DataTable;
  @ViewChild('roomsTable') roomsTable: DataTable;

  constructor(
    private router: Router,
    private globals: Globals,
    public innowayApi: InnowayApiService,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.getListSchools();
    this.getListRoomOfAllBuildings();
    this.getItems();
  }

  async getItems() {
    const { firstName, lastName, school, idcard, schoolYearStart, registered} = this;
    const query = Object.assign({
      sortBy: this.sortName,
      sortType: this.sortType,
      pageSize: this.pageSize,
      pageIndex: this.pageIndex
    }, this.query);
    this.listStudentsRegisterRoomType.next(await this.innowayApi.staff.getListStudentsRegisterRoomType({ firstName, lastName, school, idcard, schoolYearStart, registered}, { query }));
    this.itemCount = this.innowayApi.staff.pagination.totalItems;
    this.ref.detectChanges();
    return this.listStudentsRegisterRoomType;
  }

  async reloadItems(params) {
    const { limit, offset } = params;
    this.query.pageSize = limit;
    this.query.pageIndex = offset / 10;
    await this.getItems();
  }

  async getListRoomOfAllBuildings() {
    try {
      let listBuildings: any;
      listBuildings = await this.innowayApi.building.getList(); 
      for (let i = 0; i < listBuildings.length; i++) {
        var building = listBuildings[i];
        this.getListRooms(building);
      }
      this.ref.detectChanges();
    } catch (err) {
      console.log('ERR: ', err);
    }
  }

  async getListRooms(building) {
    try {
      let listRoomsOfBuilding: any;
      listRoomsOfBuilding = await this.innowayApi.building.getListRooms(building.id); 
      this.listRoomOfAllBuildings = this.listRoomOfAllBuildings.concat(listRoomsOfBuilding);
      const listRoomOfAllBuildingsMap = this.listRoomOfAllBuildings.filter(e => {
        return e.capacity - e.currentCapacity > 0;
      })
      this.listRoomOfAllBuildings = listRoomOfAllBuildingsMap;
      this.ref.detectChanges();
    } catch (err) {
      console.log('ERR: ', err);
    }
  }

  rowStudentClick(event) {
    this.selectedStudent = event.row.item.studentID;
  }

  rowStudentDoubleClick(event) {
    this.selectedStudent = event.row.item.studentID;
  }

  rowRoomClick(event) { 
    this.roomID = event.row.item.id;
  }

  rowRoomDoubleClick(event) {
    this.roomID = event.row.item.id;
  }

  async reservationForStudent() {
    try {
      try { await this.confirmReservation(); } catch (err) { return; }
      const { roomID, moveInDate  } = this;
      const row:any = await this.innowayApi.staff.reservationForStudent(this.selectedStudent, { roomID, moveInDate });
      if (!row.error) {
        this.alertUpdateSuccess();
        this.listRoomOfAllBuildings = [];
        this.studentsTable.reloadItems();
        this.getListRoomOfAllBuildings();
      } else {
        if (row.error.msg === 'student gener incompatible') {
          this.alertStudentHaveNotGender();
          return;
        }
      }
    } catch (err) {
      console.log('err: ', err);
      this.alertUpdateFailed();
    }
  }

  alertUpdateSuccess() {
    return swal({
      title: 'Xếp phòng thành công',
      type: 'success',
      timer: 2000,
    });
  }

  alertUpdateFailed() {
    return swal({
      title: 'Xếp phòng không thành công',
      type: 'warning',
      timer: 2000,
    });
  }

  async confirmReservation() {
    return await swal({
      title: 'Xếp phòng',
      text: 'Bạn có chắc xếp sinh viên vào phòng này không?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Quay lại'
    });
  }

  async searchStudent(form: NgForm) {
    try {
      await this.searchStudentAPI(form);
    } catch (err) {
      console.log('ERROR SUBMIT', err);
    } finally {
    }
  }

  async searchStudentAPI(form: NgForm) {
    if (form.valid) {
      const { firstName, lastName, school, idcard, schoolYearStart, verified, registered} = this;
      try {
        const query = Object.assign({
          sortBy: this.sortName,
          sortType: this.sortType,
          pageSize: this.pageSize,
          pageIndex: this.pageIndex
        }, this.query);
        this.listStudentsRegisterRoomType.next(await this.innowayApi.staff.getListStudentsRegisterRoomType({ firstName, lastName, school, idcard, schoolYearStart, verified, registered}, {query}));
        this.itemCount = this.innowayApi.staff.pagination.totalItems;
        this.ref.detectChanges();
        return this.listStudentsRegisterRoomType;
      } catch (err) {
        console.log('err: ', err);
      }
    } else {
      this.alertFormNotValid();
    }
  }

  alertFormNotValid() {
    return swal({
      title: 'Nội dung nhập không hợp lệ',
      type: 'warning',
      timer: 2000,
    });
  }

  async getListSchools() {
    try {
      this.listSchools = await this.innowayApi.school.getList(); 
      this.ref.detectChanges();
    } catch (err) {
      console.log('ERR: ', err);
    }
  }

  alertStudentHaveNotGender() {
    return swal({
      title: 'Lỗi giới tính của sinh viên không hợp lệ',
      type: 'warning',
      timer: 2000,
    });
  }
}
