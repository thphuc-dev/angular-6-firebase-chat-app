import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { InnowayApiService } from '../../../../../services/innoway/innoway-api.service';
import { Globals } from './../../../../../globals';
declare var $: any;
declare let swal: any;

@Component({
  selector: 'app-add-ward',
  providers: [Globals],
  templateUrl: './add-ward.component.html',
  styleUrls: ['./add-ward.component.scss']
})
export class AddWardComponent implements OnInit {
  nid: any;
  isEdit: boolean = false;
  submitting: boolean = false;
  name: string;
  rid: any;
  did: any;
  wid: any;
  itemFields: any = [];
  sortName: any = 'id';
  sortType: any = 'desc';
  query: any = {};

  constructor(private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    private globals: Globals,
    private ngZone: NgZone,
    public innowayApi: InnowayApiService) {
  }
  async ngOnInit() {
    this.nid = this.route.snapshot.params['nid'];
    this.rid = this.route.snapshot.params['rid'];
    this.did = this.route.snapshot.params['did'];
    this.wid = this.route.snapshot.params['wid'];
    if (this.wid == null) {
      this.isEdit = false;
      this.setDefaultData();
    } else {
      this.isEdit = true;
    }

    if (this.isEdit) {
      this.setData();
    }
  }

  setDefaultData() {
    this.name = null;
    return {
      name: this.name
    };
  }

  async setData() {
    try {
      const query = Object.assign({
        sortBy: this.sortName,
        sortType: this.sortType
      }, this.query);
      const data = await this.innowayApi.wards.getListWards(this.nid, this.rid, this.did ,{ query });
      for (let i = 0; i < data.length; i++) {
        const item: any = data[i];
        if (parseInt(item.id, 10) === parseInt(this.wid, 10)) {
          this.name = item.name;
        }
      }
    } catch (err) {
      try { await this.alertItemNotFound(); } catch (err) { }
      console.log('ERRRR', err);
      this.backToList();
    }
  }

  async addItem(form: NgForm) {
    if (form.valid) {
      const { name} = this;
      await this.innowayApi.wards.addWard(this.nid, this.rid, this.did ,{ name});
      this.alertAddSuccess();
      form.reset();
      form.resetForm(this.setDefaultData());
    } else {
      this.alertFormNotValid();
    }
  }

  async updateItem(form: NgForm) {
    if (form.valid) {
      const { name } = this;
      await this.innowayApi.wards.updateWard(this.nid, this.rid, this.did , this.wid, { name });
      form.reset();
      form.resetForm(this.setDefaultData());
      this.alertUpdateSuccess();
      this.backToList();
    } else {
      this.alertFormNotValid();
    }
  }

  async submitAndNew(form: NgForm) {
    this.submitting = true;
    try {
      await this.addItem(form);
    } catch (err) {
      console.log('ERROR SUBMIT', err);
      this.alertAddFailed();
    } finally {
      this.submitting = false;
    }
  }

  async submitAndClose(form: NgForm) {
    this.submitting = true;
    try {
      await this.addItem(form);
      this.backToListForAddNew();
    } catch (err) {
      this.alertAddFailed();
    } finally {
      this.submitting = false;
    }
  }

  async updateAndClose(form: NgForm) {
    this.submitting = true;
    try {
      console.log('Submit: ', this.submitting);
      await this.updateItem(form);
    } catch (err) {
      this.alertUpdateFailed();
    } finally {
      this.submitting = false;
    }
  }

  alertAddSuccess() {
    return swal({
      title: '???? th??m',
      type: 'success',
      timer: 2000,
    });
  }

  alertFormNotValid() {
    return swal({
      title: 'N???i dung nh???p kh??ng h???p l???',
      type: 'warning',
      timer: 2000,
    });
  }

  alertAddFailed() {
    return swal({
      title: 'Th??m kh??ng th??nh c??ng',
      type: 'warning',
      timer: 2000,
    });
  }

  backToListForAddNew() {
    this.router.navigate(['./../list'], { relativeTo: this.route });
  }

  alertUpdateSuccess() {
    return swal({
      title: '???? c???p nh???t',
      type: 'success',
      timer: 2000,
    });
  }

  backToList() {
    this.router.navigate(['../../list'], { relativeTo: this.route });
  }

  alertUpdateFailed() {
    return swal({
      title: 'C???p nh???t kh??ng th??nh c??ng',
      type: 'warning',
      timer: 2000,
    });
  }

  alertItemNotFound() {
    swal({
      title: 'Kh??ng c??n t???n t???i',
      type: 'warning',
      timer: 2000
    });
  }
}
