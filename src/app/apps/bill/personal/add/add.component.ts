import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { InnowayApiService } from '../../../../services/innoway/innoway-api.service';
import { Globals } from './../../../../globals';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as moment from 'moment';
declare let swal: any;

@Component({
  selector: 'app-add-personal-bill',
  providers: [Globals],
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddPersonalBillComponent implements OnInit {
  id: any;
  isEdit: boolean = false;
  submitting: boolean = false;
  expirationDate: number;
  expirationDateShow: Date;
  appliedDate: number;
  appliedDateShow: Date;
  minDate = new Date();

  constructor(private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    private globals: Globals,
    private ngZone: NgZone,
    public innowayApi: InnowayApiService) {

  }

  async ngOnInit() {
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
    return {
      expirationDate: this.expirationDate,
      expirationDateShow: this.expirationDateShow,
      appliedDate: this.appliedDate,
      appliedDateShow: this.appliedDateShow
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
      const { expirationDate, appliedDate} = this;
      await this.innowayApi.bill.addPersonalBill({expirationDate, appliedDate});
      await this.innowayApi.bill.addPersonalBillRoomTypeRegistration({expirationDate, appliedDate});
      this.alertAddSuccess();
      form.reset();
      form.resetForm(this.setDefaultData());
    } else {
      this.alertFormNotValid();
    }
  }

  backToListForAddNew() {
    this.router.navigate(['../../personal'], { relativeTo: this.route });
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
        this.alertAddFailed();
      } finally {
        this.submitting = false;
      }
    }
}
