import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { InnowayApiService } from '../../../services/innoway/innoway-api.service';
import { Globals } from './../../../globals';
declare var $: any;
declare let swal: any;

@Component({
  selector: 'app-add',
  providers: [Globals],
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  id: any;
  isEdit: boolean = false;
  submitting: boolean = false;
  name: string;
  avatarUrl: string;
  avatar: string;
  priority: number;

  @ViewChild('fileUploader')
  fileUploaderElementRef: ElementRef;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    private globals: Globals,
    private ngZone: NgZone,
    public innowayApi: InnowayApiService) {
  }
  async ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    if (this.id == null) {
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
    this.avatar = null;
    this.avatarUrl = null;
    this.priority = null;
    return {
      name: this.name,
      avatar: this.avatar,
      avatarUrl: this.avatarUrl,
      priority: this.priority,
    };
  }

  async setData() {
    try {
      const data = await this.innowayApi.department.getList();
      for (let i = 0; i < data.length; i++) {
        const item: any = data[i];
        if (item.id === this.id) {
          this.name = item.name;
          this.avatarUrl = item.avatarUrl;
          this.avatar = item.avatarUrl;
          this.priority = item.priority;
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
      const { id, name , avatarUrl, priority} = this;
      await this.innowayApi.department.add({ id, name , avatarUrl, priority });
      this.alertAddSuccess();
      form.reset();
      form.resetForm(this.setDefaultData());
    } else {
      this.alertFormNotValid();
    }
  }

  async updateItem(form: NgForm) {
    if (form.valid) {
      const { name , avatarUrl, priority  } = this;
      await this.innowayApi.department.update(this.id, { name , avatarUrl, priority  });
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

  displayUrlPhoto(urlImage) {
    this.avatarUrl = urlImage.target.value;
    this.avatar = urlImage.target.value;
  }

  displayPhoto(fileInput) {
    this.avatarUrl = '';
    try {
      const files = this.fileUploaderElementRef.nativeElement.files;
      const file = files[0];
      const result = this.innowayApi.fileUploader.uploadImage(file).then(result => this.avatarUrl = this.avatar = result.link);
    } catch (err) {
      console.log('Kh??ng ??p ???????c h??nh');
    }
  }

  removeImg() {
    this.avatar = '';
    this.avatarUrl = '';
  }
}
