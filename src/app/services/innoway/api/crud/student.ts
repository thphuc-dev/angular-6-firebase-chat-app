import { CrudAPI, ICrud , CrudOptions} from '../crud';
import { InnowayApiService } from '../../innoway-api.service';
import * as _ from 'lodash';
import * as hash from 'object-hash';
export interface IStudent extends ICrud {
  name?: string;
}

export class Student<T> extends CrudAPI<IStudent> {
  constructor(
    public api: InnowayApiService
  ) {
    super(api, 'students');
  }

}
