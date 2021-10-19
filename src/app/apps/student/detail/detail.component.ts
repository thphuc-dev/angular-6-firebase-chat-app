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
      data.studentInfo.firstName !== null ? this.firstName = data.studentInfo.firstName : this.firstName = 'Chưa cập nhật';
      data.studentInfo.lastName !== null ? this.lastName = data.studentInfo.lastName : this.lastName = 'Chưa cập nhật';
      data.studentInfo.avatarUrl !== null ? this.avatarUrl = data.studentInfo.avatarUrl : this.avatarUrl = this.thumbDefault;
      data.studentInfo.dateOfBirth !== -1 ? this.dateOfBirth = data.studentInfo.dateOfBirth : this.dateOfBirth = 0;
      data.studentInfo.gender !== null ? this.gender = data.studentInfo.gender : this.gender = 'Chưa cập nhật';
      if (this.gender !== 'Chưa cập nhật') {
        if (this.gender === 'MALE') {
          this.gender = 'Nam';
        } else {
          this.gender = 'Nữ';
        }
      }
      data.studentInfo.ward !== null ? this.ward = data.studentInfo.ward.name : this.ward = 'Chưa cập nhật';
      data.studentInfo.district !== null ? this.district = data.studentInfo.district.name : this.district = 'Chưa cập nhật';
      data.studentInfo.region !== null ? this.region = data.studentInfo.region.name : this.region = 'Chưa cập nhật';
      data.studentInfo.nationality !== null ? this.nationality = data.studentInfo.nationality.name : this.nationality = 'Chưa cập nhật';
      data.studentInfo.idcard !== null ? this.idcard = data.studentInfo.idcard : this.idcard = 'Chưa cập nhật';
      this.isEditable = data.isEditable;
      //studentAdditionalInformation
      data.studentAdditionalInformation.race !== null ? this.race = data.studentAdditionalInformation.race.name : this.race = 'Chưa cập nhật';
      data.studentAdditionalInformation.religion !== null ? this.religion = data.studentAdditionalInformation.religion.name : this.religion = 'Chưa cập nhật';
      data.studentAdditionalInformation.priorityTarget !== null ? this.priorityTarget = data.studentAdditionalInformation.priorityTarget.name : this.priorityTarget = 'Chưa cập nhật';
      data.studentAdditionalInformation.email !== null ? this.email = data.studentAdditionalInformation.email : this.email = 'Chưa cập nhật';
      data.studentAdditionalInformation.mobile !== null ? this.mobile = data.studentAdditionalInformation.mobile : this.mobile = 'Chưa cập nhật';
      data.studentAdditionalInformation.contactAddress !== null ? this.contactAddress = data.studentAdditionalInformation.contactAddress : this.contactAddress = 'Chưa cập nhật';
      //studentEducation
      data.studentEducation.schoolClass !== null ? this.schoolClass = data.studentEducation.schoolClass.name : this.schoolClass = 'Chưa cập nhật';
      data.studentEducation.major !== null ? this.major = data.studentEducation.major.name : this.major = 'Chưa cập nhật';
      data.studentEducation.school !== null ? this.school = data.studentEducation.school.name : this.school = 'Chưa cập nhật';
      data.studentEducation.studentCode !== null ? this.studentCode = data.studentEducation.studentCode : this.studentCode = 'Chưa cập nhật';
      data.studentEducation.schoolYearStart !== -1 ? this.schoolYearStart = data.studentEducation.schoolYearStart : this.schoolYearStart = 0;
      data.studentEducation.schoolYearEnd !== -1 ? this.schoolYearEnd = data.studentEducation.schoolYearEnd : this.schoolYearEnd = 0;
      //studentIDCardImage
      data.studentIDCardImage.frontUrl !== null ? this.frontUrl = data.studentIDCardImage.frontUrl : this.frontUrl = null;
      data.studentIDCardImage.backUrl !== null ? this.backUrl = data.studentIDCardImage.backUrl : this.backUrl = null;
      if (this.isEditable) {
        this.editable = 'Chưa duyệt';
      } else {
        this.editable = 'Đã duyệt';
      }
      this.studentFamilies = data.studentFamilies;
      data.studentRoom !== null ? this.building = data.studentRoom.room.building.name : this.building = 'Chưa cập nhật';
      data.studentRoom !== null ? this.room = data.studentRoom.room.name : this.room = 'Chưa cập nhật';
      data.studentRoom !== null ? this.roomType = data.studentRoom.room.roomType : this.roomType = 'Chưa cập nhật';
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
      title: 'Không còn tồn tại',
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
    if (this.status) {
      this.alertText = 'không cho phép';
    } else {
      this.alertText = 'cho phép';
    }
    return await swal({
      title: 'Xác nhận',
      text: 'Bạn có chắc ' + this.alertText + ' cập nhật hồ sơ',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Quay lại'
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
      dwldLink.setAttribute('download', 'Hồ-sơ.pdf');
      dwldLink.style.visibility = 'hidden';
      document.body.appendChild(dwldLink);
      dwldLink.click();
      document.body.removeChild(dwldLink);
    } catch (err) {
      this.alertCannotVerified();
    }
  }
}
