import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterToStayComponent } from './register-to-stay.component';

describe('RegisterToStayComponent', () => {
  let component: RegisterToStayComponent;
  let fixture: ComponentFixture<RegisterToStayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterToStayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterToStayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
