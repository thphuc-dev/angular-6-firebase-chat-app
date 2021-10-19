import { CrudAPI, ICrud } from '../crud';
import { InnowayApiService } from '../../innoway-api.service';
export interface IPriorityTarget extends ICrud {
  name?: string;
}

export class PriorityTarget extends CrudAPI<IPriorityTarget> {
  constructor(
    public api: InnowayApiService
  ) {
    super(api, 'priorityTargets');
  }
}
