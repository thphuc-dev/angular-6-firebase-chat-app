import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddComponent } from './add/add.component';
import { StudentComponent } from './student.component';
import { SearchStudentComponent } from './search/search-student.component';
import { RegisterToStayComponent } from './register-to-stay/register-to-stay.component';
import { AssessmentComponent } from './assessment/assessment.component';
import { ListAssessmentComponent } from './assessment/list-assessment/list-assessment.component';
import { DetailComponent } from './detail/detail.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: '',
    data: {
      title: 'Sinh viên'
    },
    children: [
      {
        path: 'add',
        component: AddComponent,
        data: {
          title: 'Thêm'
        }
      },
      {
        path: 'detail/:id',
        component: DetailComponent,
        data: {
          title: 'Thông tin sinh viên'
        }
      },
      {
        path: 'list',
        component: StudentComponent,
        data: {
          title: 'Danh sách'
        }
      },
      {
        path: 'search',
        component: SearchStudentComponent,
        data: {
          title: 'Tìm kiếm sinh viên'
        }
      },
      {
        path: 'assessment',
        component: AssessmentComponent,
        data: {
          title: 'Kiểm tra đánh giá'
        }
      },
      {
        path: 'register-to-stay',
        component: RegisterToStayComponent,
        data: {
          title: 'Đăng ký nội trú'
        }
      },
      {
        path: 'assessment/list-assessment/:id',
        component: ListAssessmentComponent,
        data: {
          title: 'Danh sách đánh giá của sinh viên'
        }
      },
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
