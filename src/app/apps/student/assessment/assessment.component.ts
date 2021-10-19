import { Component, OnInit, ViewChild, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { InnowayApiService } from '../../../services/innoway/innoway-api.service';
import { Globals } from './../../../globals';
import { NgForm } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DataTable } from 'angular-2-data-table-bootstrap4/dist';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
declare let swal: any;
declare var accounting: any;

@Component({
  selector: 'app-assessment',
  providers: [Globals],
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.scss']
})
export class AssessmentComponent implements OnInit {
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

  //data locationCriteria search
  locationCriteria: any;
  nationality: string = null;
  region: string = null;
  district: string = null;
  ward: string = null;
  listNationalities: any;
  listRegions: any;
  listDistricts: any;
  listWards: any;
  loadNationalDone: boolean = false;
  loadRegionDone: boolean = false;
  loadDistrictDone: boolean = false;

  //data roomCriteria search
  roomCriteria: any;
  building: string = null;
  floor: string = null;
  roomType: string = null;
  room: string = null;
  hasRoom: boolean = null;
  listBuildings: any;
  listRooms: any;
  listRoomTypes: any;
  loadBuildingDone: boolean = false;

  //data educationCriteria search
  educationCriteria: any;
  school: string = null;
  major: string = null;
  schoolClass: string = null;
  schoolYearStart: string = null;
  schoolYearEnd: string = null;
  listSchools: any;
  listMajors: any;
  listClasses: any;
  loadSchoolDone: boolean = false;
  loadMajorDone: boolean = false;

  //data infoCriteria search
  infoCriteria: any;
  username: string = null;
  firstName: string = null;
  lastName: string = null;

  //Modal
  modalRef: BsModalRef;

