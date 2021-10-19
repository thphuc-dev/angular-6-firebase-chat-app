import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DataTable } from 'angular-2-data-table-bootstrap4/dist';
import { Router, ActivatedRoute } from '@angular/router';
import { InnowayApiService } from '../../services/innoway/innoway-api.service';
import { Globals } from './../../globals';
import * as jsonexport from 'jsonexport/dist';
import { NgForm } from '@angular/forms';
declare let swal: any;
declare var accounting: any;

@Component({
  selector: 'app-student',
  providers: [Globals],
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {
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
  submitting: boolean = false;
  decodeUrl: boolean = false;
  //data infoCriteria search
  infoCriteria: any;
  username: string = null;
  firstName: string = null;
  lastName: string = null;
  verified: boolean = null;

  //data educationCriteria search
  educationCriteria: any;
  listSchools: any;
  school: string = null;
  schoolYearStart: number = null;
  schoolYearEnd: number = null;


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
    this.getListSchools();
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
    this.infoCriteria = {
      infoCriteria: {
        username: this.username,
        firstName: this.firstName,
        lastName: this.lastName,
        verified: this.verified
      }
    }
    this.educationCriteria = {
      educationCriteria: {
        school: this.school,
        schoolYearStart: this.schoolYearStart,
        schoolYearEnd: this.schoolYearEnd
      }
    }
    let dataSearch = {...this.infoCriteria, ...this.educationCriteria};
    try {
      const query = Object.assign({
        pageSize: this.pageSize,
        pageIndex: this.pageIndex
      }, this.query);
      this.items.next(await this.innowayApi.staff.searchStudent(dataSearch, {query}));
      this.itemCount = this.innowayApi.staff.pagination.totalItems;
      this.ref.detectChanges();
      return this.items;
    } catch (err) {
      console.log('err: ', err);
    }
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
      await this.innowayApi.staff.deleteStudent(item.id);
      this.itemsTable.reloadItems();
      this.alertDeleteSuccess();
    } catch (err) {
      this.alertCannotDelete();
    } finally {
      item.deleting = false;
    }
  }

  async deleteAllItem(item) {
    item.deleting = true;
    try {
      try { await this.confirmDelete(); } catch (err) { return; }
      await this.innowayApi.staff.deleteStudent(item);
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
    var listIdStudent = [];
    const rows = this.itemsTable.selectedRows;
    rows.forEach(row => {
      row.item.deleting = true;
      const item =  row.item;
      listIdStudent.push(item.id);
    });
    this.deleteAllItem(listIdStudent);
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
    const listData = await this.innowayApi.student.getList({ query });
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

  verifiedItem(status){
    if (this.itemsTable.selectedRows.length === 0) {
      this.alertChooseStudent();
      return;
    }
    const rows = this.itemsTable.selectedRows;
    const listIdStudent = [];
    rows.forEach(row => {
      const item =  row.item;
      listIdStudent.push(item.id);
    });
    if (listIdStudent.length > 0) {
      this.verifiedStudent(listIdStudent, status);
    }
  }

  async verifiedStudent(item, status){
    item.deleting = true;
    try {
      try { await this.confirmVerified(); } catch (err) { return; }
      await this.innowayApi.staff.verifiedStudent(item, status);
      this.itemsTable.reloadItems();
      this.alertVerifiedSuccess();
    } catch (err) {
      this.alertCannotVerified();
    } finally {
      item.deleting = false;
    }
  }

  async alertChooseStudent() {
    return await swal({
      title: 'Không có sinh viên nào được chọn, vui lòng kiểm tra lại',
      type: 'warning',
      timer: 1000,
    });
  }

  async alertCannotVerified() {
    return await swal({
      title: 'Đã xảy ra lỗi, vui lòng kiểm tra lại',
      type: 'warning',
      timer: 1000,
    });
  }
  async alertVerifiedSuccess() {
    return await swal({
      title: 'Cập nhật thành công',
      type: 'success',
      timer: 1000,
    });
  }

  async confirmVerified() {
    return await swal({
      title: 'Xác nhận',
      text: 'Bạn có chắc muốn cho phép cập nhật hồ sơ',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Quay lại'
    });
  }

  async searchStudent(form: NgForm) {
    this.submitting = true;
    try {
      await this.searchStudentAPI(form);
    } catch (err) {
      console.log('ERROR SUBMIT', err);
    } finally {
      this.submitting = false;
    }
  }

  async searchStudentAPI(form: NgForm) {
    this.query = {};
    if (form.valid) {
      this.infoCriteria = {
        infoCriteria: {
          username: this.username,
          firstName: this.firstName,
          lastName: this.lastName,
          verified: this.verified
        }
      }
      let dataSearch = {...this.infoCriteria};
      try {
        const query = Object.assign({
          pageSize: this.pageSize,
          pageIndex: 0
        }, this.query);
        this.items.next(await this.innowayApi.staff.searchStudent(dataSearch, { query }));
        this.itemCount = this.innowayApi.staff.pagination.totalItems;
        this.ref.detectChanges();
        return this.items;
      } catch (err) {
        console.log('err: ', err);
      }
    } else {
      this.alertFormNotValid();
    }
  }

  alertFormNotValid() {
    return swal({
      title: 'Nội dung nhập không hợp lệ',
      type: 'warning',
      timer: 2000,
    });
  }

  async getListSchools() {
    try {
      this.listSchools = await this.innowayApi.school.getList(); 
      if (this.listSchools.length > 0){
        this.listSchools.unshift({id: null, name: null});
      }
      this.ref.detectChanges();
    } catch (err) {
      console.log('ERR: ', err);
    }
  }
}
