import { Injectable } from "@angular/core";
import { InnowayConfigService } from "./innoway-config.service";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import * as firebase from "firebase";
import { environment } from "../../../environments/environment";
import * as Console from "console-prefix";
import { HttpRequest, HttpHeaders, HttpClient } from "@angular/common/http";
import * as _ from "lodash";
@Injectable()
export class InnowayAuthService {
  constructor(
    public innowayConfig: InnowayConfigService,
    public http: HttpClient
  ) {
    // firebase.auth().useDeviceLanguage()

    if (!firebase.apps.length) {
      this.firebaseApp = firebase.initializeApp(environment.innoway.firebase);
    }

    // Setup facebook provider
    // this.facebookProvider = new firebase.auth.FacebookAuthProvider()
    // this.facebookProvider.addScope('business_management,email,manage_pages,pages_messaging,public_profile,publish_pages,user_friends,pages_messaging_phone_number,pages_messaging_subscriptions,read_page_mailboxes')
    // this.facebookProvider.setCustomParameters({ 'display': 'popup' });
    // Setup google provider
    // this.googleProvider = new firebase.auth.GoogleAuthProvider()
    // Hanlder User Auth State
    // this.firebaseApp.auth().onAuthStateChanged(user => {
    //   if (user) {
    //     if (!this.manuallyLogin) {
    //       this.firebaseUser = user
    //       this.log('firebase User', user)
    //       user.getIdToken().then(token => {
    //         this.firebaseToken = token
    //         if (!this.innowayUser) {
    //           return this.loginInnowayByFirebase()
    //         }
    //       }).catch(err => {
    //         this.onAuthStateChange.next(false)
    //       })
    //     }
    //   } else {
    //     this.onAuthStateChange.next(false)
    //   }
    // })

    // Firebase Cloud Message Setup
    // if (!this.manuallyLogin) {
    //   this.firebaseUser = user
    //   this.log('firebase User', user)
    //   user.getIdToken().then(token => {
    //     this.firebaseToken = token
    //     if (!this.innowayUser) {
    //       return this.loginInnoway('', '')
    //     }
    //   }
    // }

    console.log(
      "config bambi",
      this.innowayConfig,
      this.manuallyLogin,
      JSON.stringify(this.innowayUser)
    );
    if (this.innowayConfig.isLogon === "true") {
      this.loginEmailAndPassword(
        this.innowayConfig.username,
        this.innowayConfig.password
      )
        .then((result) => this.onAuthStateChange.next(true))
        .catch((err) => this.onAuthStateChange.next(false));
    } else {
      this.onAuthStateChange.next(false);
    }
  }

  get log() {
    return Console("[innowayAuth]").log;
  }

  onAuthStateChange = new BehaviorSubject<Boolean>(undefined);
  adminToken: string;
  firebaseApp: firebase.app.App;
  facebookProvider: firebase.auth.FacebookAuthProvider;
  googleProvider: firebase.auth.GoogleAuthProvider;
  firebaseUser: firebase.User;
  firebaseToken: string;
  facebookToken: string;
  googleToken: string;
  innowayUser: IInnowayUser;
  manuallyLogin: boolean = false;

  async exec(option: any) {
    if (!option) {
      throw new Error("option undefined in exec");
    }
    try {
      const httpOptions = new HttpHeaders(option.headers);
      const req = new HttpRequest(option.method, option.uri, option.body, {
        headers: httpOptions,
        reportProgress: true,
        responseType: option.responseType,
      });
      return this.http
        .request(req)
        .toPromise()
        .then((res) => res);
    } catch (resError) {
      this.log("Innoway Auth ERROR", resError);
      throw resError;
    }
  }

  getFirebaseToken() {
    return this.firebaseApp.auth().currentUser.getIdToken();
  }

  async loginEmailAndPassword(username: string, password: string) {
    this.manuallyLogin = true;
    return await this.loginInnoway(username, password);
  }

