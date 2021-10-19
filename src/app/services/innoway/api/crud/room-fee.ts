import { CrudAPI, ICrud, CrudOptions } from '../crud';
import { InnowayApiService } from '../../innoway-api.service';
import * as _ from 'lodash';
import * as hash from 'object-hash';
export interface IRoomFee extends ICrud {
  name?: string;
  unit?: string;
  fee?: number;
  priority?: number;
}

export class RoomFee<T> extends CrudAPI<IRoomFee> {
  constructor(
    public api: InnowayApiService
  ) {
    super(api, 'roomFees');
  }

}
