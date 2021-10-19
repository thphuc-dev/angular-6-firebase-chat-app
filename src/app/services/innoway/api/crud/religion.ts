import { CrudAPI, ICrud } from '../crud';
import { InnowayApiService } from '../../innoway-api.service';
export interface IReligion extends ICrud {
  name?: string;
}

export class Religion extends CrudAPI<IReligion> {
  constructor(
    public api: InnowayApiService
  ) {
    super(api, 'religions');
  }
}
