import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineEventComponent } from './timeline-event.component';

describe('TimelineEventComponent', () => {
  let component: TimelineEventComponent;
  let fixture: ComponentFixture<TimelineEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimelineEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
