import { CrudAPI, ICrud, CrudOptions } from '../crud';
import { InnowayApiService } from '../../innoway-api.service';
import * as _ from 'lodash';
import * as hash from 'object-hash';
export interface IRole extends ICrud {
  name?: string;
}

export class Role<T> extends CrudAPI<IRole> {
  constructor(
    public api: InnowayApiService
  ) {
    super(api, 'roles');
  }

}
