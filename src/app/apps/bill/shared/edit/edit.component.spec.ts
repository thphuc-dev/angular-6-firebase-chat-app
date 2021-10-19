import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSharedBillComponent } from './edit.component';

describe('EditSharedBillComponent', () => {
  let component: EditSharedBillComponent;
  let fixture: ComponentFixture<EditSharedBillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSharedBillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSharedBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
