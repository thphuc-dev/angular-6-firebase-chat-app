import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMajorComponent } from './add-major.component';

describe('AddMajorComponent', () => {
  let component: AddMajorComponent;
  let fixture: ComponentFixture<AddMajorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMajorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMajorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
