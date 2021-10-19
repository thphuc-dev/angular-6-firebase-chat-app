import { Component, OnInit, ViewChild, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { InnowayApiService } from '../../../../services/innoway/innoway-api.service';
import { Globals } from './../../../../globals';
import { NgForm } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DataTable } from 'angular-2-data-table-bootstrap4/dist';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
declare let swal: any;
declare var accounting: any;

@Component({
  selector: 'app-list-assessment',
  providers: [Globals],
  templateUrl: './list-assessment.component.html',
  styleUrls: ['./list-assessment.component.scss']
})
export class ListAssessmentComponent implements OnInit {
  isEdit: boolean = false;
  items: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  itemCount: number = 0;
  thumbDefault: string = 'http://www.breeze-animation.com/app/uploads/2013/06/icon-product-gray.png';
  itemFields: any = [];
  sortName: any = 'id';
  sortType: any = 'desc';
  pageSize: any = '10';
  pageIndex: any = '0';
  query: any = {};
  queryExport: any = {};
  searchTimeOut: number = 250;
  searchRef: any;
  decodeUrl: boolean = false;
  submitting: boolean = false;

  id: any;
  //Modal
  modalRef: BsModalRef;

  //data add
  comments: any;
  content: string;
  idComment: number;

  //student
  //studentInfo
  firstName: string;
  lastName: string;
  dateOfBirth: number;
  gender: string;
  avatarUrl: string;
  ward: string;
  district: string;
  region: string;
  nationality: string;
  idcard: string;
  editable: string;

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
    this.id = this.route.snapshot.params['id'];
    if (this.id == null) {
      this.isEdit = false;
    } else {
      this.isEdit = true;
    }

    if (this.isEdit) {
      this.setData();
    }
  }

  async reloadItems(params) {
    const { limit, offset } = params;
    this.query.pageSize = limit;
    this.query.pageIndex = offset / 10;
    await this.getItems();
  }

  async getItems() {
    try {
      const query = Object.assign({
        studentID: this.id,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex
      }, this.query);
      this.items.next(await this.innowayApi.staff.getListCommentsOfStudent({ query }));
      this.itemCount = this.innowayApi.staff.pagination.totalItems;
      this.ref.detectChanges();
      return this.items;
    } catch (err){
      try { await this.alertItemNotFound(); } catch (err) { }
      console.log('ERRRR', err);
      this.backToList();
    }
  }

  rowClick(event) {
    console.log('Row clicked', event);
  }

  rowDoubleClick(event) {
    console.log('Row double click', event);
  }

  alertItemNotFound() {
    swal({
      title: 'Không còn tồn tại',
      type: 'warning',
      timer: 2000
    });
  }

  backToList() {
    this.router.navigate(['../../assessment'], { relativeTo: this.route });
  }

  edit(templateEdit: TemplateRef<any>, item) {
    this.idComment = item.id;
    this.modalRef = this.modalService.show(templateEdit, Object.assign({}, { class: 'modal-lg' }));
  }

  async editAssessment(form: NgForm) {
    this.submitting = true;
    try {
      await this.editItemAssessment(form);
    } catch (err) {
      this.alertEditFailed();
    } finally {
      this.submitting = false;
    }
  }

  alertEditFailed() {
    return swal({
      title: 'Sửa không thành công',
      type: 'warning',
      timer: 2000,
    });
  }

  async editItemAssessment(form: NgForm) {
    if (form.valid) {
      this.comments = {
        comment: this.content
      }
      let data = await this.innowayApi.staff.staffEditComment(this.idComment, this.comments);
      this.alertAddSuccess();
      this.getItems();
      this.ref.detectChanges();
      this.modalRef.hide();
    } else {
      this.alertFormNotValid();
    }
  }

  alertAddSuccess() {
    return swal({
      title: 'Cập nhật thành công',
      type: 'success',
      timer: 2000,
    });
  }
  
  alertFormNotValid() {
    return swal({
      title: 'Nội dung nhập không hợp lệ',
      type: 'warning',
      timer: 2000,
    });
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
      await this.innowayApi.staff.deleteComment(item.id);
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

  async setData() {
    try {
      const data: any = await this.innowayApi.staff.getProfileStudent(this.id);
      //studentInfo
      data.studentInfo.firstName !== null ? this.firstName = data.studentInfo.firstName : this.firstName = data.username;
      data.studentInfo.lastName !== null ? this.lastName = data.studentInfo.lastName : this.lastName = '';
    } catch (err) {
      try { await this.alertItemNotFound(); } catch (err) { }
      console.log('ERRRR', err);
    }
  }
}
