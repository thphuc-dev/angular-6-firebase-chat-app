import { CrudAPI, ICrud } from '../crud';
import { InnowayApiService } from '../../innoway-api.service';
export interface IRace extends ICrud {
  name?: string;
}

export class Race extends CrudAPI<IRace> {
  constructor(
    public api: InnowayApiService
  ) {
    super(api, 'races');
  }
}
