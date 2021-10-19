import { CrudAPI, ICrud, CrudOptions } from '../crud';
import { InnowayApiService } from '../../innoway-api.service';
import * as _ from 'lodash';
import * as hash from 'object-hash';
export interface IAnnouncement extends ICrud {
  name?: string;
}

export class Announcement<T> extends CrudAPI<IAnnouncement> {
  constructor(
    public api: InnowayApiService
  ) {
    super(api, 'announcements');
  }
}
