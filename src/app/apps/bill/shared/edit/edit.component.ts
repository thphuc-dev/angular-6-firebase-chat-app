import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { InnowayApiService } from '../../../../services/innoway/innoway-api.service';
import { Globals } from './../../../../globals';
declare var $: any;
declare let swal: any;

@Component({
  selector: 'app-edit-shared-bill',
  providers: [Globals],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditSharedBillComponent implements OnInit {
  id: any;
  isEdit: boolean = false;
  submitting: boolean = false;

  //data search bill
  buildingID: string = null;
  room: string = null;
  floor: number = null;
  month: number = null;
  year: number = null;
  isPaid: boolean = null;
  query: any = {};

  //data bill
  building: string;
  expirationDate: number;
  expirationDateShow: Date;
  appliedDate: number;
  appliedDateShow: Date;
  roomType: string;
  billDatas: any;
  listBuildings: any;
  listRoomsOfBuilding: any;
  listRoomTypes: any;
  totalFees: number = 0;
  totalDaysStay: number;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    private globals: Globals,
    private ngZone: NgZone,
    public innowayApi: InnowayApiService) {
  }
  async ngOnInit() {
    this.getListBuildings();
    this.getListRoomTypes();
    this.id = this.route.snapshot.params['id'];
    if (this.id == null) {
      this.isEdit = false;
      this.setDefaultData();
    } else {
      this.isEdit = true;
    }

    if (this.isEdit) {
      this.setData();
    }
  }

  setDefaultData() {
    return {
    };
  }

  async setData() {
    try {
      const query = Object.assign({
        buildingID: this.buildingID,
        room: this.room,
        floor: this.floor,
        month: this.month,
        year: this.year,
        isPaid: this.isPaid,
      }, this.query);
      const data = await this.innowayApi.bill.searchSharedBill({query});
      for (let i = 0; i < data.length; i++) {
        const item: any = data[i];
        if (item.id === this.id) {
          this.building = item.billInfo.building;
          this.getListRoomsOfBuilding(this.building);
          this.expirationDate = item.expirationDate;
          this.expirationDateShow = new Date(item.expirationDate);
          this.appliedDate = item.appliedDate;
          this.appliedDateShow = new Date(item.appliedDate);
          this.billDatas = item.fees;
          this.floor = item.billInfo.floor;
          this.room = item.billInfo.room;
          this.roomType = item.billInfo.roomType;
          this.totalDaysStay = (this.expirationDate - this.appliedDate)/86400000;
          if (this.billDatas.length > 0){
            for (let i = 0; i < this.billDatas.length; i++){
              this.totalFees += this.totalDaysStay / 30 * (this.billDatas[i].fee * parseInt(this.billDatas[i].number, 10));
            }
          }
          this.totalFees = Math.round((this.totalFees)/1000)*1000;
        }
      }
    } catch (err) {
      try { await this.alertItemNotFound(); } catch (err) { }
      console.log('ERRRR', err);
      this.backToList();
    }
  }

  async updateItem(form: NgForm) {
    if (form.valid) {
      this.expirationDate = this.expirationDateShow.getTime();
      this.appliedDate = this.appliedDateShow.getTime();
      const { building, room, roomType, floor, expirationDate, billDatas, appliedDate  } = this;
      await this.innowayApi.bill.updateSharedBill(this.id, { building, room, roomType, floor, expirationDate, billDatas, appliedDate });
      form.reset();
      form.resetForm(this.setDefaultData());
      this.alertUpdateSuccess();
      this.backToList();
    } else {
      this.alertFormNotValid();
    }
  }


  async updateAndClose(form: NgForm) {
    this.submitting = true;
    try {
      console.log('Submit: ', this.submitting);
      await this.updateItem(form);
    } catch (err) {
      this.alertUpdateFailed();
    } finally {
      this.submitting = false;
    }
  }

  alertFormNotValid() {
    return swal({
      title: 'Nội dung nhập không hợp lệ',
      type: 'warning',
      timer: 2000,
    });
  }


  alertUpdateSuccess() {
    return swal({
      title: 'Đã cập nhật',
      type: 'success',
      timer: 2000,
    });
  }

  backToList() {
    this.router.navigate(['../../shared'], { relativeTo: this.route });
  }

  alertUpdateFailed() {
    return swal({
      title: 'Cập nhật không thành công',
      type: 'warning',
      timer: 2000,
    });
  }

  alertItemNotFound() {
    swal({
      title: 'Không còn tồn tại',
      type: 'warning',
      timer: 2000
    });
  }

  async getListBuildings() {
    try {
      this.listBuildings = await this.innowayApi.building.getList(); 
      this.ref.detectChanges();
    } catch (err) {
      console.log('ERR: ', err);
    }
  }

  async getListRoomsOfBuilding(buildingId) {
    try {
      this.listRoomsOfBuilding = await this.innowayApi.building.getListRooms(buildingId); 
      this.ref.detectChanges();
    } catch (err) {
      console.log('ERR: ', err);
    }
  }

  async getListRoomTypes() {
    try {
      this.listRoomTypes = await this.innowayApi.roomType.getList(); 
      this.ref.detectChanges();
    } catch (err) {
      console.log('ERR: ', err);
    }
  }

  addFee(){
    this.billDatas.push({
      name: null,
      number: null,
      numberUnit: null,
      fee: null,
      feeUnit: null
    })
  }

  async exportPDF() {
    try {
      const res: any = await this.innowayApi.bill.exportPdfSharedBills(this.id);
      const url = res.downloadUrl;
      const dwldLink = document.createElement('a');
      dwldLink.setAttribute('target', '_blank');
      dwldLink.setAttribute('href', url);
      dwldLink.setAttribute('download', 'Hoá-đơn.pdf');
      dwldLink.style.visibility = 'hidden';
      document.body.appendChild(dwldLink);
      dwldLink.click();
      document.body.removeChild(dwldLink);
    } catch (err) {
      console.log('ERR: ', err);
    }
  }
}
