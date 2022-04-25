import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Author, CollectedData, Legacy, LifeEvent, Work } from '../models/data';
import { DatesService } from '../services/dates.service';
import { VisualService } from '../services/visual.service';

@Component({
    selector: 'da-event-card',
    templateUrl: './event-card.component.html',
    styleUrls: ['./event-card.component.scss']
})
export class EventCardComponent implements OnInit, OnChanges {
    @Input() event: LifeEvent|Work|Legacy;
    @Input() data: CollectedData;

    authors: Author[];
    picture: string;
    formattedDate: string;
    color: string;

    constructor(private datesService: DatesService, private visualService: VisualService) { }

    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.event && this.data) {
            this.formattedDate = this.datesService.formatEventDate(this.event);

            this.picture = this.visualService.getPicture(this.event, this.data);
            this.color = this.visualService.getColor(this.event, this.data);
        }

    }

}
