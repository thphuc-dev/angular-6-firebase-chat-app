import { FullLayoutComponent } from './full-layout.component';
import { AuthGuard } from '../../services/guards/auth.guard';
export const FullLayoutRouting = {
  path: '',
  component: FullLayoutComponent,
  canActivate: [AuthGuard],
  children: [
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
    {
      path: 'dashboard',
      loadChildren: '../../apps/dashboard/dashboard.module#DashboardModule'
    },
    {
      path: 'announcement',
      loadChildren: '../../apps/announcement/announcement.module#AddAnnouncementModule'
    },
    {
      path: 'chat',
      loadChildren: '../../apps/chat/chat.module#ChatModule'
    },
    {
      path: 'data/race',
      loadChildren: '../../apps/data/race/race.module#RaceModule'
    },
    {
      path: 'data/nationality',
      loadChildren: '../../apps/data/nationality/nationality.module#NationalityModule'
    },
    {
      path: 'data/religion',
      loadChildren: '../../apps/data/religion/religion.module#ReligionModule'
    },
    {
      path: 'data/priority-target',
      loadChildren: '../../apps/data/priority-target/priority-target.module#PriorityTargetModule'
    },
    {
      path: 'data/school',
      loadChildren: '../../apps/data/school/school.module#SchoolModule'
    },
    {
      path: 'data/major',
      loadChildren: '../../apps/data/major/major.module#MajorModule'
    },
    {
      path: 'data/building',
      loadChildren: '../../apps/data/building/building.module#BuildingModule'
    },
    {
      path: 'advertisement',
      loadChildren: '../../apps/advertisement/advertisement.module#AdvertisementModule'
    },
    {
      path: 'data/room-fee',
      loadChildren: '../../apps/data/room-fee/room-fee.module#RoomFeeModule'
    },
    {
      path: 'data/room-type',
      loadChildren: '../../apps/data/room-type/room-type.module#RoomTypeModule'
    },
    {
      path: 'role',
      loadChildren: '../../apps/role/role.module#RoleModule'
    },
    {
      path: 'data/announcement-type',
      loadChildren: '../../apps/data/announcement-type/announcement-type.module#AnnouncementTypeModule'
    },
    {
      path: 'department',
      loadChildren: '../../apps/department/department.module#DepartmentModule'
    },
    {
      path: 'staff',
      loadChildren: '../../apps/staff/staff.module#StaffModule'
    },
    {
      path: 'student',
      loadChildren: '../../apps/student/student.module#StudentModule'
    },
    {
      path: 'bill',
      loadChildren: '../../apps/bill/bill.module#BillModule'
    },
    {
      path: 'room-manager',
      loadChildren: '../../apps/room-manager/room-manager.module#RoomManagerModule'
    },
  ],

};
