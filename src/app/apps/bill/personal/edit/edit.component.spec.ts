import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPersonalBillComponent } from './edit.component';

describe('EditPersonalBillComponent', () => {
  let component: EditPersonalBillComponent;
  let fixture: ComponentFixture<EditPersonalBillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPersonalBillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPersonalBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
