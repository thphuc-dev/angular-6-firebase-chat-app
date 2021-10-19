import { Component, OnInit, ViewChild, ChangeDetectorRef, Input, TemplateRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DataTable } from 'angular-2-data-table-bootstrap4/dist';
import { Router, ActivatedRoute } from '@angular/router';
import { InnowayApiService } from '../../../services/innoway/innoway-api.service';
import { Globals } from './../../../globals';
import { NgForm } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
declare let swal: any;

@Component({
  selector: 'app-register-to-stay',
  providers: [Globals],
  templateUrl: './register-to-stay.component.html',
  styleUrls: ['./register-to-stay.component.scss']
})
export class RegisterToStayComponent implements OnInit {
  items: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  itemCount: number = 0;
  itemFields: any = [];
  sortName: any = 'createdDate';
  sortType: any = 'desc';
  pageSize: any = '5';
  pageIndex: any = '0';
  query: any = {};
  queryExport: any = {};
  searchTimeOut: number = 250;
  searchRef: any;
  decodeUrl: boolean = false;
  listRoomTypes: any = [];
  roomTypeRegister: any;
  statusEnableComfirm: string;
  submitting: boolean = false;

  //data search
  billed: boolean = false;
  idcard: string = null;
  firstName: string = null;
  lastName: string = null;
  verified: any = null;
  school: string = null;
  schoolYearStart: string = null;
  listSchools: any;
  registered: boolean = true;
  statusStudentRoomRegistration: any;

  //Modal
  modalRef: BsModalRef;
  expirationDateShow: Date;
  expirationDate: number;
  appliedDateShow: Date;
  appliedDate: number;
  minDate = new Date();

  @ViewChild('itemsTable') itemsTable: DataTable;
  constructor(
    private router: Router,
    private globals: Globals,
    public innowayApi: InnowayApiService,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private modalService: BsModalService
  ) {
  }

  async ngOnInit() {
    this.getListRoomTypes();
    this.getListSchools();
    this.getStatusStudentRoomRegistration();
  }

  async reloadItems(params) {
    const { limit, offset } = params;
    this.query.pageSize = limit;
    this.query.pageIndex = offset/5;
    await this.getItems();
  }

  async getItems() {
    const query = Object.assign({
      sortBy: this.sortName,
      sortType: this.sortType,
      pageSize: this.pageSize,
      pageIndex: this.pageIndex
    }, this.query);
    const { firstName, lastName, school, idcard, schoolYearStart, verified, registered, billed } = this;
    this.items.next(await this.innowayApi.staff.getListStudentsRegisterRoomType({ firstName, lastName, school, idcard, schoolYearStart, verified, registered, billed }, { query }));
    this.roomTypeRegister = this.items.getValue();
    this.itemCount = this.innowayApi.staff.pagination.totalItems;
    this.ref.detectChanges();
    return this.items;
  }

  rowClick(event) {
    console.log('Row clicked', event);
  }

  rowDoubleClick(event) {
    console.log('Row double click', event);
  }

  async getListRoomTypes() {
    try {
      this.listRoomTypes = await this.innowayApi.roomType.getList();
      this.ref.detectChanges();
    } catch (err) {
      console.log('ERR: ', err);
    }
  }

  async getStatusStudentRoomRegistration() {
    try {
      this.statusStudentRoomRegistration = await this.innowayApi.staff.getStatusStudentRoomRegistration();
      this.ref.detectChanges();
    } catch (err) {
      console.log('ERR: ', err);
    }
  }

  async banStudent() {
    if (this.itemsTable.selectedRows.length === 0) {
      return;
    }
    const rows = this.itemsTable.selectedRows;
    rows.forEach(row => {
      row.item.deleting = true;
      const item = row.item;
      this.banOneStudent(item);
    });
  }

  async banOneStudent(item) {
    try {
      try { await this.confirmBan(); } catch (err) { return; }
      await this.innowayApi.staff.banOneStudent(item.studentID);
      this.itemsTable.reloadItems();
      this.alertBanSuccess();
    } catch (err) {
      console.log('err: ', err);
      this.alertCannotBan();
    }
  }