  //data add
  comments: any;
  content: string;

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
    this.getListNationalities();
    this.getListBuildings();
    this.getListRoomTypes();
    this.getListSchools();
  }

  async reloadItems(params) {
    const { limit, offset } = params;
    this.query.pageSize = limit;
    this.query.pageIndex = offset / 10;
    await this.getItems();
  }

  async getItems() {
    this.infoCriteria = {
      infoCriteria: {
        username: this.username,
        firstName: this.firstName,
        lastName: this.lastName
      }
    }
    this.educationCriteria = {
      educationCriteria: {
        school: this.school,
        major: this.major,
        schoolClass: this.schoolClass,
        schoolYearStart: this.schoolYearStart,
        schoolYearEnd: this.schoolYearEnd
      }
    }
    this.locationCriteria = {
      locationCriteria: {
        nationality: this.nationality,
        region: this.region,
        district: this.district,
        ward: this.ward
      }
    }
    this.roomCriteria = {
      roomCriteria: {
        building: this.building,
        floor: this.floor,
        roomType: this.roomType,
        room: this.room,
        hasRoom: this.hasRoom
      }
    }
    let dataSearch = {...this.infoCriteria, ...this.educationCriteria, ...this.locationCriteria , ...this.roomCriteria, };
    const query = Object.assign({
      pageSize: this.pageSize,
      pageIndex: this.pageIndex
    }, this.query);
    this.items.next(await this.innowayApi.staff.searchStudent(dataSearch, { query }));
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

  async getListNationalities() {
    try {
      this.listNationalities = await this.innowayApi.nationalities.getList(); 
      this.ref.detectChanges();
    } catch (err) {
      console.log('ERR: ', err);
    }
  }

  async getListRegions(event) {
    try {
      this.listRegions = await this.innowayApi.regions.getListRegions(event.target.value); 
      this.loadNationalDone = true;
      this.ref.detectChanges();
    } catch (err) {
      console.log('ERR: ', err);
    }
  }

  async getListDistricts(event) {
    try {
      this.listDistricts = await this.innowayApi.districts.getListDistricts(this.nationality ,event.target.value); 
      this.loadRegionDone = true;
      this.ref.detectChanges();
    } catch (err) {
      console.log('ERR: ', err);
    }
  }

  async getListWards(event) {
    try {
      this.listWards = await this.innowayApi.wards.getListWards(this.nationality ,this.region ,event.target.value); 
      this.loadDistrictDone = true;
      this.ref.detectChanges();
    } catch (err) {
      console.log('ERR: ', err);
    }
  }

  async getListBuildings() {
    try {
      this.listBuildings = await this.innowayApi.building.getList(); 
      this.ref.detectChanges();
    } catch (err) {
      console.log('ERR: ', err);
    }
  }

  async getListRooms(event) {
    try {
      this.listRooms = await this.innowayApi.building.getListRooms(event.target.value); 
      this.loadBuildingDone = true;
      this.ref.detectChanges();
    } catch (err) {
      console.log('ERR: ', err);
    }
  }

  async getListRoomTypes() {
    try {
      this.listRoomTypes = await this.innowayApi.roomType.getList(); 
      this.ref.detectChanges();
    } catch (err) {
      console.log('ERR: ', err);
    }
  }

  async getListSchools() {
    try {
      this.listSchools = await this.innowayApi.school.getList(); 
      this.ref.detectChanges();
    } catch (err) {
      console.log('ERR: ', err);
    }
  }

  async getListMajors(event) {
    try {
      this.listMajors = await this.innowayApi.major.getListMajors(event.target.value); 
      this.loadSchoolDone = true;
      this.ref.detectChanges();
    } catch (err) {
      console.log('ERR: ', err);
    }
  }

  async getListClasses(event) {
    try {
      this.listClasses = await this.innowayApi.class.getListClasses(this.school,event.target.value); 
      this.loadMajorDone = true;
      this.ref.detectChanges();
    } catch (err) {
      console.log('ERR: ', err);
    }
  }

  async searchStudent(form: NgForm) {
    this.submitting = true;
    try {
      await this.searchStudentAPI(form);
    } catch (err) {
      console.log('ERROR SUBMIT', err);
    } finally {
      this.submitting = false;
    }
  }

  async searchStudentAPI(form: NgForm) {
    this.query = {};
    if (form.valid) {
      this.infoCriteria = {
        infoCriteria: {
          username: this.username,
          firstName: this.firstName,
          lastName: this.lastName
        }
      }
      this.educationCriteria = {
        educationCriteria: {
          school: this.school,
          major: this.major,
          schoolClass: this.schoolClass,
          schoolYearStart: this.schoolYearStart,
          schoolYearEnd: this.schoolYearEnd
        }
      }
      this.locationCriteria = {
        locationCriteria: {
          nationality: this.nationality,
          region: this.region,
          district: this.district,
          ward: this.ward
        }
      }
      this.roomCriteria = {
        roomCriteria: {
          building: this.building,
          floor: this.floor,
          roomType: this.roomType,
          room: this.room,
          hasRoom: this.hasRoom
        }
      }
      let dataSearch = {...this.infoCriteria, ...this.educationCriteria, ...this.locationCriteria , ...this.roomCriteria, };
      try {
        const query = Object.assign({
          pageSize: this.pageSize,
          pageIndex: this.pageIndex
        }, this.query);
        this.items.next(await this.innowayApi.staff.searchStudent(dataSearch, {query}));
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

  assessmentStudent(templateAdd: TemplateRef<any>) {
    if (this.itemsTable.selectedRows.length === 0) {
      this.alertHaveNotRows();
      return;
    }
    this.modalRef = this.modalService.show(templateAdd, Object.assign({}, { class: 'modal-lg' }));
  }

  async alertHaveNotRows() {
    return await swal({
      title: 'Lỗi! Vui lòng chọn sinh viên muốn đánh giá',
      type: 'warning',
      timer: 1000,
    });
  }

  getListAssessments(item) {
    this.router.navigate(['../assessment/list-assessment/', item.id], { relativeTo: this.route });
  }

  async addAssessment(form: NgForm) {
    this.submitting = true;
    try {
      await this.addItemAssessment(form);
    } catch (err) {
      this.alertAddFailed();
    } finally {
      this.submitting = false;
    }
  }

  alertAddFailed() {
    return swal({
      title: 'Thêm không thành công',
      type: 'warning',
      timer: 2000,
    });
  }

  async addItemAssessment(form: NgForm) {
    if (form.valid) {
      const rows = this.itemsTable.selectedRows;
      for (let i = 0; i < rows.length; i++){
        let student = rows[i];
        this.comments = {
          comments: {
            [student.item.id]: {
              comment: this.content
            }      
          }
        }
        try {
          var data = await this.innowayApi.staff.staffComment(this.comments);
        }
        catch (err) {
          console.log('err add comment: ', err);
        }
      }
      if (data) {
        this.alertAddSuccess();
        this.getItems();
        this.ref.detectChanges();
        this.modalRef.hide();
      }
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
}
