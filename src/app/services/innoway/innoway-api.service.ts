import { Injectable } from '@angular/core';
import { InnowayAuthService } from './innoway-auth.service';
import { InnowayConfigService } from './innoway-config.service';
import { FcmService } from './fcm.service';
import { FileUploader } from './api/crud/file-uploader';
import { HttpClient } from '@angular/common/http';
import { Announcement } from './api/crud/announcement';
import { Race } from './api/crud/race';
import { Regions } from './api/crud/regions';
import { Districts } from './api/crud/districts';
import { Wards } from './api/crud/wards';
import { Nationalities } from './api/crud/nationalities';
import { Religion } from './api/crud/religion';
import { PriorityTarget } from './api/crud/priority-target';
import { RoomType } from './api/crud/room-type';
import { RoomFee } from './api/crud/room-fee';
import { School } from './api/crud/school';
import { Major } from './api/crud/major';
import { Class } from './api/crud/class';
import { Building } from './api/crud/building';
import { Advertisement } from './api/crud/advertisement';
import { Auth } from './api/crud/auth';
import { Role } from './api/crud/role';
import { AnnouncementType } from './api/crud/announcement-type';
import { Department } from './api/crud/department';
import { Staff } from './api/crud/staff';
import { ApiRoutes } from './api/crud/api-routes';
import { Student } from './api/crud/student';
import { Bill } from './api/crud/bill';
@Injectable()
export class InnowayApiService {

  constructor(
    public innowayConfig: InnowayConfigService,
    public innowayAuth: InnowayAuthService,
    public fcm: FcmService,
    public http: HttpClient
  ) {

  }

  fileUploader = new FileUploader(this);
  announcement = new Announcement(this);
  race = new Race(this);
  regions = new Regions(this);
  districts = new Districts(this);
  wards = new Wards(this);
  religion = new Religion(this);
  priorityTarget = new PriorityTarget(this);
  roomType = new RoomType(this);
  roomFee = new RoomFee(this);
  school = new School(this);
  major = new Major(this);
  building = new Building(this);
  advertisement = new Advertisement(this);
  auth = new Auth(this);
  role = new Role(this);
  announcementType = new AnnouncementType(this);
  department = new Department(this);
  staff = new Staff(this);
  apiRoutes = new ApiRoutes(this);
  student = new Student(this);
  nationalities = new Nationalities(this);
  class = new Class(this);
  bill = new Bill(this);
}