  getIndexItem(item) {
    for (let i = 0; i < this.listRoomTypes.length; i++) {
      if (item === this.listRoomTypes[i].id) {
        return i;
      }
    }
  }

  async confirmBan() {
    return await swal({
      title: 'Khoá tài khoản',
      text: 'Bạn có chắc là muốn khoá tài khoản',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Quay lại'
    });
  }

  async alertCannotBan() {
    return await swal({
      title: 'Khoá tài khoản thất bại',
      type: 'warning',
      timer: 1000,
    });
  }

  async alertBanSuccess() {
    return await swal({
      title: 'Khoá tài khoản thành công',
      type: 'success',
      timer: 1000,
    });
  }

  async unBanStudent() {
    if (this.itemsTable.selectedRows.length === 0) {
      return;
    }
    const rows = this.itemsTable.selectedRows;
    rows.forEach(row => {
      row.item.deleting = true;
      const item = row.item;
      this.unBanOneStudent(item);
    });
  }

  async unBanOneStudent(item) {
    try {
      try { await this.confirmUnBan(); } catch (err) { return; }
      await this.innowayApi.staff.unBanOneStudent(item.studentID);
      this.itemsTable.reloadItems();
      this.alertUnBanSuccess();
    } catch (err) {
      console.log('err: ', err);
      this.alertCannotBan();
    }
  }

  async confirmUnBan() {
    return await swal({
      title: 'Mở khoá tài khoản',
      text: 'Bạn có chắc là muốn mở khoá tài khoản',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Quay lại'
    });
  }

  async alertCannotUnBan() {
    return await swal({
      title: 'Mở khoá tài khoản thất bại',
      type: 'warning',
      timer: 1000,
    });
  }

  async alertUnBanSuccess() {
    return await swal({
      title: 'Mở khoá tài khoản thành công',
      type: 'success',
      timer: 1000,
    });
  }

  async alertCannotEnableRegistrations() {
    return await swal({
      title: 'Vui lòng chọn trạng thái tắt hoặc mở đăng ký loại phòng',
      type: 'warning',
      timer: 1000,
    });
  }


  async confirmEnableRegistrations(enable) {
    if (enable) {
      this.statusEnableComfirm = 'MỞ';
    } else {
      this.statusEnableComfirm = 'TẮT';
    }
    return await swal({
      title: this.statusEnableComfirm + ' đăng ký loại phòng',
      text: 'Bạn có chắc muốn <b>' + this.statusEnableComfirm + '</b> đăng ký loại phòng?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Quay lại'
    });
  }

  async alertEnableRegistrationsSuccess() {
    return await swal({
      title: 'Thao tác thành công',
      type: 'success',
      timer: 1000,
    });
  }

  async enableRegistrations(status) {
    if (status !== undefined) {
      try { await this.confirmEnableRegistrations(status); } catch (err) { return; }
      await this.innowayApi.staff.enableRegistrations(status);
      this.alertEnableRegistrationsSuccess();
      this.getStatusStudentRoomRegistration();
    } else {
      this.alertCannotEnableRegistrations();
    }
  }

