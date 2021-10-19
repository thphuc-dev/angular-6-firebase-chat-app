import { CrudAPI, ICrud, CrudOptions } from '../crud';
import { InnowayApiService } from '../../innoway-api.service';
import * as _ from 'lodash';
import * as hash from 'object-hash';
export interface IApiRoutes extends ICrud {
  name?: string;
}

export class ApiRoutes<T> extends CrudAPI<IApiRoutes> {
  constructor(
    public api: InnowayApiService
  ) {
    super(api, 'routes');
  }

  async getListApis(options?: CrudOptions): Promise<T[]> {
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'GET',
      uri: this.api.innowayConfig.apiUrl('routes'),
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
    const rows = results.body.data as T[];
    return rows;
  }

  async getListRoleApisOfStaff(id: any, options?: CrudOptions): Promise<T[]> {
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'GET',
      uri: this.api.innowayConfig.apiUrl('roles/' + id + '/apis'),
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
    const rows = results.body.data as T[];
    return rows;
  }

  async updateRoleApis(id: any, data: T, options?: CrudOptions): Promise<T> {
    console.log('data', data)
    if (!data) { throw new Error('data undefined in edit'); }
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'PUT',
      uri: this.api.innowayConfig.apiUrl('roles/' + id + '/apis'),
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
}
