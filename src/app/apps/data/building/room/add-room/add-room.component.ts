import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { InnowayApiService } from '../../../../../services/innoway/innoway-api.service';
import { Globals } from './../../../../../globals';
declare var $: any;
declare let swal: any;

@Component({
  selector: 'app-add-room',
  providers: [Globals],
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.scss']
})
export class AddRoomComponent implements OnInit {
  bid: any;
  rid: any;
  isEdit: boolean = false;
  submitting: boolean = false;
  itemFields: any = [];
  sortName: any = 'id';
  sortType: any = 'desc';
  query: any = {};
  roomTypeID: string;
  name: string;
  floor: number;
  capacity: number;
  gender: string;
  listRoomTypes: any;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    private globals: Globals,
    private ngZone: NgZone,
    public innowayApi: InnowayApiService) {
  }
  async ngOnInit() {
    this.getListRoomTypes();
    this.bid = this.route.snapshot.params['bid'];
    this.rid = this.route.snapshot.params['rid'];
    if (this.rid == null) {
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
    this.name = null;
    this.gender = null;
    this.capacity = null;
    this.floor = null;
    this.roomTypeID = null;
    return {
      name: this.name,
      gender: this.gender,
      capacity: this.capacity,
      floor: this.floor,
      roomTypeID: this.roomTypeID
    };
  }

  async setData() {
    try {
      const query = Object.assign({
        sortBy: this.sortName,
        sortType: this.sortType
      }, this.query);
      const data = await this.innowayApi.building.getListRooms(this.bid, { query });
      for (let i = 0; i < data.length; i++) {
        const item: any = data[i];
        if (item.id === this.rid) {
          this.name = item.name;
          this.floor = item.floor;
          this.capacity = item.capacity;
          this.gender = item.gender;
          for (let i = 0; i < this.listRoomTypes.length; i++) {
            const type: any = this.listRoomTypes[i];
            if (type.id === item.roomType) {
              this.roomTypeID = type.id;
            }
          }
        }
      }
    } catch (err) {
      try { await this.alertItemNotFound(); } catch (err) { }
      console.log('ERRRR', err);
      this.backToList();
    }
  }

  async addItem(form: NgForm) {
    if (form.valid) {
      const { name, gender, roomTypeID, capacity, floor } = this;
      await this.innowayApi.building.addRoom(this.bid, { name , gender, roomTypeID, capacity, floor });
      this.alertAddSuccess();
      form.reset();
      form.resetForm(this.setDefaultData());
    } else {
      this.alertFormNotValid();
    }
  }

  async updateItem(form: NgForm) {
    if (form.valid) {
      const { name, gender, roomTypeID, capacity, floor  } = this;
      await this.innowayApi.building.updateRoom(this.bid, this.rid, { name, gender, roomTypeID, capacity, floor  });
      form.reset();
      form.resetForm(this.setDefaultData());
      this.alertUpdateSuccess();
      this.backToList();
    } else {
      this.alertFormNotValid();
    }
  }

  async submitAndNew(form: NgForm) {
    this.submitting = true;
    try {
      await this.addItem(form);
    } catch (err) {
      console.log('ERROR SUBMIT', err);
      this.alertAddFailed();
    } finally {
      this.submitting = false;
    }
  }

  async submitAndClose(form: NgForm) {
    this.submitting = true;
    try {
      await this.addItem(form);
      this.backToListForAddNew();
    } catch (err) {
      this.alertAddFailed();
    } finally {
      this.submitting = false;
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

  alertAddSuccess() {
    return swal({
      title: 'Đã thêm',
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

  backToListForAddNew() {
    this.router.navigate(['./../list'], { relativeTo: this.route });
  }

  alertUpdateSuccess() {
    return swal({
      title: 'Đã cập nhật',
      type: 'success',
      timer: 2000,
    });
  }

  backToList() {
    this.router.navigate(['../../list'], { relativeTo: this.route });
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

  async getListRoomTypes() {
    try {
      const query = Object.assign({
        fields: this.itemFields
      }, this.query);
      this.listRoomTypes = await this.innowayApi.roomType.getList({ query });
      console.log('listRoomTypes: ', this.listRoomTypes);
      this.ref.detectChanges();
    } catch (err) {

    }
  }
}
