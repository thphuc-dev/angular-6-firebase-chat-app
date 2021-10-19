import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomFeeComponent } from './room-fee.component';

describe('RoomFeeComponent', () => {
  let component: RoomFeeComponent;
  let fixture: ComponentFixture<RoomFeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomFeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
