import { Component, OnInit, ViewChild, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DataTable } from 'angular-2-data-table-bootstrap4/dist';
import { Router, ActivatedRoute } from '@angular/router';
import { InnowayApiService } from '../../../services/innoway/innoway-api.service';
import { Globals } from './../../../globals';
import { NgForm } from '@angular/forms';
import * as jsonexport from 'jsonexport/dist';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
declare let swal: any;
declare var accounting: any;

@Component({
  selector: 'app-shared',
  providers: [Globals],
  templateUrl: './shared.component.html',
  styleUrls: ['./shared.component.scss']
})
export class SharedComponent implements OnInit {
  items: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  itemCount: number = 0;
  thumbDefault: string = 'http://www.breeze-animation.com/app/uploads/2013/06/icon-product-gray.png';
  itemFields: any = [];
  sortName: any = 'createdDate';
  sortType: any = 'desc';
  pageSize: any = '10';
  pageIndex: any = '0';
  query: any = {};
  queryExport: any = {};
  searchTimeOut: number = 250;
  searchRef: any;
  decodeUrl: boolean = false;
  submitting: boolean = false;

  //data search bill
  buildingID: string = null;
  room: string = null;
  floor: number = null;
  month: number = null;
  year: number = null;
  isPaid: boolean = null;
  listBuildings: any;
  listRoomsOfBuilding: any;
  listSchools: any;
  loadRoomDone: boolean = false;
  listBills: any;
  paidBilledStudentID: number = null;

  //modal
  modalRef: BsModalRef;
  itemModal: any;
  @ViewChild('itemsTable') itemsTable: DataTable;

  constructor(
    private router: Router,
    private globals: Globals,
    public innowayApi: InnowayApiService,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private modalService: BsModalService,
  ) {

  }

  async ngOnInit() {
    this.getListBuildings();
  }

  rowClick(event) {
    console.log('Row clicked', event);
  }

  rowDoubleClick(event) {
    console.log('Row double click', event);
  }

  async getListBuildings() {
    try {
      this.listBuildings = await this.innowayApi.building.getList();
      this.ref.detectChanges();
    } catch (err) {
      console.log('ERR: ', err);
    }
  }

  async getListRoomsOfBuilding(event) {
    this.loadRoomDone = true;
    try {
      this.listRoomsOfBuilding = await this.innowayApi.building.getListRooms(event.target.value);
      this.ref.detectChanges();
    } catch (err) {
      console.log('ERR: ', err);
    }
  }

  async searchBill(form: NgForm) {
    this.submitting = true;
    try {
      await this.searchBillAPI(form);
    } catch (err) {
      console.log('ERROR SUBMIT', err);
    } finally {
      this.submitting = false;
    }
  }

  async searchBillAPI(form: NgForm) {
    try {
      const query = Object.assign({
        buildingID: this.buildingID,
        room: this.room,
        floor: this.floor,
        month: this.month,
        year: this.year,
        isPaid: this.isPaid,
        sortBy: this.sortName,
        sortType: this.sortType,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex
      }, this.query);
      this.items.next(await this.innowayApi.bill.searchSharedBill({ query }));
      this.itemCount = this.innowayApi.bill.pagination.totalItems;
      this.ref.detectChanges();
      return this.items;
    } catch (err) {
      console.log('err: ', err);
    }

  }

  alertFormNotValid() {
    return swal({
      title: 'Nội dung nhập không hợp lệ',
      type: 'warning',
      timer: 2000,
    });
  }

  async paySharedBill(bill, event) {
    try {
      if (this.paidBilledStudentID === null) {
        this.alertNotChooseStudent();
        return;
      }
      if (bill.isEditable) {
        this.alertCannotPayBill2();
        this.modalRef.hide();
        return;
      }
      try { await this.confirmPayBill(); } catch (err) { return; }
      const query = Object.assign({
        paidBilledStudentID: this.paidBilledStudentID
      }, this.query);
      const result = await this.innowayApi.bill.paySharedBill(bill.id, true, { query });
      this.alertPayBillSuccess();
      this.reloadItems(event);
      this.modalRef.hide();
    } catch (err) {
      console.log('err: ', err);
      this.alertCannotPayBill();
    }
  }

  async confirmPayBill() {
    return await swal({
      title: 'Thanh toán hoá đơn',
      text: 'Are you sure?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Thanh toán',
      cancelButtonText: 'Quay lại'
    });
  }

  async alertPayBillSuccess() {
    return await swal({
      title: 'Thanh toán thành công',
      type: 'success',
      timer: 1000,
    });
  }

  async alertCannotPayBill() {
    return await swal({
      title: 'Không thể thanh toán',
      type: 'warning',
      timer: 1000,
    });
  }