  // async loginEmailAndPasswordByFirebase(email: string, password: string) {
  //   this.manuallyLogin = true;
  //   try {
  //     const result = await this.firebaseApp.auth().signInWithEmailAndPassword(email, password);
  //     this.firebaseUser = result;
  //     this.firebaseToken = await this.firebaseUser.getIdToken();
  //     return await this.loginInnowayByFirebase();
  //   } catch (err ) {
  //     return err;
  //   }
  // }

  async loginInnoway(username: string, password: string) {
    const option = {
      method: "POST",
      uri: this.innowayConfig.apiUrl("auth/login"),
      headers: {
        // headers
        "Content-Type": "application/json",
        Authorization: "Basic Y3NzLW1vYmlsZS1jbGllbnQ6Y3NzLW1vYmlsZS1zZWNyZXQ=",
      },
      json: true,
      body: {
        username,
        password,
      },
    };
    let res;
    try {
      res = await this.exec(option);
    } catch (e) {
      throw e;
    }

    this.innowayUser = res.body;
    this.innowayConfig.token = res.body.data.accessToken;
    this.adminToken = res.body.data.accessToken;
    this.innowayConfig.username = username;
    this.innowayConfig.password = password;
    this.innowayConfig.id = res.body.data.id;
    this.onAuthStateChange.next(true);
    return this.innowayUser;
  }

  async loginInnowayByFirebase() {
    if (this.firebaseToken) {
      const option = {
        method: "POST",
        uri: this.innowayConfig.apiUrl("auth/login"),
        headers: {
          // headers
          "Content-Type": "application/json",
          Authorization:
            "Basic Y3NzLW1vYmlsZS1jbGllbnQ6Y3NzLW1vYmlsZS1zZWNyZXQ=",
        },
        json: true,
        body: {
          username: "root",
          password: "123456",
        },
      };
      const resq = await this.exec(option);
      const res: any = resq;
      console.log("res: ", resq);
      // const user = {
      //   email : res.body.results.object.email,
      //   fullname : res.body.results.object.fullname,
      //   id: res.body.results.object.id,
      //   password: res.body.results.object.password,
      //   access_token: res.body.results.object.access_token,
      //   role: res.body.results.object.role
      // };
      // this.innowayUser = user.email;
      // this.innowayConfig.isLogon = 'true';
      // this.innowayConfig.username = user.email;
      // this.innowayConfig.name = user.fullname;
      // this.innowayConfig.id = user.id;
      // this.innowayConfig.password = user.password;
      // this.innowayConfig.token = user.access_token;
      // this.innowayConfig.employee_type = user.role;
      // this.adminToken = user.access_token;
      // this.onAuthStateChange.next(true);
      // return this.innowayUser;
    } else {
      this.onAuthStateChange.next(false);
      return null;
    }
  }

  async logout() {
    this.innowayConfig.isLogon = "";
    this.innowayConfig.username = "";
    this.innowayConfig.password = "";
    this.innowayConfig.token = "";
    this.innowayConfig.avatarUrl = "";
    this.innowayConfig.id = "";
    this.innowayConfig.email = "";
    this.innowayConfig.firstName = "";
    this.innowayConfig.lastName = "";
    this.innowayConfig.user_id_firebase = "";
    this.innowayConfig.departmentID = "";
    this.adminToken = undefined;
    // this.facebookToken = undefined
    // this.firebaseToken = undefined
    // this.firebaseUser = undefined
    // this.googleToken = undefined
    this.innowayUser = undefined;
    this.onAuthStateChange.next(false);
    location.reload();
    return true;
  }

  get authenticated(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.onAuthStateChange.getValue() !== undefined) {
        resolve(this.onAuthStateChange.getValue() as boolean);
      } else {
        const subscription = this.onAuthStateChange.subscribe((state) => {
          if (subscription) {
            resolve(state as boolean);
            subscription.unsubscribe();
          }
        });
      }
    });
  }

  async sendVerifyEmail() {
    this.firebaseUser.sendEmailVerification({
      url: this.innowayConfig.config.uiHost,
    });
  }
}

export interface IInnowayUser {
  access_token: string;
  username: string;
  password: string;
  type_password: string;
  name?: string;
  employee_type?: string;
  email: string;
  phone?: string;
  status?: number;
  id?: string;
}
