import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { InnowayApiService } from '../../services/innoway/innoway-api.service';
import { InnowayConfigService } from '../../services/innoway/innoway-config.service';
import * as Console from 'console-prefix';
import * as firebase from 'firebase';
declare var swal: any;

@Component({
  selector: 'app-login-launcher',
  templateUrl: './login-launcher.component.html',
  styleUrls: ['./login-launcher.component.scss'],
  animations: [
    trigger('fade', [
      state('visible', style({
        opacity: 1
      })),
      state('invisible', style({
        opacity: 0
      })),
      transition('* => *', animate('.5s'))
    ]),
  ]
})
export class LoginLauncherComponent implements OnInit {

  constructor(
    public innowayApi: InnowayApiService,
    public innowayConfig: InnowayConfigService,
    public router: Router,
  ) { }

  username: string;
  password: string;
  email_of_user: string;
  submitting = false;
  isLoaded: boolean = true;
  showpassword: boolean = false;

  get log() { return Console(`[Login Page]`).log; }

  async ngOnInit() {
    console.log('already login success', this.innowayApi.innowayAuth);
    if (await this.innowayApi.innowayAuth.authenticated) {
      this.isLoaded = false;
      this.toDashboard();
    } else {
      this.isLoaded = false;
      this.log('user not login');
    }
  }

  toDashboard() {
    this.router.navigate(['admin']);
  }

  async signIn(form: NgForm) {

    if (this.submitting) {
      return;
    }

    this.submitting = true;

    if (form.valid) {
      try {
        const { username, password } = this;
        const user = await this.innowayApi.innowayAuth.loginInnoway(username, password);
        if (user) {
          this.toDashboard();
        }
      } catch (err) {
        console.log('err login component: ', err);
        if (err.status === 400) {
          this.alertAuthError('T??i kho???n ho???c m???t kh???u kh??ng ????ng');
        }
        this.submitting = false;
      }
    } else {
      this.alertFormNotValid();
      this.submitting = false;
    }
  }

  forgotPassword(form: NgForm) {
    if (this.submitting) {
      return;
    }

    this.submitting = true;

    if (form.valid) {
      try {
        const { email_of_user } = this;
        const auth = firebase.auth();
        this.submitting = false;
        return auth.sendPasswordResetEmail(email_of_user)
          .then(() => this.alertUpdateSuccess('???? g???i y??u c???u th??nh c??ng, vui l??ng ki???m tra h???p th?? ?????n'))
          .catch((error) => this.alertAuthError('Email kh??ng ch??nh x??c, vui l??ng ki???m tra l???i'));
      } catch (err) {
        this.submitting = false;
      }
    } else {
      this.alertFormNotValid();
      this.submitting = false;
    }
  }

  async alertFormNotValid(message = '') {
    return await swal({
      title: 'N???i dung nh???p kh??ng h???p l???',
      text: message,
      type: 'warning',
      showConfirmButton: false,
      timer: 1000,
    });
  }

  async alertAuthError(message = '') {
    return await swal({
      title: message,
      type: 'warning',
      showConfirmButton: false,
      timer: 1000,
    });
  }
  async alertUpdateSuccess(message = '') {
    return await swal({
      title: message,
      type: 'success'
    });
  }
  keyDownFunction(event, form: NgForm) {
    if (event.keyCode === 13) {
      this.signIn(form);
    }
  }

  checkusernameVerified() {
    return new Promise((resolve, reject) => {
      const firebaseUser = this.innowayApi.innowayAuth.firebaseUser;
      if (!firebaseUser.emailVerified) {
        swal({
          title: 'Email ch??a ???????c x??c th???c',
          text: 'Vui l??ng ki???m tra l???i h???p th??',
          showCancelButton: true,
          confirmButtonText: 'T??i ch??a nh???n ???????c Email',
          showLoaderOnConfirm: true,
          preConfirm: () => {
            return this.innowayApi.innowayAuth.sendVerifyEmail();
          },
          allowOutsideClick: false
        }).then(() => {
          return swal({
            type: 'info',
            title: 'Email ???? ???????c g???i',
            text: `Email ???? ???????c g???i ????n h???p th?? ${firebaseUser.email}. Vui l??ng ki???m tra l???i h???p th??`
          });
        }).then(() => {
          this.innowayApi.innowayAuth.logout();
          reject();
        });
      } else {
        resolve(true);
      }
    });
  }

  showPassword() {
    this.showpassword = !this.showpassword;
  }
}
