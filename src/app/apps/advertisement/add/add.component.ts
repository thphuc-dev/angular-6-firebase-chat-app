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
  imageUrl: string;
  image: string;
  redirectUrl: string;
  priority: number;
  click: number;
  urlImageChanged: boolean;

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
    this.imageUrl = null;
    this.image = null;
    this.priority = null;
    this.redirectUrl = null;
    this.click = null;
    return {
      imageUrl: this.imageUrl,
      image: this.image,
      priority: this.priority,
      redirectUrl: this.redirectUrl,
      click: this.click,
    };
  }

  async setData() {
    try {
      const data = await this.innowayApi.advertisement.getList();
      for (let i = 0; i < data.length; i++) {
        const item: any = data[i];
        if (parseInt(item.id, 10) === parseInt(this.id, 10)) {
          this.imageUrl = item.imageUrl;
          this.image = item.imageUrl;
          this.priority = item.priority;
          this.redirectUrl = item.redirectUrl;
          this.click = item.click;
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
      this.imageUrl = this.image;
      const { imageUrl, redirectUrl, priority } = this;
      await this.innowayApi.advertisement.add({ imageUrl, redirectUrl, priority });
      this.alertAddSuccess();
      form.reset();
      form.resetForm(this.setDefaultData());
    } else {
      this.alertFormNotValid();
    }
  }

  async updateItem(form: NgForm) {
    if (form.valid) {
      const { imageUrl, redirectUrl, priority  } = this;
      await this.innowayApi.advertisement.update(this.id, {  imageUrl, redirectUrl, priority   });
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
      title: 'Đã thêm',
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

  alertAddFailed() {
    return swal({
      title: 'Thêm không thành công',
      type: 'warning',
      timer: 2000,
    });
  }

  backToListForAddNew() {
    this.router.navigate(['./../list'], { relativeTo: this.route });
  }

  alertUpdateSuccess() {
    return swal({
      title: 'Đã cập nhật',
      type: 'success',
      timer: 2000,
    });
  }

  backToList() {
    this.router.navigate(['../../list'], { relativeTo: this.route });
  }

  alertUpdateFailed() {
    return swal({
      title: 'Cập nhật không thành công',
      type: 'warning',
      timer: 2000,
    });
  }

  alertItemNotFound() {
    swal({
      title: 'Không còn tồn tại',
      type: 'warning',
      timer: 2000
    });
  }

  displayUrlPhoto(urlImage) {
    this.imageUrl = urlImage.target.value;
    this.image = urlImage.target.value;
    this.urlImageChanged = true;
  }

  displayPhoto(fileInput) {
    this.imageUrl = '';
    try {
      const files = this.fileUploaderElementRef.nativeElement.files;
      const file = files[0];
      const result = this.innowayApi.fileUploader.uploadImage(file).then(result => this.imageUrl = this.image = result.link);
    } catch (err) {
      console.log('Không úp được hình');
    }
  }

  removeImg() {
    this.image = '';
    this.imageUrl = '';
  }
}
