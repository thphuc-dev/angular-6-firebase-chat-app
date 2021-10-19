import { CrudAPI, ICrud, CrudOptions } from '../crud';
import { InnowayApiService } from '../../innoway-api.service';
import * as _ from 'lodash';
import * as hash from 'object-hash';
export interface IMajor extends ICrud {
  name?: string;
}

export class Major<T> extends CrudAPI<IMajor> {
  constructor(
    public api: InnowayApiService
  ) {
    super(api, 'majors');
  }


  async getListMajors(sid: T, options?: CrudOptions): Promise<T[]> {
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'GET',
      uri: this.api.innowayConfig.apiUrl('schools/' + sid + '/majors'),
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

  async addMajor(sid: T, mid: T, options?: CrudOptions): Promise<T> {
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'POST',
      uri: this.api.innowayConfig.apiUrl('schools/' + sid + '/majors/' + mid),
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

  async updateMajor(sid: T, mid: T, options?: CrudOptions): Promise<T> {
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'POST',
      uri: this.api.innowayConfig.apiUrl('schools/' + sid + '/majors/' + mid),
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

  async deleteMajor(sid: any, mid: any, options?: CrudOptions) {
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'DELETE',
      uri: this.api.innowayConfig.apiUrl('schools/' + sid + '/majors/' + mid),
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
}
