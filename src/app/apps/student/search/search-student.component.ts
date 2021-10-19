import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DataTable } from 'angular-2-data-table-bootstrap4/dist';
import { Router, ActivatedRoute } from '@angular/router';
import { InnowayApiService } from '../../../services/innoway/innoway-api.service';
import { Globals } from './../../../globals';
import { NgForm } from '@angular/forms';
import * as jsonexport from 'jsonexport/dist';
declare let swal: any;
declare var accounting: any;

@Component({
  selector: 'app-search-student',
  providers: [Globals],
  templateUrl: './search-student.component.html',
  styleUrls: ['./search-student.component.scss']
})
export class SearchStudentComponent implements OnInit {
  items: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  itemCount: number = 0;
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
  nid: any;
  rid: any;
  did: any;

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
  sid: any;

  //data infoCriteria search
  infoCriteria: any;
  username: string = null;
  firstName: string = null;
  lastName: string = null;
  gender: string = null;
  @ViewChild('itemsTable') itemsTable: DataTable;

  constructor(
    private router: Router,
    private globals: Globals,
    public innowayApi: InnowayApiService,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef
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
    let dataSearch = { ...this.infoCriteria, ...this.educationCriteria, ...this.locationCriteria, ...this.roomCriteria, };
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
      if (this.listNationalities.length > 0) {
        this.listNationalities.unshift({ id: null, name: null });
      }
      this.ref.detectChanges();
    } catch (err) {
      console.log('ERR: ', err);
    }
  }

  async getListRegions(event) {
    try {
      for (let i = 0; i < this.listNationalities.length; i++) {
        if (event.target.value === this.listNationalities[i].name) {
          this.nid = this.listNationalities[i].id
        }
      }
      this.listRegions = await this.innowayApi.regions.getListRegions(this.nid);
      if (this.listRegions.length > 0) {
        this.listRegions.unshift({ id: null, name: null });
      }
      this.loadNationalDone = true;
      this.ref.detectChanges();
    } catch (err) {
      console.log('ERR: ', err);
    }
  }

  async getListDistricts(event) {
    try {
      for (let i = 0; i < this.listRegions.length; i++) {
        if (event.target.value === this.listRegions[i].name) {
          this.rid = this.listRegions[i].id
        }
      }
      this.listDistricts = await this.innowayApi.districts.getListDistricts(this.nid, this.rid);
      if (this.listDistricts.length > 0) {
        this.listDistricts.unshift({ id: null, name: null });
      }
      this.loadRegionDone = true;
      this.ref.detectChanges();
    } catch (err) {
      console.log('ERR: ', err);
    }
  }

  async getListWards(event) {
    try {
      for (let i = 0; i < this.listDistricts.length; i++) {
        if (event.target.value === this.listDistricts[i].name) {
          this.did = this.listDistricts[i].id
        }
      }
      this.listWards = await this.innowayApi.wards.getListWards(this.nid, this.rid, this.did);
      if (this.listWards.length > 0) {
        this.listWards.unshift({ id: null, name: null });
      }
      this.loadDistrictDone = true;
      this.ref.detectChanges();
    } catch (err) {
      console.log('ERR: ', err);
    }
  }

  async getListBuildings() {
    try {
      this.listBuildings = await this.innowayApi.building.getList();
      if (this.listBuildings.length > 0) {
        this.listBuildings.unshift({ id: null, name: 'Tất cả' });
      }
      this.ref.detectChanges();
    } catch (err) {
      console.log('ERR: ', err);
    }
  }

  async getListRooms(event) {
    try {
      this.listRooms = await this.innowayApi.building.getListRooms(event.target.value);
      if (this.listRooms.length > 0) {
        this.listRooms.unshift({ id: null, name: null });
      }
      this.loadBuildingDone = true;
      this.ref.detectChanges();
    } catch (err) {
      console.log('ERR: ', err);
    }
  }

  async getListRoomTypes() {
    try {
      this.listRoomTypes = await this.innowayApi.roomType.getList();
      if (this.listRoomTypes.length > 0) {
        this.listRoomTypes.unshift({ id: null, name: 'null' });
      }
      this.ref.detectChanges();
    } catch (err) {
      console.log('ERR: ', err);
    }
  }

  async getListSchools() {
    try {
      this.listSchools = await this.innowayApi.school.getList();
      if (this.listSchools.length > 0) {
        this.listSchools.unshift({ id: null, name: null });
      }
      this.ref.detectChanges();
    } catch (err) {
      console.log('ERR: ', err);
    }
  }

  async getListMajors(event) {
    try {
      for (let i = 0; i < this.listSchools.length; i++) {
        if (event.target.value === this.listSchools[i].name) {
          this.sid = this.listSchools[i].id
        }
      }
      this.listMajors = await this.innowayApi.major.getListMajors(this.sid);
      if (this.listMajors.length > 0) {
        this.listMajors.unshift({ id: null, name: 'Tất cả' });
      }
      this.loadSchoolDone = true;
      this.ref.detectChanges();
    } catch (err) {
      console.log('ERR: ', err);
    }
  }

  async getListClasses(event) {
    try {
      this.listClasses = await this.innowayApi.class.getListClasses(this.sid, event.target.value);
      if (this.listClasses.length > 0) {
        this.listClasses.unshift({ id: null, name: 'Tất cả' });
      }
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
      if (this.school === 'null') {
        this.school = null;
      }
      if (this.nationality === 'null') {
        this.nationality = null;
      }
      if (this.building === 'null') {
        this.building = null;
      }
      if (this.major === 'null') {
        this.major = null;
      }
      if (this.schoolClass === 'null') {
        this.schoolClass = null;
      }
      if (this.region === 'null') {
        this.region = null;
      }
      if (this.district === 'null') {
        this.district = null;
      }
      if (this.ward === 'null') {
        this.ward = null;
      }
      if (this.room === 'null') {
        this.room = null;
      }
      if (this.roomType === 'null') {
        this.roomType = null;
      }
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
      let dataSearch = { ...this.infoCriteria, ...this.educationCriteria, ...this.locationCriteria, ...this.roomCriteria, };
      try {
        const query = Object.assign({
          pageSize: this.pageSize,
          pageIndex: this.pageIndex
        }, this.query);
        this.items.next(await this.innowayApi.staff.searchStudent(dataSearch, { query }));
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

  viewItem(item) {
    this.router.navigate(['../detail', item.id], { relativeTo: this.route });
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
    if (form.valid) {
      if (this.school === 'null') {
        this.school = null;
      }
      if (this.nationality === 'null') {
        this.nationality = null;
      }
      if (this.building === 'null') {
        this.building = null;
      }
      if (this.major === 'null') {
        this.major = null;
      }
      if (this.schoolClass === 'null') {
        this.schoolClass = null;
      }
      if (this.region === 'null') {
        this.region = null;
      }
      if (this.district === 'null') {
        this.district = null;
      }
      if (this.ward === 'null') {
        this.ward = null;
      }
      if (this.room === 'null') {
        this.room = null;
      }
      if (this.roomType === 'null') {
        this.roomType = null;
      }
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
      let dataSearch = { ...this.infoCriteria, ...this.educationCriteria, ...this.locationCriteria, ...this.roomCriteria, };
      try {
        const res: any = await this.innowayApi.staff.exportExcelListStudents(dataSearch);
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

  alertFormNotValid2() {
    return swal({
      title: 'Điều kiện xuất file hệ thống không hợp lệ, vui lòng kiểm tra lại',
      type: 'warning',
      timer: 2000,
    });
  }

  exportPDF(){
    if (this.itemsTable.selectedRows.length === 0) {
      return;
    }
    var listIdStudent = [];
    const rows = this.itemsTable.selectedRows;
    rows.forEach(row => {
      row.item.deleting = true;
      const item =  row.item;
      listIdStudent.push(item.id);
    });
    this.exportAllItem(listIdStudent);
  }
  
  async exportAllItem(item) {
    try {
      const res: any = await this.innowayApi.staff.exportPdfListStudents(item);
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
      this.alertFormNotValid2();
    }
  }
}