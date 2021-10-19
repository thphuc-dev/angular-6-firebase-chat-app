import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { InnowayApiService } from '../../../../services/innoway/innoway-api.service';
import { Globals } from './../../../../globals';
declare var $: any;
declare let swal: any;

@Component({
  selector: 'app-add',
  providers: [Globals],
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  id: any;
  isEdit: boolean = false;
  submitting: boolean = false;
  itemFields: any = [];
  sortName: any = 'id';
  sortType: any = 'desc';
  query: any = {};
  dropdownSettings = {};
  listRoomFees: any;
  roomFeeIDs: any = [];
  roomFees: any;

  @ViewChild('roomFeesSelect')
  searchElementRef: ElementRef;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    private globals: Globals,
    private ngZone: NgZone,
    public innowayApi: InnowayApiService) {
  }
  async ngOnInit() {
    this.getListRoomFees();
    this.dropdownSettings = {
      text: 'Chọn khoản thu',
      selectAllText: 'Chọn tất cả',
      unSelectAllText: 'Bỏ chọn tất cả',
      enableSearchFilter: true,
    };
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
    this.id = null;
    return {
      id: this.id,
    };
  }

  async setData() {
    try {
      const query = Object.assign({
        sortBy: this.sortName,
        sortType: this.sortType
      }, this.query);
      const data = await this.innowayApi.roomType.getList({ query });
      for (let i = 0; i < data.length; i++) {
        const item: any = data[i];
        if (item.id === this.id) {
          this.id = item.id;
          this.roomFees = await this.innowayApi.roomType.getListRoomFeesOfRoomType(this.id);;
          const roomFeesNew: any = [];
          for (let i = 0; i < this.roomFees.length; i++) {
            const temp_item = this.roomFees[i];
            roomFeesNew.push({
              'id' : temp_item.id,
              'itemName'  : temp_item.name
            });
          }
          this.roomFees = roomFeesNew;
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
      for (let i = 0; i < this.roomFees.length; i++) {
        this.roomFeeIDs.push(this.roomFees[i].id);
      }
      const { id, roomFeeIDs } = this;
      await this.innowayApi.roomType.add({ id, roomFeeIDs });
      this.alertAddSuccess();
      form.reset();
      form.resetForm(this.setDefaultData());
    } else {
      this.alertFormNotValid();
    }
  }

  async updateItem(form: NgForm) {
    if (form.valid) {
      for (let i = 0; i < this.roomFees.length; i++) {
        this.roomFeeIDs.push(this.roomFees[i].id);
      }
      const { id, roomFeeIDs  } = this;
      await this.innowayApi.roomType.updateRoomType({ id, roomFeeIDs });
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

  async getListRoomFees() {
    try {
      const query = Object.assign({
        fields: this.itemFields
      }, this.query);
      this.listRoomFees = await this.innowayApi.roomFee.getList({ query });
      const listRoomFeesNew: any = [];
      for (let i = 0; i < this.listRoomFees.length; i++) {
        const temp_item = this.listRoomFees[i];
        listRoomFeesNew.push({
          'id' : temp_item.id,
          'itemName'  : temp_item.name
        });
      }
      this.listRoomFees = listRoomFeesNew;
      this.ref.detectChanges();
    } catch (err) {

    }
  }
}
