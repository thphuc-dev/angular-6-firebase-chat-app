import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DataTable } from 'angular-2-data-table-bootstrap4/dist';
import { Router, ActivatedRoute } from '@angular/router';
import { InnowayApiService } from '../../services/innoway/innoway-api.service';
import { Globals } from './../../globals';
import * as jsonexport from 'jsonexport/dist';
declare let swal: any;
declare var accounting: any;

@Component({
  selector: 'app-role',
  providers: [Globals],
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {
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
    this.items.next(await this.innowayApi.role.getList({ query }));
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

  roleApiItem(item) {
    this.router.navigate(['../role-api', item.id], { relativeTo: this.route });
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
      await this.innowayApi.role.delete(item.id);
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

  async export() {
    const query = Object.assign({
      fields: this.itemFields
    }, this.queryExport);
    const listData = await this.innowayApi.role.getList({ query });
    jsonexport(listData, function (err, csv) {
      if (err) { return console.log(err); }
      const blob = new Blob(['\ufeff' + csv], {
        type: 'text/csv;charset=utf-8;'
      });
      const dwldLink = document.createElement('a');
      const url = URL.createObjectURL(blob);
      const isSafariBrowser = navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1;
      if (isSafariBrowser) { // if Safari open in new window to save file with random filename.
        dwldLink.setAttribute('target', '_blank');
      }
      dwldLink.setAttribute('href', url);
      dwldLink.setAttribute('download', 'file-dữ-liệu.csv');
      dwldLink.style.visibility = 'hidden';
      document.body.appendChild(dwldLink);
      dwldLink.click();
      document.body.removeChild(dwldLink);
    });

  }
}
