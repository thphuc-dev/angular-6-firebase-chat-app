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
  selector: 'app-personal',
  providers: [Globals],
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss']
})
export class PersonalComponent implements OnInit {
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
    private modalService: BsModalService
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
      this.items.next(await this.innowayApi.bill.searchPersonalBill({ query }));
      this.itemCount = this.innowayApi.bill.pagination.totalItems;
      this.ref.detectChanges();
      return this.items;
    } catch (err) {
      console.log('err: ', err);
    }
  }

  alertFormNotValid() {
    return swal({
      title: 'N???i dung nh???p kh??ng h???p l???',
      type: 'warning',
      timer: 2000,
    });
  }

  async payPersonalBill(bill, event) {
    try {
      if (bill.isEditable){
        this.alertCannotPayBill2();
        this.modalRef.hide();
        return;
      }
      try { await this.confirmPayBill(); } catch (err) { return; }
      const result = await this.innowayApi.bill.payPersonalBill(bill.id, true);
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
      title: 'Thanh to??n ho?? ????n',
      text: 'Are you sure?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Thanh to??n',
      cancelButtonText: 'Quay l???i'
    });
  }

  async alertPayBillSuccess() {
    return await swal({
      title: 'Thanh to??n th??nh c??ng',
      type: 'success',
      timer: 1000,
    });
  }

  async alertCannotPayBill() {
    return await swal({
      title: 'Kh??ng th??? thanh to??n',
      type: 'warning',
      timer: 1000,
    });
  }

  async alertCannotPayBill2() {
    return await swal({
      title: 'Vui l??ng x??c nh???n ho?? ????n sau ???? m???i thanh to??n',
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
      this.items.next(await this.innowayApi.bill.searchPersonalBill({ query }));
      this.itemCount = this.innowayApi.bill.pagination.totalItems;
      this.ref.detectChanges();
      return this.items;
    } catch (err) {
      console.log('err: ', err);
    }
  }

  checkStatusBill(item) {
    if (item.paidDate === -1) {
      return 'Ch??a thanh to??n';
    } else {
      return '???? thanh to??n';
    }
  }

  checkIsEditableBill(item) {
    if (!item.isEditable) {
      return '???? x??c nh???n';
    } else {
      return 'Ch??a x??c nh???n';
    }
  }


  addItem() {
    this.router.navigate(['../personal/add'], { relativeTo: this.route });
  }

  async deleteItem(item) {
    item.deleting = true;
    try {
      await this.innowayApi.bill.deletePersonalBill(item.id);
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

  async alertDeleteSuccess() {
    return await swal({
      title: 'Xo?? th??nh c??ng',
      type: 'success',
      timer: 1000,
    });
  }

  async alertCannotDelete() {
    return await swal({
      title: 'Kh??ng th??? xo??',
      type: 'warning',
      timer: 1000,
    });
  }
  async alertCannotExport() {
    return await swal({
      title: 'Xu???t kh??ng th??nh c??ng',
      type: 'warning',
      timer: 1000,
    });
  }

  formatDate(d) {
    var date = new Date(d);
    return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
  }

  openModalAction(templateAction: TemplateRef<any>, item: any) {
    this.modalRef = this.modalService.show(templateAction);
    this.itemModal = item;
  }

  async cancelPayPersonalBill(bill, event) {
    try {
      try { await this.confirmCancelPayBill(); } catch (err) { return; }
      const result = await this.innowayApi.bill.payPersonalBill(bill.id, false);
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
      title: 'Hu??? thanh to??n ho?? ????n',
      text: 'Are you sure?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Hu??? thanh to??n',
      cancelButtonText: 'Quay l???i'
    });
  }

  async alertCancelPayBillSuccess() {
    return await swal({
      title: 'Hu??? thanh to??n th??nh c??ng',
      type: 'success',
      timer: 1000,
    });
  }

  async alertCannotCancelPayBill() {
    return await swal({
      title: 'Kh??ng th??? hu??? thanh to??n',
      type: 'warning',
      timer: 1000,
    });
  }

  async verifiedAllPersonalBill() {
    if (this.itemsTable.selectedRows.length === 0) {
      return;
    }
    try {
      try { await this.confirmVerifiedPersonalBill(); } catch (err) { return; }
      const rows = this.itemsTable.selectedRows;
      let idBills = [];
      for (let i = 0; i < rows.length; i++) {
        idBills.push(rows[i].item.id);
      }
      const result = await this.innowayApi.bill.verifiedPersonalBill(idBills, false);
      this.alertVerifiedPersonalBillSuccess();
      this.reloadItems(event);
    } catch (err) {
      console.log('err: ', err);
      this.alertCannotVerifiedPersonalBill();
    }
  }
  async verifiedPersonalBill(bill, event) {
    try {
      try { await this.confirmVerifiedPersonalBill(); } catch (err) { return; }
      const idBill: any = [bill.id];
      const result = await this.innowayApi.bill.verifiedPersonalBill(idBill, false);
      this.alertVerifiedPersonalBillSuccess();
      this.reloadItems(event);
      this.modalRef.hide();
    } catch (err) {
      console.log('err: ', err);
      this.alertCannotVerifiedPersonalBill();
    }
  }

  async confirmVerifiedPersonalBill() {
    return await swal({
      title: 'X??c nh???n ho?? ????n',
      text: 'Are you sure?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'X??c nh???n',
      cancelButtonText: 'Quay l???i'
    });
  }

  async alertVerifiedPersonalBillSuccess() {
    return await swal({
      title: 'X??c nh???n th??nh c??ng',
      type: 'success',
      timer: 1000,
    });
  }

  async alertCannotVerifiedPersonalBill() {
    return await swal({
      title: 'Kh??ng th??? x??c nh???n ho?? ????n',
      type: 'warning',
      timer: 1000,
    });
  }

  async cancelVerifiedPersonalBill(bill, event) {
    try {
      try { await this.confirmCancelVerifiedPersonalBill(); } catch (err) { return; }
      const idBill: any = [bill.id];
      const result = await this.innowayApi.bill.verifiedPersonalBill(idBill, true);
      this.alertCancelVerifiedPersonalBillSuccess();
      this.reloadItems(event);
      this.modalRef.hide();
    } catch (err) {
      console.log('err: ', err);
      this.alertCannotCancelVerifiedPersonalBill();
    }
  }

  async confirmCancelVerifiedPersonalBill() {
    return await swal({
      title: 'Hu??? x??c nh???n ho?? ????n',
      text: 'Are you sure?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Hu??? x??c nh???n',
      cancelButtonText: 'Quay l???i'
    });
  }

  async alertCancelVerifiedPersonalBillSuccess() {
    return await swal({
      title: 'Hu??? x??c nh???n th??nh c??ng',
      type: 'success',
      timer: 1000,
    });
  }

  async alertCannotCancelVerifiedPersonalBill() {
    return await swal({
      title: 'Kh??ng th??? hu??? x??c nh???n ho?? ????n',
      type: 'warning',
      timer: 1000,
    });
  }

  async deleteBill(item) {
    try {
      try { await this.confirmDelete(); } catch (err) { return; }
      await this.innowayApi.bill.deletePersonalBill(item.id);
      this.itemsTable.reloadItems();
      this.alertDeleteSuccess();
      this.modalRef.hide();
    } catch (err) {
      this.alertCannotDelete();
    }
  }

  editPersonalBill(item) {
    this.modalRef.hide();
    this.router.navigate(['./edit', item.id], { relativeTo: this.route });
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
        const res:any = await this.innowayApi.bill.exportExcelPersonalBills({ query });
        const url = res.downloadUrl;
        const dwldLink = document.createElement('a');
        dwldLink.setAttribute('target', '_blank');
        dwldLink.setAttribute('href', url);
        dwldLink.setAttribute('download', 'File-th???ng-k??.csv');
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

  alertFormNotValid2() {
    return swal({
      title: '??i???u ki???n xu???t file h??? th???ng kh??ng h???p l???, vui l??ng ki???m tra l???i',
      type: 'warning',
      timer: 2000,
    });
  }

  async exportPDF(item) {
    try {
      const res: any = await this.innowayApi.bill.exportPdfPersonalBills(item.id);
      const url = res.downloadUrl;
      const dwldLink = document.createElement('a');
      dwldLink.setAttribute('target', '_blank');
      dwldLink.setAttribute('href', url);
      dwldLink.setAttribute('download', 'Ho??-????n.pdf');
      dwldLink.style.visibility = 'hidden';
      document.body.appendChild(dwldLink);
      dwldLink.click();
      document.body.removeChild(dwldLink);
    } catch (err) {
      console.log('ERR: ', err);
    }
  }
}
