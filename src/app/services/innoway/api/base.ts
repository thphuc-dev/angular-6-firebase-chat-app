import { InnowayApiService } from '../innoway-api.service';
import * as Console from 'console-prefix';
import { HttpRequest, HttpHeaders, HttpParams, HttpUrlEncodingCodec  } from '@angular/common/http';

export class BaseAPI {
    params: any;
    body: any = null;
    constructor(
        public api: InnowayApiService,
        public moduleName: string
    ) {
    }

    get log() {
        return Console(`[API ${this.moduleName}]`).log;
    }

    apiUrl(path: string = '') {
        return this.api.innowayConfig.apiUrl(`${this.moduleName}/${path}`);
    }

    // Call API
    protected async exec(option) {
        if (!option) { throw new Error('option undefined in exec'); }
        try {
            const httpOptions =  new HttpHeaders( option.headers );
            if (option.body) {
                this.body = option.body;
            }
            this.params = new HttpParams();
            if (option.params.sortBy) {
                const sortBy = JSON.stringify(option.params.sortBy).replace('"', '').replace('"', '');
                this.params = this.params.append('sortBy', sortBy);
            }
            if (option.params.sortType) {
                const sortType = JSON.stringify(option.params.sortType).replace('"', '').replace('"', '');
                this.params = this.params.append('sortType', sortType);
            }
            if (option.params.pageSize) {
                const pageSize = JSON.stringify(option.params.pageSize).replace('"', '').replace('"', '');
                this.params = this.params.append('pageSize', pageSize);
            }
            if (option.params.pageIndex) {
                const pageIndex = JSON.stringify(option.params.pageIndex).replace('"', '').replace('"', '');
                this.params = this.params.append('pageIndex', pageIndex);
            }
            if (option.params.buildingID) {
                const buildingID = JSON.stringify(option.params.buildingID).replace('"', '').replace('"', '');
                this.params = this.params.append('buildingID', buildingID);
            }
            if (option.params.room) {
                const room = JSON.stringify(option.params.room).replace('"', '').replace('"', '');
                this.params = this.params.append('room', room);
            }
            if (option.params.floor) {
                const floor = JSON.stringify(option.params.floor).replace('"', '').replace('"', '');
                this.params = this.params.append('floor', floor);
            }
            if (option.params.month) {
                const month = JSON.stringify(option.params.month).replace('"', '').replace('"', '');
                this.params = this.params.append('month', month);
            }
            if (option.params.year) {
                const year = JSON.stringify(option.params.year).replace('"', '').replace('"', '');
                this.params = this.params.append('year', year);
            }
            if (option.params.isPaid) {
                const isPaid = JSON.stringify(option.params.isPaid).replace('"', '').replace('"', '');
                this.params = this.params.append('isPaid', isPaid);
            }
            if (option.params.studentID) {
                const studentID = JSON.stringify(option.params.studentID).replace('"', '').replace('"', '');
                this.params = this.params.append('studentID', studentID);
            }
            if (option.params.paidBilledStudentID) {
                const paidBilledStudentID = JSON.stringify(option.params.paidBilledStudentID).replace('"', '').replace('"', '');
                this.params = this.params.append('paidBilledStudentID', paidBilledStudentID);
            }
            if (option.params.type) {
                const type = JSON.stringify(option.params.type).replace('"', '').replace('"', '');
                this.params = this.params.append('type', type);
            }
            if (option.decode) {
                this.params = new HttpUrlEncodingCodec().decodeValue(this.params);
            }
            const req = new HttpRequest( option.method, option.uri , this.body,
            {headers: httpOptions, reportProgress: true, params: this.params , responseType: option.responseType });
            return this.api.http.request(req)
                .toPromise()
                .then(res => res)
                .catch(err => {throw err;});
        } catch (resError) {
            this.log('API ERROR', resError);
            throw resError;
        }
    }
}
