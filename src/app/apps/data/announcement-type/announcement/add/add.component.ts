import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, NgZone, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm, FormGroup } from '@angular/forms';
import { InnowayApiService } from '../../../../../services/innoway/innoway-api.service';
import { InnowayConfigService } from '../../../../../services/innoway/innoway-config.service';
import { Globals } from './../../../../../globals';
import { AngularFireStorage } from 'angularfire2/storage';
import 'rxjs/add/operator/map';
import { finalize } from 'rxjs/operators';
declare let swal: any;

@Component({
  selector: 'app-add-announcement',
  providers: [Globals],
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddAnnouncementComponent implements OnInit {
  id: any;
  isEdit: boolean = false;
  submitting: boolean = false;
  sortName: any = 'id';
  sortType: any = 'desc';
  pageSize: any = '10';
  pageIndex: any = '0';
  query: any = {};
  title: string;
  view: number;
  announcementAttaches: any;
  createdStaffID: string;
  createdStaff: string;
  announcementTypeID: number;
  content: string;
  createdDate: any;
  listAnnouncementTypes: any;
  formGroup: FormGroup;
  chosenFile: File = null;
  uploadingPercent: number;
  spinnerLoading: boolean = false;
  isValidURL: boolean = true;

  @ViewChild('fileUploader')
  fileUploaderElementRef: ElementRef;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    private globals: Globals,
    private ngZone: NgZone,
    public innowayApi: InnowayApiService,
    public innowayConfig: InnowayConfigService,
    private storage: AngularFireStorage) {
  }
  async ngOnInit() {
    this.getListAnnouncementTypes();
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
    this.createdStaffID = this.innowayConfig.id;
    this.announcementTypeID = null;
    this.title = null;
    this.content = null;
    this.announcementAttaches = [
      {
        name: '',
        url: '',
        file: ''
      },
    ];
    return {
      createdStaffID: this.createdStaffID,
      announcementTypeID: this.announcementTypeID,
      title: this.title,
      content: this.content,
      announcementAttaches: this.announcementAttaches
    };
  }

  async setData() {
    try {
      const data = await this.innowayApi.announcement.getItem(this.id);
      this.title = data.title;
      this.createdStaff = data.createdStaff.firstName + ' ' + data.createdStaff.lastName;
      this.view = data.view;
      this.createdDate = data.createdDate;
      this.announcementTypeID = data.announcementType.id;
      this.announcementAttaches = data.announcementAttaches;
      this.content = data.content;
    } catch (err) {
      try { await this.alertItemNotFound(); } catch (err) { }
      console.log('ERRRR', err);
      this.backToList();
    }
  }

  async addItem(form: NgForm) {
    if (form.valid) {
      for (let i = 0; i < this.announcementAttaches.length; i++) {
        delete this.announcementAttaches[i].file;
        if (!this.checkIsValidURL(this.announcementAttaches[i].url)){
          this.isValidURL = false;
        }
      }
      if (!this.isValidURL) {
        this.alertIsValidURL();
        return;
      }
      const { createdStaffID,  announcementTypeID, announcementAttaches, title, content} = this;
      await this.innowayApi.announcement.add({ createdStaffID,  announcementTypeID, announcementAttaches, title, content });
      this.alertAddSuccess();
      form.reset();
      form.resetForm(this.setDefaultData());  
    } else {
      this.alertFormNotValid();
    }
  }

  async updateItem(form: NgForm) {
    if (form.valid) {
      for (let i = 0; i < this.announcementAttaches.length; i++) {
        delete this.announcementAttaches[i].file;
      }
      const { createdStaffID,  announcementTypeID, announcementAttaches, title, content  } = this;
      await this.innowayApi.announcement.update(this.id, {  createdStaffID,  announcementTypeID, announcementAttaches, title, content   });
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
      //this.backToListForAddNew();
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


  async getListAnnouncementTypes() {
    try {
      const query = Object.assign({
        sortBy: this.sortName,
        sortType: this.sortType
      }, this.query);
      this.listAnnouncementTypes = await this.innowayApi.announcementType.getList({ query });
      this.ref.detectChanges();
    } catch (err) {

    }
  }

  addAttaches() {
    this.announcementAttaches.push(
      {
        name: null,
        url: null,
        file: null
      }
    )
  }

  async uploadAttaches(event: any, i: number) {
    if (event.target.files && event.target.files[0]) {
      this.chosenFile = event.target.files[0];
    }
    if (!this.chosenFile) {
      this.alertPleaseChooseAFile();
      return;
    }
    this.spinnerLoading = true;

    const filePath = 'announcement/' + this.chosenFile.name+ '-' + this.chosenFile.lastModified;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, this.chosenFile);

    task.percentageChanges().subscribe(
      value => {
        this.uploadingPercent = value
        if (this.uploadingPercent === 100 ) {
          this.spinnerLoading = false;
        }
      },
      error => console.log('percentageChanges() onError', error),
      () => console.log('percentageChanges() onComplete')
    );

    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(
          value => this.announcementAttaches[i].url = value,
          error => console.log('getDownloadURL() onError', error),
          () => console.log('getDownloadURL() onComplete'));
      })
    )
      .subscribe(
        res => res,
        err => console.log('onError: %s', err),
        () => console.log('onCompleted'));
    this.ref.detectChanges();
  }

  async alertPleaseChooseAFile() {
    return await swal({
      title: 'Vui lòng chọn file',
      type: 'warning',
      timer: 1000,
    });
  }

  checkIsValidURL = (str) => {
    const res = str.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return res != null;
  };

  alertIsValidURL() {
    return swal({
      title: 'Đường dẫn tập tin không hợp lệ',
      type: 'warning',
      timer: 2000,
    });
  }
}
