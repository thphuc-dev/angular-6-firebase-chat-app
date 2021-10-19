import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
@Injectable()
export class InnowayConfigService {

  constructor() {
    this.config = {
      host: environment.innoway.host,
      version: environment.innoway.version,
      uiHost: environment.innoway.uiHost,
      username: '',
      password: '',
      isLogon: '',
      token: '',
      id: '',
      user_id_firebase: '',
      departmentID: '',
      avatarUrl: '',
      firstName: '',
      lastName: '',
      email: '',
    };
  }

  config: {
    host: string
    version: string,
    uiHost: string,
    username: string,
    password: string,
    isLogon: string,
    token: string,
    id: string,
    user_id_firebase: string,
    departmentID: string,
    avatarUrl: string,
    firstName: string,
    lastName: string,
    email: string
  };

  apiUrl(path: string = '') {
    return `${this.config.host}/api/${path}`;
  }

  get brandName() {
    return localStorage.getItem('innoway.brandName');
  }

  set brandName(value: string) {
    localStorage.setItem('innoway.brandName', value);
  }

  get isLogon() {
    return localStorage.getItem('innoway.isLogon');
  }

  set isLogon(value: string) {
    localStorage.setItem('innoway.isLogon', value);
  }

  get token() {
    return 'Bearer ' + localStorage.getItem('innoway.token');
  }

  set token(value: string) {
    localStorage.setItem('innoway.token', value);
  }

  get username() {
    return localStorage.getItem('innoway.username');
  }

  set username(value: string) {
    localStorage.setItem('innoway.username', value);
  }

  get id() {
    return localStorage.getItem('innoway.id');
  }

  set id(value: string) {
    localStorage.setItem('innoway.id', value);
  }

  get password() {
    return localStorage.getItem('innoway.password');
  }

  set password(value: string) {
    localStorage.setItem('innoway.password', value);
  }

  get user_id_firebase() {
    return localStorage.getItem('innoway.user_id_firebase');
  }

  set user_id_firebase(value: string) {
    localStorage.setItem('innoway.user_id_firebase', value);
  }
  get departmentID() {
    return localStorage.getItem('innoway.departmentID');
  }

  set departmentID(value: string) {
    localStorage.setItem('innoway.departmentID', value);
  }
  get avatarUrl() {
    return localStorage.getItem('innoway.avatarUrl');
  }

  set avatarUrl(value: string) {
    localStorage.setItem('innoway.avatarUrl', value);
  }
  get lastName() {
    return localStorage.getItem('innoway.lastName');
  }

  set lastName(value: string) {
    localStorage.setItem('innoway.lastName', value);
  }
  get firstName() {
    return localStorage.getItem('innoway.firstName');
  }

  set firstName(value: string) {
    localStorage.setItem('innoway.firstName', value);
  }
  get email() {
    return localStorage.getItem('innoway.email');
  }

  set email(value: string) {
    localStorage.setItem('innoway.email', value);
  }
}
