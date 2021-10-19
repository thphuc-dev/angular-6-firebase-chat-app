import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriorityTargetComponent } from './priority-target.component';

describe('PriorityTargetComponent', () => {
  let component: PriorityTargetComponent;
  let fixture: ComponentFixture<PriorityTargetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriorityTargetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriorityTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
