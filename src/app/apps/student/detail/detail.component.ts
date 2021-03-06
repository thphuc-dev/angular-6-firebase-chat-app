import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InnowayApiService } from '../../../services/innoway/innoway-api.service';
import { Globals } from './../../../globals';
declare let swal: any;

@Component({
  selector: 'app-detail',
  providers: [Globals],
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  id: any;
  isEdit: boolean = false;
  thumbDefault: string = '../../../../assets/img/default-image.jpg';
  isEditable: boolean;
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

  //studentAdditionalInformation
  race: string;
  religion: string;
  priorityTarget: string;
  email: string;
  mobile: string;
  contactAddress: string;

  //studentEducation
  schoolClass: string;
  major: string;
  school: string;
  studentCode: string;
  schoolYearStart: number;
  schoolYearEnd: number;

  //studentFamilies
  studentFamilies: any = [];

  //studentIDCardImage
  frontUrl: string;
  backUrl: string;

  //studentRoom
  building: string;
  room: string;
  roomType: string;
  status: boolean;
  alertText: string;

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
    } else {
      this.isEdit = true;
    }

    if (this.isEdit) {
      this.setData();
    }
  }
  async setData() {
    try {
      const data: any = await this.innowayApi.staff.getProfileStudent(this.id);
      //studentInfo
      data.studentInfo.firstName !== null ? this.firstName = data.studentInfo.firstName : this.firstName = 'Ch??a c???p nh???t';
      data.studentInfo.lastName !== null ? this.lastName = data.studentInfo.lastName : this.lastName = 'Ch??a c???p nh???t';
      data.studentInfo.avatarUrl !== null ? this.avatarUrl = data.studentInfo.avatarUrl : this.avatarUrl = this.thumbDefault;
      data.studentInfo.dateOfBirth !== -1 ? this.dateOfBirth = data.studentInfo.dateOfBirth : this.dateOfBirth = 0;
      data.studentInfo.gender !== null ? this.gender = data.studentInfo.gender : this.gender = 'Ch??a c???p nh???t';
      if (this.gender !== 'Ch??a c???p nh???t') {
        if (this.gender === 'MALE') {
          this.gender = 'Nam';
        } else {
          this.gender = 'N???';
        }
      }
      data.studentInfo.ward !== null ? this.ward = data.studentInfo.ward.name : this.ward = 'Ch??a c???p nh???t';
      data.studentInfo.district !== null ? this.district = data.studentInfo.district.name : this.district = 'Ch??a c???p nh???t';
      data.studentInfo.region !== null ? this.region = data.studentInfo.region.name : this.region = 'Ch??a c???p nh???t';
      data.studentInfo.nationality !== null ? this.nationality = data.studentInfo.nationality.name : this.nationality = 'Ch??a c???p nh???t';
      data.studentInfo.idcard !== null ? this.idcard = data.studentInfo.idcard : this.idcard = 'Ch??a c???p nh???t';
      this.isEditable = data.isEditable;
      //studentAdditionalInformation
      data.studentAdditionalInformation.race !== null ? this.race = data.studentAdditionalInformation.race.name : this.race = 'Ch??a c???p nh???t';
      data.studentAdditionalInformation.religion !== null ? this.religion = data.studentAdditionalInformation.religion.name : this.religion = 'Ch??a c???p nh???t';
      data.studentAdditionalInformation.priorityTarget !== null ? this.priorityTarget = data.studentAdditionalInformation.priorityTarget.name : this.priorityTarget = 'Ch??a c???p nh???t';
      data.studentAdditionalInformation.email !== null ? this.email = data.studentAdditionalInformation.email : this.email = 'Ch??a c???p nh???t';
      data.studentAdditionalInformation.mobile !== null ? this.mobile = data.studentAdditionalInformation.mobile : this.mobile = 'Ch??a c???p nh???t';
      data.studentAdditionalInformation.contactAddress !== null ? this.contactAddress = data.studentAdditionalInformation.contactAddress : this.contactAddress = 'Ch??a c???p nh???t';
      //studentEducation
      data.studentEducation.schoolClass !== null ? this.schoolClass = data.studentEducation.schoolClass.name : this.schoolClass = 'Ch??a c???p nh???t';
      data.studentEducation.major !== null ? this.major = data.studentEducation.major.name : this.major = 'Ch??a c???p nh???t';
      data.studentEducation.school !== null ? this.school = data.studentEducation.school.name : this.school = 'Ch??a c???p nh???t';
      data.studentEducation.studentCode !== null ? this.studentCode = data.studentEducation.studentCode : this.studentCode = 'Ch??a c???p nh???t';
      data.studentEducation.schoolYearStart !== -1 ? this.schoolYearStart = data.studentEducation.schoolYearStart : this.schoolYearStart = 0;
      data.studentEducation.schoolYearEnd !== -1 ? this.schoolYearEnd = data.studentEducation.schoolYearEnd : this.schoolYearEnd = 0;
      //studentIDCardImage
      data.studentIDCardImage.frontUrl !== null ? this.frontUrl = data.studentIDCardImage.frontUrl : this.frontUrl = null;
      data.studentIDCardImage.backUrl !== null ? this.backUrl = data.studentIDCardImage.backUrl : this.backUrl = null;
      if (this.isEditable) {
        this.editable = 'Ch??a duy???t';
      } else {
        this.editable = '???? duy???t';
      }
      this.studentFamilies = data.studentFamilies;
      data.studentRoom !== null ? this.building = data.studentRoom.room.building.name : this.building = 'Ch??a c???p nh???t';
      data.studentRoom !== null ? this.room = data.studentRoom.room.name : this.room = 'Ch??a c???p nh???t';
      data.studentRoom !== null ? this.roomType = data.studentRoom.room.roomType : this.roomType = 'Ch??a c???p nh???t';
    } catch (err) {
      try { await this.alertItemNotFound(); } catch (err) { }
      console.log('ERRRR', err);
      this.backToList();
    }
  }

  backToList() {
    this.router.navigate(['../../list'], { relativeTo: this.route });
  }

  alertItemNotFound() {
    swal({
      title: 'Kh??ng c??n t???n t???i',
      type: 'warning',
      timer: 2000
    });
  }

  async verifiedStudent(item) {
    if (this.isEditable) {
      this.status = true;
    } else {
      this.status = false;
    }
    try {
      const idStudent: any = [item];
      try { await this.confirmVerified(); } catch (err) { return; }
      await this.innowayApi.staff.verifiedStudent(idStudent, this.status);
      this.alertVerifiedSuccess();
      this.setData();
    } catch (err) {
      this.alertCannotVerified();
    } finally {
    }
  }

  async alertCannotVerified() {
    return await swal({
      title: '???? x???y ra l???i, vui l??ng ki???m tra l???i',
      type: 'warning',
      timer: 1000,
    });
  }
  async alertVerifiedSuccess() {
    return await swal({
      title: 'C???p nh???t th??nh c??ng',
      type: 'success',
      timer: 1000,
    });
  }

  async confirmVerified() {
    if (this.status) {
      this.alertText = 'kh??ng cho ph??p';
    } else {
      this.alertText = 'cho ph??p';
    }
    return await swal({
      title: 'X??c nh???n',
      text: 'B???n c?? ch???c ' + this.alertText + ' c???p nh???t h??? s??',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'X??c nh???n',
      cancelButtonText: 'Quay l???i'
    });
  }

  async exportPDF(id) {
    try {
      const ids = [id];
      const res: any = await this.innowayApi.staff.exportPdfListStudents(ids);
      const url = res.downloadUrl;
      const dwldLink = document.createElement('a');
      dwldLink.setAttribute('target', '_blank');
      dwldLink.setAttribute('href', url);
      dwldLink.setAttribute('download', 'H???-s??.pdf');
      dwldLink.style.visibility = 'hidden';
      document.body.appendChild(dwldLink);
      dwldLink.click();
      document.body.removeChild(dwldLink);
    } catch (err) {
      this.alertCannotVerified();
    }
  }
}
