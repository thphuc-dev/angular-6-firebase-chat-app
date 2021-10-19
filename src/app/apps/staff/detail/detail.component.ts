import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { InnowayApiService } from '../../../services/innoway/innoway-api.service';
import { Globals } from './../../../globals';
declare var $: any;
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
  submitting: boolean = false;
  firstName: string;
  lastName: string;
  email: string;
  roleName: string;
  departmentID: string;
  listDepartments: any;
  avatarUrl: string;

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
    this.getListDepartments();
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
      const data: any = await this.innowayApi.staff.getProfileStaff(this.id);
      this.firstName = data.firstName;
      this.lastName = data.lastName;
      this.email = data.email;
      this.avatarUrl = data.avatarUrl;
      if (data.department !== null) {
        this.departmentID = data.department.id;
      }
    } catch (err) {
      try { await this.alertItemNotFound(); } catch (err) { }
      console.log('ERRRR', err);
      this.backToList();
    }
  }
  a

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

  async getListDepartments() {
    try {
      const query = Object.assign({
        sortBy: this.sortName,
        sortType: this.sortType
      }, this.query);
      this.listDepartments = await this.innowayApi.department.getList({ query });
      this.ref.detectChanges();
    } catch (err) {

    }
  }
}
