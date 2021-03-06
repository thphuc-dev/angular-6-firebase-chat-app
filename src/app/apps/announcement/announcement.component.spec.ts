import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAnnouncementComponent } from './announcement.component';

describe('AddAnnouncementComponent', () => {
  let component: AddAnnouncementComponent;
  let fixture: ComponentFixture<AddAnnouncementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAnnouncementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAnnouncementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
