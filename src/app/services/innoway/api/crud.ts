import { BaseAPI } from './base';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { InnowayApiService } from '../innoway-api.service';
import * as _ from 'lodash';
import * as hash from 'object-hash';

export interface CrudOptions {
  reload?: boolean;
  local?: boolean;
  query?: CrudQuery;
  headers?: any;
  decodeUrl?: boolean;
}

export interface CrudQuery {
  filter?: any;
  fields?: any[];
  order?: any[];
  items?: any[];
  limit?: number;
  page?: number;
  offset?: number;
  [x: string]: any;
}

export interface ICrud {
  id?: string;
  created_at?: Date;
  deleted_at?: Date;
  status?: number;
  updated_at?: Date;

  [key: string]: any;
}

export interface ICrudPagination {
  current_page?: number;
  limit?: number;
  next_page?: number;
  prev_page?: number;
  totalItems?: number;
  pageItemsCount?: number;
}

export class CrudAPI<T> extends BaseAPI {
  options: CrudOptions;
  items: BehaviorSubject<T[]>;
  pagination: ICrudPagination;
  localBrandName: string;
  hashCache: {
    [hash: string]: {
      pagination: ICrudPagination
      items: T[]
    }
  };
  activeHashQuery: string;
  activeQuery: CrudQuery = {};
  constructor(
    public api: InnowayApiService,
    public moduleName: string
  ) {
    super(api, moduleName);
    this.options = {
      reload: true, // Auto update items list each request, 'false' to get result only.
      local: true, // Get local data instant request server.
      query: {}
    };
    this.items = new BehaviorSubject<T[]>([]);
    this.pagination = {
      current_page: 0,
      limit: 20,
      next_page: 2,
      prev_page: 0,
      totalItems: 0
    };
    this.hashCache = {};
  }

