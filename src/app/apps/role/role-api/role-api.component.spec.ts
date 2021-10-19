import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleApiComponent } from './role-api.component';

describe('RoleApiComponent', () => {
  let component: RoleApiComponent;
  let fixture: ComponentFixture<RoleApiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleApiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
