import { CrudAPI, ICrud, CrudOptions } from '../crud';
import { InnowayApiService } from '../../innoway-api.service';
import * as _ from 'lodash';
import * as hash from 'object-hash';
export interface IDistricts extends ICrud {
  name?: string;
}

export class Districts<T> extends CrudAPI<IDistricts> {
  constructor(
    public api: InnowayApiService
  ) {
    super(api, 'districts');
  }

  async getListDistricts(nid: T, rid: T, options?: CrudOptions): Promise<T[]> {
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'GET',
      uri: this.api.innowayConfig.apiUrl('nationalities/' + nid + '/regions/' + rid + '/districts'),
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


  async addDistrict(nid: T, rid: T, data: T, options?: CrudOptions): Promise<T> {
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'POST',
      uri: this.api.innowayConfig.apiUrl('nationalities/' + nid + '/regions/' + rid + '/districts'),
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

  async updateDistrict(nid: T,rid: T, did: T, data: T, options?: CrudOptions): Promise<T> {
    if (!data) { throw new Error('data undefined in edit'); }
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'PUT',
      uri: this.api.innowayConfig.apiUrl('nationalities/' + nid + '/regions/' + rid + '/districts/' + did),
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

  async deleteDistrict(nid: any, rid: any, did: any, options?: CrudOptions) {
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'DELETE',
      uri: this.api.innowayConfig.apiUrl('nationalities/' + nid + '/regions/' + rid + '/districts/' + did),
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
