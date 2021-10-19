import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { InnowayApiService } from '../../../services/innoway/innoway-api.service';
import { Globals } from './../../../globals';
declare var $: any;
declare let swal: any;

@Component({
  selector: 'app-role-api',
  providers: [Globals],
  templateUrl: './role-api.component.html',
  styleUrls: ['./role-api.component.scss']
})
export class RoleApiComponent implements OnInit {
  id: any;
  isEdit: boolean = false;
  submitting: boolean = false;
  name: string;
  listApiRoutes: any;
  listApis = [];
  apis: any = [];
  listRoleApisOfStaff: any;

  //multiselect
  itemList = [];
  selectedItems = [];
  settings = {};
  loadDataDone: boolean = false;
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
      this.backToList();
    } else {
      this.isEdit = true;
    }

    if (this.isEdit) {
      this.getListApiRoutes();
      this.getListRoleApisOfStaff();
      this.setData();
    }
    this.settings = {
      singleSelection: false,
      text: "Danh sách API",
      selectAllText: 'Chọn tất cả',
      unSelectAllText: 'Bỏ chọn tất cả',
      searchPlaceholderText: 'Nhập từ khoá tìm kiếm',
      enableSearchFilter: true,
      badgeShowLimit: 5,
      groupBy: "category",
      selectGroup: true,
    };
  }

  async setData() {
    try {
      const data = await this.innowayApi.role.getList();
      for (let i = 0; i < data.length; i++) {
        const item: any = data[i];
        if (parseInt(item.id, 10) === parseInt(this.id, 10)) {
          this.name = item.name;
        }
      }
    } catch (err) {
      try { await this.alertItemNotFound(); } catch (err) { }
      console.log('ERRRR', err);
      this.backToList();
    }
    
  }
  async updateItem(form: NgForm) {
    if (form.valid) {
      const list_id_api: any = [];
      for (let i = 0; i < this.apis.length; i++){
        const api = this.apis[i];
        list_id_api.push(api.id);
      }
      this.apis = list_id_api;
      await this.innowayApi.apiRoutes.updateRoleApis(this.id, this.apis );
      form.reset();
      this.alertUpdateSuccess();
      this.backToList();
    } else {
      this.alertFormNotValid();
    }
  }



  async updateAndClose(form: NgForm) {
    this.submitting = true;
    try {
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

  async getListApiRoutes() {
    try {
      this.listApiRoutes = await this.innowayApi.apiRoutes.getListApis();
      const list_array: any = [];
      for (let i = 0; i < this.listApiRoutes.length; i++) {
        const typeApis: any = this.listApiRoutes[i];
        for (let j = 0; j < typeApis.apiFunctions.length; j++) {
          const apiFunctions: any = typeApis.apiFunctions[j];
          for (let k = 0; k < apiFunctions.apis.length; k++){
            const api: any = apiFunctions.apis[k];
            list_array.push({
              'id': api.id,
              'itemName': api.description,
              'category': apiFunctions.description
            });
          }
        }
      }
      this.listApis = list_array;
      this.loadDataDone = true;
      this.ref.detectChanges();
    } catch (err) {
      console.log('ERR: ', err);
    }
  }

  selectedCategory = (item, selected) => {
    if (selected.category && item.category) {
        return item.category === selected.category;
    }
    if (item.name && selected.name) {
        return item.name === selected.name;
    }
    return false;
  };

  async getListRoleApisOfStaff() {
    try {
      const list_array: any = [];
      this.listRoleApisOfStaff = await this.innowayApi.apiRoutes.getListRoleApisOfStaff(this.id); 
      for (let i = 0; i < this.listRoleApisOfStaff.length; i++) {
        const item = this.listRoleApisOfStaff[i];
        list_array.push({
          'id': item.id,
          'itemName': item.description
        });
      }
      this.apis = list_array;
      this.ref.detectChanges();
    } catch (err) {
      console.log('ERR: ', err);
    }
  }

  onItemSelect(item: any) {
    console.log(item);
    console.log(this.selectedItems);
  }
  OnItemDeSelect(item: any) {
      console.log(item);
      console.log(this.selectedItems);
  }
  onSelectAll(items: any) {
      console.log(items);
  }
  onDeSelectAll(items: any) {
      console.log(items);
  }
}
