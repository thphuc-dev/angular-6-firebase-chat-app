import { CrudAPI, ICrud, CrudOptions } from '../crud';
import { InnowayApiService } from '../../innoway-api.service';
import * as _ from 'lodash';
export interface IAuth extends ICrud {
  name?: string;
  oldPassword?: string;
  newPassword?: string;
}

export class Auth<T> extends CrudAPI<IAuth> {
  constructor(
    public api: InnowayApiService
  ) {
    super(api, 'auth');
  }

  async changePassword(oldPassword: T, newPassword: T, options?: CrudOptions): Promise<T> {
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'PUT',
      uri: this.api.innowayConfig.apiUrl('auth/users/password'),
      params: options.query,
      headers: _.merge({}, {
        'Authorization': this.api.innowayConfig.token
      }, options.headers),
      body: {
        oldPassword, newPassword
      },
      responseType: 'json'
    };
    const resp = await this.exec(setting);
    const res: any = resp;
    console.log('res: ', resp);
    const row = res.body.data as T;
    return row;
  }
}
