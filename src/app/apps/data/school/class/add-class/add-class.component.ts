import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { InnowayApiService } from '../../../../../services/innoway/innoway-api.service';
import { Globals } from './../../../../../globals';
declare var $: any;
declare let swal: any;

@Component({
  selector: 'app-add-class',
  providers: [Globals],
  templateUrl: './add-class.component.html',
  styleUrls: ['./add-class.component.scss']
})
export class AddClassComponent implements OnInit {
  sid: any;
  isEdit: boolean = false;
  submitting: boolean = false;
  name: string;
  mid: any;
  cid: any;
  itemFields: any = [];
  sortName: any = 'id';
  sortType: any = 'desc';
  query: any = {};

  constructor(private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    private globals: Globals,
    private ngZone: NgZone,
    public innowayApi: InnowayApiService) {
  }
  async ngOnInit() {
    this.sid = this.route.snapshot.params['sid'];
    this.mid = this.route.snapshot.params['mid'];
    this.cid = this.route.snapshot.params['cid'];
    
    if (this.cid == null) {
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
    return {
      name: this.name
    };
  }

  async setData() {
    try {
      const query = Object.assign({
        sortBy: this.sortName,
        sortType: this.sortType
      }, this.query);
      const data = await this.innowayApi.class.getListClasses(this.sid, this.mid, { query });
      for (let i = 0; i < data.length; i++) {
        const item: any = data[i];
        if (parseInt(item.id, 10) === parseInt(this.cid, 10)) {
          this.name = item.name;
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
      const { name} = this;
      await this.innowayApi.class.addClass(this.sid, this.mid, { name});
      this.alertAddSuccess();
      form.reset();
      form.resetForm(this.setDefaultData());
    } else {
      this.alertFormNotValid();
    }
  }

  async updateItem(form: NgForm) {
    if (form.valid) {
      const { name } = this;
      await this.innowayApi.class.updateClass(this.sid, this.mid, this.cid ,{ name });
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
}
