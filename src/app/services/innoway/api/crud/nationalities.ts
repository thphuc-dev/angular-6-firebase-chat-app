import { CrudAPI, ICrud, CrudOptions } from '../crud';
import { InnowayApiService } from '../../innoway-api.service';
import * as _ from 'lodash';
import * as hash from 'object-hash';
export interface INationalities extends ICrud {
  name?: string;
}

export class Nationalities<T> extends CrudAPI<INationalities> {
  constructor(
    public api: InnowayApiService
  ) {
    super(api, 'nationalities');
  }
}
