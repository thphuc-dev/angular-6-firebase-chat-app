import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DataTable } from 'angular-2-data-table-bootstrap4/dist';
import { Router, ActivatedRoute } from '@angular/router';
import { InnowayApiService } from '../../../services/innoway/innoway-api.service';
import { Globals } from './../../../globals';
import * as jsonexport from 'jsonexport/dist';
declare let swal: any;
declare var accounting: any;

@Component({
  selector: 'app-school',
  providers: [Globals],
  templateUrl: './school.component.html',
  styleUrls: ['./school.component.scss']
})
export class SchoolComponent implements OnInit {
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
    this.items.next(await this.innowayApi.school.getList({ query }));
    this.itemCount = this.innowayApi.school.pagination.totalItems;
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
      title: 'Xo??',
      text: 'B???n c?? ch???c la mu???n xo??',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xo??',
      cancelButtonText: 'Quay l???i'
    });
  }

  async alertCannotDelete() {
    return await swal({
      title: 'Kh??ng th??? xo??',
      type: 'warning',
      timer: 1000,
    });
  }

  async alertDeleteSuccess() {
    return await swal({
      title: 'Xo?? th??nh c??ng',
      type: 'success',
      timer: 1000,
    });
  }

  async deleteItem(item) {
    item.deleting = true;
    try {
      try { await this.confirmDelete(); } catch (err) { return; }
      await this.innowayApi.school.delete(item.id);
      this.itemsTable.reloadItems();
      this.alertDeleteSuccess();
    } catch (err) {
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
}
