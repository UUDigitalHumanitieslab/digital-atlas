import { Component, Input, OnInit } from '@angular/core';
import { TimelineEvent } from 'src/app/models/timeline';

@Component({
  selector: 'da-timeline-event',
  templateUrl: './timeline-event.component.html',
  styleUrls: ['./timeline-event.component.scss']
})
export class TimelineEventComponent implements OnInit {
  @Input() event: TimelineEvent;

  constructor() { }

  ngOnInit(): void {
  }

}
