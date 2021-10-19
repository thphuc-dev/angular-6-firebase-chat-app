import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { InnowayApiService } from '../../../../services/innoway/innoway-api.service';
import { Globals } from './../../../../globals';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as moment from 'moment';
declare let swal: any;

@Component({
  selector: 'app-add-shared-bill',
  providers: [Globals],
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddSharedBillComponent implements OnInit {
  id: any;
  isEdit: boolean = false;
  submitting: boolean = false;
  expirationDate: number;
  expirationDateShow: Date;
  appliedDate: number;
  appliedDateShow: Date;
  minDate = new Date();
  billDatas: any;
  building: string;
  room: string;
  listBuildings: any;
  listRoomsOfBuilding: any;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    private globals: Globals,
    private ngZone: NgZone,
    public innowayApi: InnowayApiService) {

  }

  async ngOnInit() {
    this.getListBuildings();
    this.id = this.route.snapshot.params['id'];

    if (this.id == null) {
      this.isEdit = false;
      this.setDefaultData();
    } else {
      this.isEdit = true;
    }
  }


  setDefaultData() {
    this.expirationDate = null;
    this.expirationDateShow = null;
    this.appliedDate = null;
    this.appliedDateShow = null;
    this.building = null;
    this.room = null;
    this.billDatas = [{
      name: null,
      number: null,
      numberUnit: null,
      fee: null,
      feeUnit: null
    }];
    return {
      expirationDate: this.expirationDate,
      expirationDateShow: this.expirationDateShow,
      appliedDate: this.appliedDate,
      appliedDateShow: this.appliedDateShow,
      billDatas: this.billDatas,
      building: this.building,
      room: this.room
    };
  }

  getStartOfDate(date: Date) {
    date.setHours(0,0,0,0);
    return date;
  }

  async addItem(form: NgForm) {
    if (form.valid) {
      this.expirationDate = this.getStartOfDate(this.expirationDateShow).getTime();
      this.appliedDate = this.getStartOfDate(this.appliedDateShow).getTime();
      const { expirationDate, billDatas, appliedDate } = this;
      await this.innowayApi.bill.addSharedBill(this.room, {expirationDate, billDatas, appliedDate});
      this.alertAddSuccess();
      form.reset();
      form.resetForm(this.setDefaultData());
    } else {
      this.alertFormNotValid();
    }
  }

  backToListForAddNew() {
    this.router.navigate(['../../shared'], { relativeTo: this.route });
  }


  alertItemNotFound() {
    swal({
      title: 'Không còn tồn tại',
      type: 'warning',
      timer: 2000
    });
  }

  alertAddSuccess() {
    return swal({
      title: 'Đã thêm',
      type: 'success',
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

  alertFormNotValid() {
    return swal({
      title: 'Nội dung nhập không hợp lệ',
      type: 'warning',
      timer: 2000,
    });
  }

  alertAddFailed() {
    return swal({
      title: 'Thêm không thành công',
      type: 'warning',
      timer: 2000,
    });
  }

  alertUpdateFailed() {
    return swal({
      title: 'Cập nhật không thành công',
      type: 'warning',
      timer: 2000,
    });
  }

  async submitAndClose(form: NgForm) {
    this.submitting = true;
    try {
      await this.addItem(form);
      this.backToListForAddNew();
    } catch (err) {
      console.log('err: ', err);
      this.alertAddFailed();
    } finally {
      this.submitting = false;
    }
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
  addFee(){
    this.billDatas.push({
      name: null,
      number: null,
      numberUnit: null,
      fee: null,
      feeUnit: null
    })
  }
}
