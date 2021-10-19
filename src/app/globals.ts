import { Injectable } from '@angular/core';

Injectable();
export class Globals {

  GENDERS = [
    {
      code: 'male',
      name: 'Nam'
    },
    {
      code: 'female',
      name: 'Nữ'
    },
    {
      code: 'other',
      name: 'Khác'
    }
  ];

  ACTORS = [
    {
      code: 'employee',
      name: 'Nhân viên'
    },
    {
      code: 'admin',
      name: 'Admin'
    },
    {
      code: 'SUPER_ADMIN',
      name: 'Super admin'
    }
  ];
}
