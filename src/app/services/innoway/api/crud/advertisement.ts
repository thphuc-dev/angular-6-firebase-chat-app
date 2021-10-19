import { CrudAPI, ICrud } from '../crud';
import { InnowayApiService } from '../../innoway-api.service';
export interface IAdvertisement extends ICrud {
  name?: string;
}

export class Advertisement extends CrudAPI<IAdvertisement> {
  constructor(
    public api: InnowayApiService
  ) {
    super(api, 'advertisements');
  }
}