  async getList(options?: CrudOptions): Promise<T[]> {
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'GET',
      uri: this.apiUrl(),
      params: options.query,
      headers: _.merge({}, {
        'Authorization': this.api.innowayConfig.token
      }, options.headers),
      responseType: 'json',
      decode: options.decodeUrl
    };
    const hashedQuery = hash(options.query);
    this.activeHashQuery = hashedQuery;
    this.activeQuery = options.query;
    const res = await this.exec(setting);
    const results: any = res;
    const pagination: any = res;
    const rows = results.body.data.items as T[];
    if (options.reload) {
      this.pagination.totalItems = results.body.data.totalItems || 0;
    }
    return rows;
  }

  async export(options?: CrudOptions): Promise<T> {
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'GET',
      uri: this.apiUrl(`export`),
      headers: _.merge({}, {
        'User-Agent': 'Request-Promise',
        'Authorization': this.api.innowayConfig.token
      }, options.headers),
    };
    const res: any = await this.exec(setting);
    return res;
  }

  async getItem(id: string, options?: CrudOptions): Promise<T> {
    if (!id) {throw new Error('id undefined in getItem'); }
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'GET',
      uri: this.apiUrl(id),
      params: options.query,
      headers: _.merge({}, {
        'Authorization': this.api.innowayConfig.token
      }, options.headers),
      responseType: 'json'
    };
    const hashedQuery = hash(options.query);
    if (this.localBrandName !== this.api.innowayConfig.brandName) {
      this.localBrandName = this.api.innowayConfig.brandName;
    }
    const resp = await this.exec(setting);
    const res: any = resp;
    const row = res.body.data as T;
    if (options.reload) {
      if (hashedQuery === this.activeHashQuery && this.hashCache[this.activeHashQuery]) {
        const items = this.items.getValue();
        const index = _.findIndex(items, { id: id } as any);
        if (index > -1) {
          items[index] = row;
        } else {
          items.push(row);
        }
        this.hashCache[this.activeHashQuery].items = items;
        this.hashCache = {
          [this.activeHashQuery]: this.hashCache[this.activeHashQuery]
        };
        this.items.next(items);
      } else {
        if (!this.hashCache[hashedQuery]) {
            this.hashCache[hashedQuery] = {
            pagination: {},
            items: []
          };
        }
        const index = _.findIndex(this.hashCache[hashedQuery].items, { id: id } as any);
        if (index > -1) {
          this.hashCache[hashedQuery].items[index] = row;
        } else {
          this.hashCache[hashedQuery].items.push(row);
        }
      }
    }
    return row;
  }

  async add(data: T, options?: CrudOptions): Promise<T> {
    if (!data) { throw new Error('data undefined in add'); }
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'POST',
      uri: this.apiUrl(),
      params: options.query,
      headers: _.merge({}, {
        'Authorization': this.api.innowayConfig.token
      }, options.headers),
      body: data,
      responseType: 'json'
    };
    const resp = await this.exec(setting);
    const res: any = resp;
    const row = res.body.data as T;
    return row;
  }

  async update(id: string, data: T, options?: CrudOptions): Promise<T> {
    if (!id) { throw new Error('id undefined in edit'); }
    if (!data) { throw new Error('data undefined in edit'); }
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'PUT',
      uri: this.apiUrl(id),
      params: options.query,
      headers: _.merge({}, {
        'Authorization': this.api.innowayConfig.token
      }, options.headers),
      body: data,
      responseType: 'json'
    };
    const resp = await this.exec(setting);
    const res: any = resp;
    const row = res.body.data as T;
    return row;
  }

  async delete(id: string, options?: CrudOptions) {
    if (!id) { throw new Error('id undefined in delete'); }
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'DELETE',
      uri: this.apiUrl(id),
      params: options.query,
      headers: _.merge({}, {
        'content-type': 'application/json',
        'Authorization': this.api.innowayConfig.token
      }, options.headers),
      responseType: 'json'
    };
    const res = await this.exec(setting);

    if (options.reload) {
      const items = this.items.getValue();
      const removed = _.remove(items, function(item) {
        return (item as any).id === id;
      });
      if (removed.length > 0) {
        if (this.activeHashQuery && this.hashCache[this.activeHashQuery]) {
          this.hashCache[this.activeHashQuery].items = items;
        }
        this.items.next(items);
      } else {
        await this.getList({ local: false, query: this.activeQuery });
      }
      if (this.activeHashQuery) {
        this.hashCache = {
          [this.activeHashQuery]: this.hashCache[this.activeHashQuery]
        };
      }
    }
    return true;
  }

  async deleteAll(ids: string[], options?: CrudOptions) {
    if (!ids) { throw new Error('ids undefined in deleteAll'); }
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'DELETE',
      uri: this.apiUrl(),
      params: _.merge({}, {
        items: ids
      }, options.query),
      headers: _.merge({}, {
        'content-type': 'application/json',
        'Authorization': this.api.innowayConfig.token
      }, options.headers),
      responseType: 'json'
    };
    const res: any = await this.exec(setting);
    if (options.reload) {
      const items = this.items.getValue();
      const removed = _.remove(items, function(item) {
        return _.indexOf(ids, (item as any).id) !== -1;
      });
      if (removed.length > 0) {
        if (this.activeHashQuery && this.hashCache[this.activeHashQuery]) {
          this.hashCache[this.activeHashQuery].items = items;
        }
        this.items.next(items);
      } else {
        await this.getList({ local: false, query: this.activeQuery });
      }
      if (this.activeHashQuery) {
        this.hashCache = {
          [this.activeHashQuery]: this.hashCache[this.activeHashQuery]
        };
      }
    }
    return true;
  }

  protected _paserQuery(query: CrudQuery = {}) {
    const parsedQuery = _.merge({}, query);

    if (query.filter) {
      parsedQuery.filter = JSON.stringify(query.filter);
    }
    if (query.order) {
      parsedQuery.order = JSON.parse(JSON.stringify(query.order)) as any[];
    }
    if (query.scopes) {
      parsedQuery.scopes = JSON.parse(JSON.stringify(query.scopes)) as any[];
    }
    if (query.fields) {
      parsedQuery.fields = JSON.parse(JSON.stringify(query.fields)) as any[];
    }
    if (query.items) {
      parsedQuery.items = JSON.parse(JSON.stringify(query.items)) as any[];
    }
    return parsedQuery;
  }
}
