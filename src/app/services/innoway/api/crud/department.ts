import { CrudAPI, ICrud, CrudOptions } from '../crud';
import { InnowayApiService } from '../../innoway-api.service';
import * as _ from 'lodash';
export interface IDepartment extends ICrud {
  username?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  roleName?: string;
  departmentID?: string;
}

export class Department<T> extends CrudAPI<IDepartment> {
  constructor(
    public api: InnowayApiService
  ) {
    super(api, 'departments');
  }
}
