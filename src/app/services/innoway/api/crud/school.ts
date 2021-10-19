import { CrudAPI, ICrud, CrudOptions } from '../crud';
import { InnowayApiService } from '../../innoway-api.service';
import * as _ from 'lodash';
import * as hash from 'object-hash';
export interface ISchool extends ICrud {
  name?: string;
}

export class School<T> extends CrudAPI<ISchool> {
  constructor(
    public api: InnowayApiService
  ) {
    super(api, 'schools');
  }
}
