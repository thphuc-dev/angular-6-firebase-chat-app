import { CrudAPI, ICrud, CrudOptions } from '../crud';
import { InnowayApiService } from '../../innoway-api.service';
import * as _ from 'lodash';
import * as hash from 'object-hash';
import { database } from 'firebase';
export interface IStaff extends ICrud {
  firstName?: string;
  lastName?: string;
  email?: string;
  department?: string;
  avatarUrl?: string;
}

export class Staff<T> extends CrudAPI<IStaff> {
  constructor(
    public api: InnowayApiService
  ) {
    super(api, 'staffs');
  }

  async registerStaff(data: IStaff, options?: CrudOptions): Promise<T> {
    if (!data) { throw new Error('data undefined in add'); }
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'POST',
      uri: this.api.innowayConfig.apiUrl('management/staffs/registration'),
      params: options.query,
      headers: _.merge({}, { // headers
        'Authorization': this.api.innowayConfig.token
      }, options.headers),
      body: data,
      json: true // Automatically parses the JSON string in the response
    };
    const resp = await this.exec(setting);
    const res: any = resp;
    const row = res.body as T;
    return row;
  }

  async getListStaffs(options?: CrudOptions): Promise<T[]> {
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'GET',
      uri: this.api.innowayConfig.apiUrl('management/staffs'),
      params: options.query,
      headers: _.merge({}, {
        'Authorization': this.api.innowayConfig.token
      }, options.headers),
      responseType: 'json',
      decode: options.decodeUrl
    };
    const hashedQuery = hash(options.query);
    this.activeHashQuery = hashedQuery;
    this.activeQuery = options.query;
    const res = await this.exec(setting);
    const results: any = res;
    const pagination: any = res;
    const rows = results.body.data.items as T[];
    if (options.reload) {
      this.pagination.totalItems = results.body.data.totalItems || 0;
    }
    return rows;
  }

  async deleteStaff(id: string, options?: CrudOptions) {
    if (!id) { throw new Error('id undefined in delete'); }
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'DELETE',
      uri: this.api.innowayConfig.apiUrl('management/users/' + id),
      params: options.query,
      headers: _.merge({}, {
        'Authorization': this.api.innowayConfig.token
      }, options.headers),
      responseType: 'json'
    };
    const res = await this.exec(setting);
    return true;
  }

  async uploadAvatarStaff(image: File, options?: CrudOptions) {
    options = _.merge({}, this.options, options);
    const formData: FormData = new FormData();
    formData.append('image', image, image.name);
    const setting = {
      method: 'PUT',
      uri: this.api.innowayConfig.apiUrl('staffs/avatar/'),
      params: options.query,
      headers: _.merge({}, {
        'Authorization': this.api.innowayConfig.token
      }, options.headers),
      body: formData,
      responseType: 'json'
    };
    const res: any = await this.exec(setting);
    const result = res.body.data;
    return result;
  }

  async getProfileOfStaff(options?: CrudOptions): Promise<T> {
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'GET',
      uri: this.api.innowayConfig.apiUrl('staffs/profile/'),
      params: options.query,
      headers: _.merge({}, {
        'Authorization': this.api.innowayConfig.token
      }, options.headers),
      responseType: 'json'
    };
    const resp = await this.exec(setting);
    const res: any = resp;
    const row = res.body.data as T;
    return row;
  }

  async updateInfo(data: T, options?: CrudOptions): Promise<T> {
    if (!data) { throw new Error('data undefined in edit'); }
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'PUT',
      uri: this.api.innowayConfig.apiUrl('staffs/profile/'),
      params: options.query,
      headers: _.merge({}, {
        'Authorization': this.api.innowayConfig.token
      }, options.headers),
      body: data,
      responseType: 'json'
    };
    const resp = await this.exec(setting);
    const res: any = resp;
    const row = res.body.data as T;
    return row;
  }

  async getProfileStaff(id: string, options?: CrudOptions): Promise<T> {
    if (!id) {throw new Error('id undefined in getItem'); }
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'GET',
      uri: this.api.innowayConfig.apiUrl('management/staffs/' + id + '/profile'),
      params: options.query,
      headers: _.merge({}, {
        'Authorization': this.api.innowayConfig.token
      }, options.headers),
      responseType: 'json'
    };
    const resp = await this.exec(setting);
    const res: any = resp;
    const row = res.body.data as T;
    return row;
  }

  async staffComment(data: IStaff, options?: CrudOptions): Promise<T> {
    if (!data) { throw new Error('data undefined in add'); }
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'POST',
      uri: this.api.innowayConfig.apiUrl('staffs/comments'),
      params: options.query,
      headers: _.merge({}, { // headers
        'Authorization': this.api.innowayConfig.token
      }, options.headers),
      body: data,
      json: true // Automatically parses the JSON string in the response
    };
    const resp = await this.exec(setting);
    const res: any = resp;
    const row = res.body as T;
    return row;
  }

  async getListCommentsOfStudent(options?: CrudOptions): Promise<T[]> {
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'GET',
      uri: this.api.innowayConfig.apiUrl('staffs/comments'),
      params: options.query,
      headers: _.merge({}, {
        'Authorization': this.api.innowayConfig.token
      }, options.headers),
      responseType: 'json',
      decode: options.decodeUrl
    };
    const hashedQuery = hash(options.query);
    this.activeHashQuery = hashedQuery;
    this.activeQuery = options.query;
    const res = await this.exec(setting);
    const results: any = res;
    const pagination: any = res;
    const rows = results.body.data.items as T[];
    if (options.reload) {
      this.pagination.totalItems = results.body.data.totalItems || 0;
    }
    return rows;
  }

  async staffEditComment(id: any, data: IStaff, options?: CrudOptions): Promise<T> {
    if (!data) { throw new Error('data undefined in add'); }
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'PUT',
      uri: this.api.innowayConfig.apiUrl('staffs/comments/' + id),
      params: options.query,
      headers: _.merge({}, { // headers
        'Authorization': this.api.innowayConfig.token
      }, options.headers),
      body: data,
      json: true // Automatically parses the JSON string in the response
    };
    const resp = await this.exec(setting);
    const res: any = resp;
    const row = res.body as T;
    return row;
  }

  async deleteComment(id: string, options?: CrudOptions) {
    if (!id) { throw new Error('id undefined in delete'); }
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'DELETE',
      uri: this.api.innowayConfig.apiUrl('staffs/comments/' + id),
      params: options.query,
      headers: _.merge({}, {
        'Authorization': this.api.innowayConfig.token
      }, options.headers),
      responseType: 'json'
    };
    const res = await this.exec(setting);
    return true;
  }

  async enableRegistrations(status: any, options?: CrudOptions): Promise<T> {
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'PUT',
      uri: this.api.innowayConfig.apiUrl('management/studentRooms/registrations/enable/' + status),
      params: options.query,
      headers: _.merge({}, { // headers
        'Authorization': this.api.innowayConfig.token
      }, options.headers),
      json: true // Automatically parses the JSON string in the response
    };
    const resp = await this.exec(setting);
    const res: any = resp;
    const row = res.body as T;
    return row;
  }

  async getListStudents( options?: CrudOptions): Promise<T[]> {
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'GET',
      uri: this.api.innowayConfig.apiUrl('management/users/students'),
      params: options.query,
      headers: _.merge({}, {
        'Authorization': this.api.innowayConfig.token
      }, options.headers),
      responseType: 'json',
      decode: options.decodeUrl
    };
    const hashedQuery = hash(options.query);
    this.activeHashQuery = hashedQuery;
    this.activeQuery = options.query;
    const res = await this.exec(setting);
    const results: any = res;
    const pagination: any = res;
    const rows = results.body.data.items as T[];
    if (options.reload) {
      this.pagination.totalItems = results.body.data.totalItems || 0;
    }
    return rows;
  }

  async addStudent(data: any, options?: CrudOptions): Promise<T> {
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'POST',
      uri: this.api.innowayConfig.apiUrl('management/students/registration'),
      params: options.query,
      headers: _.merge({}, {
        'Authorization': this.api.innowayConfig.token
      }, options.headers),
      body: data,
      responseType: 'json'
    };
    const resp = await this.exec(setting);
    const res: any = resp;
    const row = res.body.data as T;
    return row;
  }

  async searchStudent(data: any, options?: CrudOptions): Promise<T[]> {
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'POST',
      uri: this.api.innowayConfig.apiUrl('management/students'),
      params: options.query,
      headers: _.merge({}, {
        'Authorization': this.api.innowayConfig.token
      }, options.headers),
      body: data,
      responseType: 'json'
    };
    const resp = await this.exec(setting);
    const res: any = resp;
    const results: any = res;
    const pagination: any = res;
    const rows = results.body.data.items as T[];
    if (options.reload) {
      this.pagination.totalItems = results.body.data.totalItems || 0;
    }
    return rows;
  }

  async deleteStudent(data: any, options?: CrudOptions) {
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'DELETE',
      uri: this.api.innowayConfig.apiUrl('management/users/'),
      params: options.query,
      headers: _.merge({}, {
        'Authorization': this.api.innowayConfig.token
      }, options.headers),
      body: data,
      responseType: 'json'
    };
    const res = await this.exec(setting);
    return true;
  }

  async getListStudentsRegisterRoomType(data: any, options?: CrudOptions): Promise<T[]> {
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'POST',
      uri: this.api.innowayConfig.apiUrl('management/studentRooms/registrations'),
      params: options.query,
      headers: _.merge({}, {
        'Authorization': this.api.innowayConfig.token
      }, options.headers),
      responseType: 'json',
      body: data,
      decode: options.decodeUrl
    };
    const hashedQuery = hash(options.query);
    this.activeHashQuery = hashedQuery;
    this.activeQuery = options.query;
    const res = await this.exec(setting);
    const results: any = res;
    const pagination: any = res;
    const rows = results.body.data.items as T[];
    if (options.reload) {
      this.pagination.totalItems = results.body.data.totalItems || 0;
    }
    return rows;
  }

  async reservationForStudent(id: any, data: any, options?: CrudOptions): Promise<T> {
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'PUT',
      uri: this.api.innowayConfig.apiUrl('management/students/' + id + '/room'),
      params: options.query,
      headers: _.merge({}, {
        'Authorization': this.api.innowayConfig.token
      }, options.headers),
      body: data,
      responseType: 'json'
    };
    let resp: any;
    try {
      resp = await this.exec(setting);
    } catch (err){
      resp = err;
      throw resp;
    }
    const res: any = resp;
    const row = res as T;
    return row;
  }

  async banOneStudent(id: string, options?: CrudOptions) {
    if (!id) { throw new Error('id undefined in delete'); }
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'POST',
      uri: this.api.innowayConfig.apiUrl('management/users/banned/' + id),
      params: options.query,
      headers: _.merge({}, {
        'Authorization': this.api.innowayConfig.token
      }, options.headers),
      responseType: 'json'
    };
    const res = await this.exec(setting);
    return true;
  }

  async unBanOneStudent(id: string, options?: CrudOptions) {
    if (!id) { throw new Error('id undefined in delete'); }
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'POST',
      uri: this.api.innowayConfig.apiUrl('management/users/banned/' + id + '/cancel'),
      params: options.query,
      headers: _.merge({}, {
        'Authorization': this.api.innowayConfig.token
      }, options.headers),
      responseType: 'json'
    };
    const res = await this.exec(setting);
    return true;
  }

  async getProfileStudent(id: any,  options?: CrudOptions): Promise<T[]> {
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'GET',
      uri: this.api.innowayConfig.apiUrl('management/students/' + id),
      params: options.query,
      headers: _.merge({}, {
        'Authorization': this.api.innowayConfig.token
      }, options.headers),
      responseType: 'json',
      decode: options.decodeUrl
    };
    const res = await this.exec(setting);
    const results: any = res;
    const rows = results.body.data as T[];
    return rows;
  }

  async verifiedStudent(id: string, status: boolean, options?: CrudOptions) {
    if (!id) { throw new Error('id undefined in delete'); }
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'PUT',
      uri: this.api.innowayConfig.apiUrl('management/students/verified/' +  status),
      params: options.query,
      headers: _.merge({}, {
        'Authorization': this.api.innowayConfig.token
      }, options.headers),
      body: id,
      responseType: 'json'
    };
    const res: any = await this.exec(setting);
    const row = res.body.data as T;
    return row;
  }

  async updateRoomTypeForStudent(id: any, roomTypeId: any, options?: CrudOptions): Promise<T> {
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'POST',
      uri: this.api.innowayConfig.apiUrl('management/students/'+ id +'/roomType/' + roomTypeId),
      params: options.query,
      headers: _.merge({}, { // headers
        'Authorization': this.api.innowayConfig.token
      }, options.headers),
      json: true // Automatically parses the JSON string in the response
    };
    const resp = await this.exec(setting);
    const res: any = resp;
    const row = res.body as T;
    return row;
  }
  async updateRegistrationRoomTypeForStudent(id: any, roomTypeId: any, options?: CrudOptions): Promise<T> {
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'PUT',
      uri: this.api.innowayConfig.apiUrl('management/studentRooms/registrations/students/'+ id +'/roomType/' + roomTypeId),
      params: options.query,
      headers: _.merge({}, { // headers
        'Authorization': this.api.innowayConfig.token
      }, options.headers),
      json: true // Automatically parses the JSON string in the response
    };
    const resp = await this.exec(setting);
    const res: any = resp;
    const row = res.body as T;
    return row;
  }

  async verifiedRegistrationRoomTypeForStudent(data: any, status: any, options?: CrudOptions): Promise<T> {
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'PUT',
      uri: this.api.innowayConfig.apiUrl('management/studentRooms/registrations/verified/'+ status ),
      params: options.query,
      headers: _.merge({}, { // headers
        'Authorization': this.api.innowayConfig.token
      }, options.headers),
      body: data,
      json: true // Automatically parses the JSON string in the response
    };
    const resp = await this.exec(setting);
    const res: any = resp;
    const row = res.body as T;
    return row;
  }

  async kickStudent(data: any, options?: CrudOptions) {
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'DELETE',
      uri: this.api.innowayConfig.apiUrl('management/students/rooms'),
      params: options.query,
      headers: _.merge({}, {
        'Authorization': this.api.innowayConfig.token
      }, options.headers),
      body: data,
      responseType: 'json'
    };
    const res = await this.exec(setting);
    return true;
  }

  async getStatusStudentRoomRegistration(options?: CrudOptions): Promise<T[]> {
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'GET',
      uri: this.api.innowayConfig.apiUrl('management/studentRooms/registrations/status'),
      params: options.query,
      headers: _.merge({}, {
        'Authorization': this.api.innowayConfig.token
      }, options.headers),
      responseType: 'json',
      decode: options.decodeUrl
    };
    const res = await this.exec(setting);
    const results: any = res;
    const rows = results.body.data.enabled as T[];
    return rows;
  }

  async exportExcelListStudents(data: any, options?: CrudOptions): Promise<T[]> {
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'POST',
      uri: this.api.innowayConfig.apiUrl('management/students/excel/export'),
      params: options.query,
      headers: _.merge({}, {
        'Authorization': this.api.innowayConfig.token
      }, options.headers),
      body: data,
      responseType: 'json'
    };
    const resp = await this.exec(setting);
    const res: any = resp;
    const results: any = res;
    const rows = results.body.data as T[];
    return rows;
  }

  async exportPdfListStudents(data: any, options?: CrudOptions): Promise<T[]> {
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'POST',
      uri: this.api.innowayConfig.apiUrl('management/students/profile/pdf/export'),
      params: options.query,
      headers: _.merge({}, {
        'Authorization': this.api.innowayConfig.token
      }, options.headers),
      body: data,
      responseType: 'json'
    };
    const resp = await this.exec(setting);
    const res: any = resp;
    const results: any = res;
    const rows = results.body.data as T[];
    return rows;
  }
}
