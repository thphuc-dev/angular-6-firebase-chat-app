import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { InnowayApiService } from '../../../services/innoway/innoway-api.service';
import { Globals } from './../../../globals';
import { TabDirective } from 'ngx-bootstrap/tabs';
import { InnowayConfigService } from '../../../services/innoway';
declare var $: any;
declare let swal: any;

@Component({
  selector: 'app-profile',
  providers: [Globals],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  submitting: boolean = false;
  changeTab: boolean = false;

  //info of staff
  oldPassword: string;
  newPassword: string;
  newPasswordRepeat: string;
  checkPassword: boolean = true;
  showOldPassword: boolean = false;
  showNewPassword: boolean = false;
  showNewPasswordRepeat: boolean = false;
  avatarUrl: string;
  username: string;
  password: string;
  password_repeat: string;  
  firstName: string;
  lastName: string;
  email: string;
  avatarUrlDefault: string = 'http://via.placeholder.com/500?text=Updating...!';
  departmentID: string;
  listDepartments: any;
  sortName: any = 'id';
  sortType: any = 'desc';
  query: any = {};

  //file avatar
  loadingUploadAvatar: boolean = false;
  @ViewChild('fileUploader')
  fileUploaderElementRef: ElementRef;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    private globals: Globals,
    private ngZone: NgZone,
    public innowayApi: InnowayApiService,
    private innowayConfig: InnowayConfigService,) {
      this.firstName = this.innowayConfig.firstName;
      this.lastName = this.innowayConfig.lastName;
      this.avatarUrl = this.innowayConfig.avatarUrl;
      this.password = this.innowayConfig.password;
      this.email = this.innowayConfig.email;
      this.departmentID = this.innowayConfig.departmentID;

  }
  async ngOnInit() {
    this.getListDepartments();
  }

  onSelect(data: TabDirective): void {
    if (data.heading === 'Đổi mật khẩu') {
      this.changeTab = true;
    } else {
      this.changeTab = false;
    }
  }

  async changePassword(form: NgForm) {
    this.submitting = true;
    try {
      await this.changePasswordApi(form);
    } catch (err) {
      this.alertChangePasswordFailed();
    } finally {
      this.submitting = false;
    }
  }

  async changePasswordApi(form: NgForm) {
    if (form.valid) {
      if (this.oldPassword !== this.password) {
        this.alertOldPasswordNotTrue();
        this.checkPassword = false;
      }
      if (this.newPassword !== this.newPasswordRepeat) {
        this.alertNewPasswordNotTrue();
        this.checkPassword = false;
      }
      if (this.checkPassword) {
        const { oldPassword, newPassword } = this;
        await this.innowayApi.auth.changePassword(oldPassword, newPassword);
        this.alertChangeSuccess();
        setTimeout(() => {
          window.location.reload();
        }, 3000);
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
  alertChangeSuccess() {
    return swal({
      title: 'Đổi mật khẩu thành công, website sẽ tự động tải lại!',
      type: 'success',
      timer: 2000,
    });
  }
  alertOldPasswordNotTrue() {
    return swal({
      title: 'Mật khẩu cũ không đúng',
      type: 'warning',
      timer: 2000,
    });
  }

  alertChangePasswordFailed() {
    return swal({
      title: 'Cập nhật không thành công',
      type: 'warning',
      timer: 2000,
    });
  }

  alertNewPasswordNotTrue() {
    return swal({
      title: 'Mật khẩu mới không trùng khớp',
      type: 'warning',
      timer: 2000,
    });
  }

  showPassword(event) {
    switch (event.target.id) {
      case 'old-password':
        this.showOldPassword = !this.showOldPassword;
      break;
      case 'new-password':
        this.showNewPassword = !this.showNewPassword;
      break;
      case 'new-password-repeat':
        this.showNewPasswordRepeat = !this.showNewPasswordRepeat;
      break;
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

  displayPhoto(fileInput) {
    this.loadingUploadAvatar = true;
    try {
      const file = fileInput.target.files[0];
      const result = this.innowayApi.staff.uploadAvatarStaff(file)
      .then(result => {
        this.loadingUploadAvatar = false;
        this.avatarUrl =  result.avatarUrl;
        this.innowayConfig.avatarUrl = result.avatarUrl;
        this.alertUploadAvatarSuccess();
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      });
      this.ref.detectChanges();
    } catch (err) {
      console.log('Không úp được hình: ', err);
    }
  }

  alertUploadAvatarSuccess() {
    return swal({
      title: 'Cập nhật ảnh đại diện thành công, website sẽ tự động tải lại!',
      type: 'success',
      timer: 2000,
    });
  }

  async updateInfo(form: NgForm) {
    this.submitting = true;
    try {
      await this.updateInfoApi(form);
    } catch (err) {
      this.alertUpdateInfoFailed();
    } finally {
      this.submitting = false;
    }
  }

  async updateInfoApi(form: NgForm) {
    if (form.valid) {
      const { firstName , lastName , email , departmentID } = this;
      await this.innowayApi.staff.updateInfo({firstName, lastName, email, departmentID});
      this.innowayConfig.email = this.email;
      this.innowayConfig.firstName = this.firstName;
      this.innowayConfig.lastName = this.lastName;
      this.innowayConfig.departmentID = this.departmentID;
      this.alertUpdateInfoSuccess();
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } else {
      this.alertFormNotValid();
    }
  }

  alertUpdateInfoFailed() {
    return swal({
      title: 'Cập nhật không thành công',
      type: 'warning',
      timer: 2000,
    });
  }
  alertUpdateInfoSuccess() {
    return swal({
      title: 'Cập nhật thông tin thành công, website sẽ tự động tải lại!',
      type: 'success',
      timer: 2000,
    });
  }
}