  async updateRegistrationRoomType() {
    if (this.itemsTable.selectedRows.length === 0) {
      return;
    }
    try { await this.confirmUpdateRegistrationRoomType(); } catch (err) { return; }
    const rows = this.itemsTable.selectedRows;
    try {
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        row.item.deleting = true;
        const item = row.item;
        await this.updateRegistrationRoomTypeForStudent(item);
      }
      this.alertUpdateRegistrationRoomTypeSuccess();
      this.itemsTable.reloadItems();
    } catch (err) {
      this.alertCannotUpdateRegistrationRoomType()
    }
  }

  async updateRegistrationRoomTypeForStudent(item) {
    if (!item.newRoomType) return;
    try {
      await this.innowayApi.staff.updateRegistrationRoomTypeForStudent(item.studentID, item.newRoomType);
    } catch (err) {
      console.log('err: ', err);
      throw err;
    }
  }

  async alertCannotUpdateRegistrationRoomType() {
    return await swal({
      title: 'Thay đổi thất bại',
      type: 'warning',
      timer: 1000,
    });
  }

  async alertUpdateRegistrationRoomTypeSuccess() {
    return await swal({
      title: 'Thay đổi thành công',
      type: 'success',
      timer: 1000,
    });
  }

  async changeRoomType(event, item) {
    item['newRoomType'] = event.target.value;
  }

  async confirmUpdateRegistrationRoomType() {
    return await swal({
      title: 'Thay đổi loại phòng',
      text: 'Bạn có chắc muốn thay đổi loại phòng cho sinh viên?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Quay lại'
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

  async searchStudent(form: NgForm) {
    try {
      await this.searchStudentAPI(form);
    } catch (err) {
      console.log('ERROR SUBMIT', err);
    } finally {
    }
  }

  async searchStudentAPI(form: NgForm) {
    this.query = {};
    if (form.valid) {
      if (this.school === 'null'){
        this.school = null;
      }
      if (this.verified === 'null'){
        this.verified = null;
      }
      const { firstName, lastName, school, idcard, schoolYearStart, verified, registered } = this;
      try {
        const query = Object.assign({
          sortBy: this.sortName,
          sortType: this.sortType,
          pageSize: this.pageSize,
          pageIndex: this.pageIndex
        }, this.query);
        this.items.next(await this.innowayApi.staff.getListStudentsRegisterRoomType({ firstName, lastName, school, idcard, schoolYearStart, verified, registered }, { query }));
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

  openModalAddPersonalBillRoomTypeRegistration(templateAdd: TemplateRef<any>) {
    this.modalRef = this.modalService.show(templateAdd);
  }

  getStartOfDate(date: Date) {
    date.setHours(0,0,0,0);
    return date;
  }
  
  async AddPersonalBillRoomTypeRegistrationAPI(form: NgForm) {
    if (form.valid) {
      this.expirationDate = this.getStartOfDate(this.expirationDateShow).getTime();
      this.appliedDate = this.getStartOfDate(this.appliedDateShow).getTime();
      const { expirationDate, appliedDate } = this;
      await this.innowayApi.bill.addPersonalBillRoomTypeRegistration({ expirationDate, appliedDate });
      this.alertAddSuccess();
      this.modalRef.hide();
      this.itemsTable.reloadItems();
    } else {
      this.alertFormNotValid();
    }
  }
  alertAddSuccess() {
    return swal({
      title: 'Đã thêm',
      type: 'success',
      timer: 2000,
    });
  }

  async AddPersonalBillRoomTypeRegistration(form: NgForm) {
    try {
      await this.AddPersonalBillRoomTypeRegistrationAPI(form);
    } catch (err) {
      this.alertAddFailed();
    }
  }

  alertAddFailed() {
    return swal({
      title: 'Thêm không thành công',
      type: 'warning',
      timer: 2000,
    });
  }

  async verifiedRegistrationRoomType() {
    if (this.itemsTable.selectedRows.length === 0) {
      return;
    }
    try { await this.confirmVerifiedRegistrationRoomType(); } catch (err) { return; }
    const rows = this.itemsTable.selectedRows;
    try {
      var listSid: any = [];
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        listSid.push(row.item.studentID)
      }
      await this.verifiedRegistrationRoomTypeForStudent(listSid);
      this.alertVerifiedRegistrationRoomTypeSuccess();
      this.itemsTable.reloadItems();
    } catch (err) {
      this.alertCannotVerifiedRegistrationRoomType()
    }
  }

  async confirmVerifiedRegistrationRoomType() {
    return await swal({
      title: 'Duyệt đăng ký loại phòng',
      text: 'Bạn có chắc muốn duyệt đăng ký loại phòng cho sinh viên?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Quay lại'
    });
  }

  async verifiedRegistrationRoomTypeForStudent(item) {
    try {
      await this.innowayApi.staff.verifiedRegistrationRoomTypeForStudent(item, true);
    } catch (err) {
      console.log('err: ', err);
      throw err;
    }
  }

  async alertCannotVerifiedRegistrationRoomType() {
    return await swal({
      title: 'Thay đổi thất bại',
      type: 'warning',
      timer: 1000,
    });
  }

  async alertVerifiedRegistrationRoomTypeSuccess() {
    return await swal({
      title: 'Thay đổi thành công',
      type: 'success',
      timer: 1000,
    });
  }

  changeRegistered(event){
    this.registered = !event.target.checked;
  }
}
