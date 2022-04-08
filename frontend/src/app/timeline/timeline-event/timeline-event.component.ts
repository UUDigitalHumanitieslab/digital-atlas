import { Component, Input, OnInit } from '@angular/core';
import { faBook, faLandmark, faUser } from '@fortawesome/free-solid-svg-icons';
import { TimelineEvent } from 'src/app/models/timeline';

@Component({
    selector: 'da-timeline-event',
    templateUrl: './timeline-event.component.html',
    styleUrls: ['./timeline-event.component.scss']
})
export class TimelineEventComponent implements OnInit {
    icons = {
        'life event': faUser,
        work: faBook,
        legacy: faLandmark
    };

    @Input() event: TimelineEvent;

    constructor() { }

    ngOnInit(): void {
    }

}
