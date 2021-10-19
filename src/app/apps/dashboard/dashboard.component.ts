import { Component, OnInit} from '@angular/core';
import { InnowayApiService } from '../../services/innoway/innoway-api.service';
import { InnowayConfigService } from '../../services/innoway';

// import { TranslateService } from '@ngx-translate/core';

declare let swal: any;

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  constructor(
    public innowayApi: InnowayApiService,
    public innowayConfig: InnowayConfigService,) {
    
  }
  ngOnInit() {
    this.getProfileStaff();
  }

  async getProfileStaff(){
    try {
      const profileUser: any = await this.innowayApi.staff.getProfileOfStaff();
      if (profileUser) {
        const profile = {
          id: profileUser.id,
          avatarUrl: profileUser.avatarUrl,
          email: profileUser.email,
          firstName: profileUser.firstName,
          lastName: profileUser.lastName,
          user_id_firebase: profileUser.id,
          department: {
            id: profileUser.department.id
          }
        };
        this.innowayConfig.isLogon = 'true';
        this.innowayConfig.id = profile.id;
        this.innowayConfig.avatarUrl = profile.avatarUrl;
        this.innowayConfig.email = profile.email;
        this.innowayConfig.firstName = profile.firstName;
        this.innowayConfig.lastName = profile.lastName;
        this.innowayConfig.user_id_firebase = profile.user_id_firebase;
        this.innowayConfig.departmentID = profile.department.id;
      }
    } catch (err) {
      console.log('err dashboard component: ', err);
    }
  }
  
}