  async alertNotChooseStudent() {
    return await swal({
      title: 'Lỗi! Vui lòng chọn sinh viên thanh toán hoá đơn',
      type: 'warning',
      timer: 1000,
    });
  }

  async reloadItems(params) {
    const { limit, offset } = params;
    this.query.pageSize = limit;
    this.query.pageIndex = offset / 10;
    try {
      const query = Object.assign({
        buildingID: this.buildingID,
        room: this.room,
        floor: this.floor,
        month: this.month,
        year: this.year,
        isPaid: this.isPaid,
        sortBy: this.sortName,
        sortType: this.sortType,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex
      }, this.query);
      this.items.next(await this.innowayApi.bill.searchSharedBill({ query }));
      this.itemCount = this.innowayApi.bill.pagination.totalItems;
      this.ref.detectChanges();
      return this.items;
    } catch (err) {
      console.log('err: ', err);
    }
  }

  checkStatusBill(item) {
    if (item.paidDate === -1) {
      return 'Chưa thanh toán';
    } else {
      return 'Đã thanh toán';
    }
  }

  checkIsEditableBill(item) {
    if (!item.isEditable) {
      return 'Đã xác nhận';
    } else {
      return 'Chưa xác nhận';
    }
  }


  addItem() {
    this.router.navigate(['../shared/add'], { relativeTo: this.route });
  }

  async deleteItem(item) {
    item.deleting = true;
    try {
      await this.innowayApi.bill.deleteSharedBill(item.id);
      this.itemsTable.reloadItems();
      this.alertDeleteSuccess();
    } catch (err) {
      this.alertCannotDelete();
      console.log('err alertCannotDelete: ', err);
    } finally {
      item.deleting = false;
    }
  }

