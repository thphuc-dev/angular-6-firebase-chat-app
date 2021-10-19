import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { InnowayApiService } from '../../../services/innoway/innoway-api.service';
import { Globals } from './../../../globals';
declare var $: any;
declare let swal: any;

@Component({
  selector: 'app-add',
  providers: [Globals],
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  submitting: boolean = false;
  username: string;
  password: string;
  password_repeat: string;
  firstName: string;
  lastName: string;
  email: string;
  roleName: string;
  departmentID: string;
  listRoles: any;
  listDepartments: any;

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
    this.getListDepartments();
    this.getListRoles();
    this.setDefaultData();
  }

  setDefaultData() {
    this.username = null;
    this.password = null;
    this.password_repeat = null;
    this.firstName = null;
    this.lastName = null;
    this.email = null;
    this.roleName = null;
    this.departmentID = null;
    return {
      username: this.username,
      password: this.password,
      password_repeat: this.password_repeat,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      roleName: this.roleName,
      departmentID: this.departmentID,
    };
  }

  async addItem(form: NgForm) {
    if (form.valid) {
      if (this.password !== this.password_repeat) {
        this.alertPasswordRepeatNotTrue();
        return;
      }
      const { username, password, firstName, lastName, email, roleName, departmentID} = this;
      await this.innowayApi.staff.registerStaff({username, password, firstName, lastName, email, roleName, departmentID});
      this.alertAddSuccess();
      form.reset();
      form.resetForm(this.setDefaultData());
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

  alertPasswordRepeatNotTrue() {
    return swal({
      title: 'Mật khẩu và nhập lại mật khẩu không trùng khớp!',
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

  async getListRoles() {
    try {
      const query = Object.assign({
        sortBy: this.sortName,
        sortType: this.sortType
      }, this.query);
      this.listRoles = await this.innowayApi.role.getList({ query });
      this.ref.detectChanges();
    } catch (err) {

    }
  }

  async getListDepartments() {
    try {
      const query = Object.assign({
        sortBy: this.sortName,
        sortType: this.sortType
      }, this.query);
      this.listDepartments = await this.innowayApi.department.getList({ query });
      this.ref.detectChanges();
    } catch (err) {

    }
  }
}
