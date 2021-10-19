import { CrudAPI, ICrud , CrudOptions} from '../crud';
import { InnowayApiService } from '../../innoway-api.service';
import * as _ from 'lodash';
import * as hash from 'object-hash';
export interface IBill extends ICrud {
  name?: string;
}

export class Bill<T> extends CrudAPI<IBill> {
  constructor(
    public api: InnowayApiService
  ) {
    super(api, 'bills');
  }

  async searchPersonalBill(options?: CrudOptions): Promise<T[]> {
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'GET',
      uri: this.api.innowayConfig.apiUrl('management/v2/personalBills'),
      params: options.query,
      headers: _.merge({}, {
        'Authorization': this.api.innowayConfig.token
      }, options.headers),
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

  async addPersonalBill(data: any,options?: CrudOptions): Promise<T> {
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'POST',
      uri: this.api.innowayConfig.apiUrl('management/v2/personalBills/rooms/'),
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

  async addPersonalBillRoomTypeRegistration(data: any,options?: CrudOptions): Promise<T> {
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'POST',
      uri: this.api.innowayConfig.apiUrl('management/v2/personalBills/roomTypeRegistrations/'),
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

  async payPersonalBill(id: string, isPaid: T, options?: CrudOptions): Promise<T> {
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'PUT',
      uri: this.api.innowayConfig.apiUrl('management/v2/personalBills/' + id + '/isPaid/' + isPaid),
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

  async deletePersonalBill(id: string, options?: CrudOptions) {
    if (!id) { throw new Error('id undefined in delete'); }
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'DELETE',
      uri: this.api.innowayConfig.apiUrl('management/v2/personalBills/' + id),
      params: options.query,
      headers: _.merge({}, {
        'content-type': 'application/json',
        'Authorization': this.api.innowayConfig.token
      }, options.headers),
      responseType: 'json'
    };
    const res = await this.exec(setting);
    return true;
  }

  async searchSharedBill(options?: CrudOptions): Promise<T[]> {
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'GET',
      uri: this.api.innowayConfig.apiUrl('management/v2/sharedBills'),
      params: options.query,
      headers: _.merge({}, {
        'Authorization': this.api.innowayConfig.token
      }, options.headers),
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

  async addSharedBill(rid: string,data: any,  options?: CrudOptions): Promise<T> {
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'POST',
      uri: this.api.innowayConfig.apiUrl('management/v2/sharedBills/rooms/' + rid),
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

  async paySharedBill(id: string, isPaid: T, options?: CrudOptions): Promise<T> {
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'PUT',
      uri: this.api.innowayConfig.apiUrl('management/v2/sharedBills/' + id + '/isPaid/' + isPaid),
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

  async deleteSharedBill(id: string, options?: CrudOptions) {
    if (!id) { throw new Error('id undefined in delete'); }
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'DELETE',
      uri: this.api.innowayConfig.apiUrl('management/v2/sharedBills/' + id),
      params: options.query,
      headers: _.merge({}, {
        'content-type': 'application/json',
        'Authorization': this.api.innowayConfig.token
      }, options.headers),
      responseType: 'json'
    };
    const res = await this.exec(setting);
    return true;
  }

  async verifiedPersonalBill(data: any,status: boolean, options?: CrudOptions) {
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'PUT',
      uri: this.api.innowayConfig.apiUrl('management/v2/personalBills/verified/' +  status),
      params: options.query,
      headers: _.merge({}, {
        'Authorization': this.api.innowayConfig.token
      }, options.headers),
      responseType: 'json',
      body: data,
      decode: options.decodeUrl
    };
    const res: any = await this.exec(setting);
    const row = res.body.data as T;
    return row;
  }

  async updatePersonalBill(id: any, data: any, options?: CrudOptions) {
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'PUT',
      uri: this.api.innowayConfig.apiUrl('management/v2/personalBills/' +  id),
      params: options.query,
      headers: _.merge({}, {
        'Authorization': this.api.innowayConfig.token
      }, options.headers),
      responseType: 'json',
      body: data,
      decode: options.decodeUrl
    };
    const res: any = await this.exec(setting);
    const row = res.body.data as T;
    return row;
  }

  async updateSharedBill(id: any, data: any, options?: CrudOptions) {
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'PUT',
      uri: this.api.innowayConfig.apiUrl('management/v2/sharedBills/' +  id),
      params: options.query,
      headers: _.merge({}, {
        'Authorization': this.api.innowayConfig.token
      }, options.headers),
      responseType: 'json',
      body: data,
      decode: options.decodeUrl
    };
    const res: any = await this.exec(setting);
    const row = res.body.data as T;
    return row;
  }

  async verifiedSharedBill(data: any,status: boolean, options?: CrudOptions) {
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'PUT',
      uri: this.api.innowayConfig.apiUrl('management/v2/sharedBills/verified/' +  status),
      params: options.query,
      headers: _.merge({}, {
        'Authorization': this.api.innowayConfig.token
      }, options.headers),
      responseType: 'json',
      body: data,
      decode: options.decodeUrl
    };
    const res: any = await this.exec(setting);
    const row = res.body.data as T;
    return row;
  }


  async exportPdfPersonalBills(id: any, options?: CrudOptions) {
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'POST',
      uri: this.api.innowayConfig.apiUrl('management/v2/personalBills/' +  id + '/pdf/export'),
      params: options.query,
      headers: _.merge({}, {
        'Authorization': this.api.innowayConfig.token
      }, options.headers),
      responseType: 'json',
      decode: options.decodeUrl
    };
    const res: any = await this.exec(setting);
    const row = res.body.data as T;
    return row;
  }


  async exportPdfSharedBills(id: any, options?: CrudOptions) {
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'POST',
      uri: this.api.innowayConfig.apiUrl('management/v2/sharedBills/' +  id + '/pdf/export'),
      params: options.query,
      headers: _.merge({}, {
        'Authorization': this.api.innowayConfig.token
      }, options.headers),
      responseType: 'json',
      decode: options.decodeUrl
    };
    const res: any = await this.exec(setting);
    const row = res.body.data as T;
    return row;
  }


  async exportExcelSharedBills(options?: CrudOptions) {
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'POST',
      uri: this.api.innowayConfig.apiUrl('management/v2/sharedBills/excel/export'),
      params: options.query,
      headers: _.merge({}, {
        'Authorization': this.api.innowayConfig.token
      }, options.headers),
      responseType: 'json',
      decode: options.decodeUrl
    };
    const res: any = await this.exec(setting);
    const row = res.body.data as T;
    return row;
  }

  async exportExcelPersonalBills(options?: CrudOptions) {
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'POST',
      uri: this.api.innowayConfig.apiUrl('management/v2/personalBills/excel/export'),
      params: options.query,
      headers: _.merge({}, {
        'Authorization': this.api.innowayConfig.token
      }, options.headers),
      responseType: 'json',
      decode: options.decodeUrl
    };
    const res: any = await this.exec(setting);
    const row = res.body.data as T;
    return row;
  }
}