  async deleteAll() {
    if (this.itemsTable.selectedRows.length === 0) {
      return;
    }
    try {
      try { await this.confirmDelete(); } catch (err) { return; }
      const rows = this.itemsTable.selectedRows;
      rows.forEach(row => {
        row.item.deleting = true;
        const item = row.item;
        this.deleteItem(item);
      });
    } catch (err) {
      this.alertCannotDelete();
    }
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

  async alertDeleteSuccess() {
    return await swal({
      title: 'Xoá thành công',
      type: 'success',
      timer: 1000,
    });
  }

  async alertCannotDelete() {
    return await swal({
      title: 'Không thể xoá',
      type: 'warning',
      timer: 1000,
    });
  }
  async alertCannotExport() {
    return await swal({
      title: 'Xuất không thành công',
      type: 'warning',
      timer: 1000,
    });
  }

  formatDate(d) {
    var date = new Date(d);
    return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
  }

  openModalAdd(templateAction: TemplateRef<any>, item: any) {
    this.modalRef = this.modalService.show(templateAction);
    this.itemModal = item;
  }

  async cancelPaySharedBill(bill, event) {
    try {
      if (this.paidBilledStudentID === null) {
        this.alertNotChooseStudent();
        return;
      }
      try { await this.confirmCancelPayBill(); } catch (err) { return; }
      const query = Object.assign({
        paidBilledStudentID: this.paidBilledStudentID
      }, this.query);
      const result = await this.innowayApi.bill.paySharedBill(bill.id, false, { query });
      this.alertCancelPayBillSuccess();
      this.reloadItems(event);
      this.modalRef.hide();
    } catch (err) {
      console.log('err: ', err);
      this.alertCannotCancelPayBill();
    }
  }

  async confirmCancelPayBill() {
    return await swal({
      title: 'Huỷ thanh toán hoá đơn',
      text: 'Are you sure?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Huỷ thanh toán',
      cancelButtonText: 'Quay lại'
    });
  }

  async alertCancelPayBillSuccess() {
    return await swal({
      title: 'Huỷ thanh toán thành công',
      type: 'success',
      timer: 1000,
    });
  }

  async alertCannotCancelPayBill() {
    return await swal({
      title: 'Không thể huỷ thanh toán',
      type: 'warning',
      timer: 1000,
    });
  }

  async verifiedSharedBill(bill, event) {
    try {
      try { await this.confirmVerifiedSharedBill(); } catch (err) { return; }
      const idBill: any = [bill.id];
      const result = await this.innowayApi.bill.verifiedSharedBill(idBill, false);
      this.alertVerifiedSharedBillSuccess();
      this.reloadItems(event);
      this.modalRef.hide();
    } catch (err) {
      console.log('err: ', err);
      this.alertCannotVerifiedSharedBill();
    }
  }

  async verifiedAllSharedBill() {
    if (this.itemsTable.selectedRows.length === 0) {
      return;
    }
    try {
      try { await this.confirmVerifiedSharedBill(); } catch (err) { return; }
      const rows = this.itemsTable.selectedRows;
      let idBills = [];
      for (let i = 0; i < rows.length; i++) {
        idBills.push(rows[i].item.id);
      }
      const result = await this.innowayApi.bill.verifiedSharedBill(idBills, false);
      this.alertVerifiedSharedBillSuccess();
      this.reloadItems(event);
    } catch (err) {
      console.log('err: ', err);
      this.alertCannotVerifiedSharedBill();
    }
  }
  async confirmVerifiedSharedBill() {
    return await swal({
      title: 'Xác nhận hoá đơn',
      text: 'Are you sure?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Quay lại'
    });
  }

  async alertVerifiedSharedBillSuccess() {
    return await swal({
      title: 'Xác nhận thành công',
      type: 'success',
      timer: 1000,
    });
  }

  async alertCannotVerifiedSharedBill() {
    return await swal({
      title: 'Không thể xác nhận hoá đơn',
      type: 'warning',
      timer: 1000,
    });
  }

  async cancelVerifiedSharedBill(bill, event) {
    try {
      try { await this.confirmCancelVerifiedSharedBill(); } catch (err) { return; }
      const idBill: any = [bill.id];
      const result = await this.innowayApi.bill.verifiedSharedBill(idBill, true);
      this.alertCancelVerifiedSharedBillSuccess();
      this.reloadItems(event);
      this.modalRef.hide();
    } catch (err) {
      console.log('err: ', err);
      this.alertCannotCancelVerifiedSharedBill();
    }
  }

  async confirmCancelVerifiedSharedBill() {
    return await swal({
      title: 'Huỷ xác nhận hoá đơn',
      text: 'Are you sure?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Huỷ xác nhận',
      cancelButtonText: 'Quay lại'
    });
  }

  async alertCancelVerifiedSharedBillSuccess() {
    return await swal({
      title: 'Huỷ xác nhận thành công',
      type: 'success',
      timer: 1000,
    });
  }

  async alertCannotCancelVerifiedSharedBill() {
    return await swal({
      title: 'Không thể huỷ xác nhận hoá đơn',
      type: 'warning',
      timer: 1000,
    });
  }

  async deleteBill(item) {
    try {
      try { await this.confirmDelete(); } catch (err) { return; }
      await this.innowayApi.bill.deleteSharedBill(item.id);
      this.itemsTable.reloadItems();
      this.alertDeleteSuccess();
      this.modalRef.hide();
    } catch (err) {
      this.alertCannotDelete();
    }
  }

  editSharedBill(item) {
    this.modalRef.hide();
    this.router.navigate(['./edit', item.id], { relativeTo: this.route });
  }

  async alertCannotPayBill2() {
    return await swal({
      title: 'Vui lòng xác nhận hoá đơn sau đó mới thanh toán',
      type: 'warning',
      timer: 1000
    });
  }

  alertFormNotValid2() {
    return swal({
      title: 'Điều kiện xuất file hệ thống không hợp lệ, vui lòng kiểm tra lại',
      type: 'warning',
      timer: 2000
    });
  }

  async export(form: NgForm) {
    this.submitting = true;
    try {
      await this.exportAPI(form);
    } catch (err) {
      console.log('ERROR SUBMIT', err);
    } finally {
      this.submitting = false;
    }
  }

  async exportAPI(form: NgForm) {
    if (this.buildingID !== null || this.room !== null || this.floor !== null || this.month !== null || this.year !== null || this.isPaid !== null) {
      try {
        this.query = {};
        const query = Object.assign({
          buildingID: this.buildingID,
          room: this.room,
          floor: this.floor,
          month: this.month,
          year: this.year,
          isPaid: this.isPaid
        }, this.query);
        const res: any = await this.innowayApi.bill.exportExcelPersonalBills({ query });
        const url = res.downloadUrl;
        const dwldLink = document.createElement('a');
        dwldLink.setAttribute('target', '_blank');
        dwldLink.setAttribute('href', url);
        dwldLink.setAttribute('download', 'File-thống-kê.csv');
        dwldLink.style.visibility = 'hidden';
        document.body.appendChild(dwldLink);
        dwldLink.click();
        document.body.removeChild(dwldLink);
      } catch (err) {
        console.log('err: ', err);
      }
    } else {
      this.alertFormNotValid2();
    }
  }
  async exportPDF(item) {
    try {
      const res: any = await this.innowayApi.bill.exportPdfSharedBills(item);
      const url = res.downloadUrl;
      const dwldLink = document.createElement('a');
      dwldLink.setAttribute('target', '_blank');
      dwldLink.setAttribute('href', url);
      dwldLink.setAttribute('download', 'Hoá-đơn.pdf');
      dwldLink.style.visibility = 'hidden';
      document.body.appendChild(dwldLink);
      dwldLink.click();
      document.body.removeChild(dwldLink);
    } catch (err) {
      console.log('ERR: ', err);
    }
  }
}
