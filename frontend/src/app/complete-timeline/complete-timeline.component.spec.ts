import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteTimelineComponent } from './complete-timeline.component';

describe('CompleteTimelineComponent', () => {
  let component: CompleteTimelineComponent;
  let fixture: ComponentFixture<CompleteTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompleteTimelineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompleteTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
