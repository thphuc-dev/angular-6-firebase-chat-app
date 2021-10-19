import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DataTable } from 'angular-2-data-table-bootstrap4/dist';
import { Router, ActivatedRoute } from '@angular/router';
import { InnowayApiService } from '../../../../services/innoway/innoway-api.service';
import { Globals } from './../../../../globals';
import * as jsonexport from 'jsonexport/dist';
declare let swal: any;
declare var accounting: any;

@Component({
  selector: 'app-class',
  providers: [Globals],
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.scss']
})
export class ClassComponent implements OnInit {
  items: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  itemCount: number = 0;
  thumbDefault: string = 'http://www.breeze-animation.com/app/uploads/2013/06/icon-product-gray.png';
  itemFields: any = [];
  sortName: any;
  sortType: any;
  pageSize: any = '10';
  pageIndex: any = '0';
  query: any = {};
  queryExport: any = {};
  searchTimeOut: number = 250;
  searchRef: any;
  decodeUrl: boolean = false;
  sid: any;
  mid: any;
  listMajors: any;
  major: any;

  @ViewChild('itemsTable') itemsTable: DataTable;

  constructor(
    private router: Router,
    private globals: Globals,
    public innowayApi: InnowayApiService,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef
  ) {

  }

  async ngOnInit() {
    this.sid = this.route.snapshot.params['sid'];
    this.mid = this.route.snapshot.params['mid'];
    this.getListMajors();
  }

  async reloadItems(params) {
    const { limit, offset, sortAsc, sortBy } = params;
    this.query.pageSize = limit;
    this.query.pageIndex = offset / 10;
    this.query.sortBy = sortBy;
    if (sortAsc) {
      this.query.sortType = 'ASC';
    } else {
      this.query.sortType = 'DESC';
    }
    await this.getItems();
  }

  async getItems() {
    const query = Object.assign({
      pageSize: this.pageSize,
      pageIndex: this.pageIndex
    }, this.query);
    this.items.next(await this.innowayApi.class.getListClasses(this.sid, this.mid, { query }));
    this.itemCount = this.innowayApi.class.pagination.totalItems;
    this.ref.detectChanges();
    return this.items;
  }

  rowClick(event) {
    console.log('Row clicked', event);
  }

  rowDoubleClick(event) {
    console.log('Row double click', event);
  }

  addItem() {
    this.router.navigate(['../add'], { relativeTo: this.route });
  }

  editItem(item) {
    this.router.navigate(['../add', item.id], { relativeTo: this.route });
  }

  viewItem(item) {
    this.router.navigate(['../detail', item.id], { relativeTo: this.route });
  }

  async confirmDelete() {
    return await swal({
      title: 'Xoá',
      text: 'Bạn có chắc la muốn xoá',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xoá',
      cancelButtonText: 'Quay lại'
    });
  }

  async alertCannotDelete() {
    return await swal({
      title: 'Không thể xoá',
      type: 'warning',
      timer: 1000,
    });
  }

  async alertDeleteSuccess() {
    return await swal({
      title: 'Xoá thành công',
      type: 'success',
      timer: 1000,
    });
  }

  async deleteItem(item) {
    
    item.deleting = true;
    try {
      try { await this.confirmDelete(); } catch (err) { return; }
      const query = Object.assign({
        sortBy: this.sortName,
        sortType: this.sortType,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex
      }, this.query);
      await this.innowayApi.class.deleteClass(this.sid, this.mid ,item.id);
      this.getItems();
      this.alertDeleteSuccess();
    } catch (err) {
      console.log('err: ', err);
      this.alertCannotDelete();
    } finally {
      item.deleting = false;
    }
  }

  async deleteAll() {
    if (this.itemsTable.selectedRows.length === 0) {
      return;
    }
    const rows = this.itemsTable.selectedRows;
    rows.forEach(row => {
      row.item.deleting = true;
      const item =  row.item;
      this.deleteItem(item);
    });
  }

  onSearch(e) {
    const key = e.target.value;
    if (this.searchRef) { clearTimeout(this.searchRef); }
    this.searchRef = setTimeout(() => {
      this.decodeUrl = true;
      this.getItems();
    }, this.searchTimeOut);
  }

  getNumber(number) {
    return new Array(number);
  }

  async getListMajors() {
    try {
      this.listMajors = await this.innowayApi.major.getListMajors(this.sid); 
      for (let i = 0; i < this.listMajors.length; i++){
        if (parseInt(this.listMajors[i].id, 10) === parseInt(this.mid, 10)){
          this.major = this.listMajors[i].name;
        }
      }
      this.ref.detectChanges();
    } catch (err) {
      console.log('ERR: ', err);
    }
  }
}
