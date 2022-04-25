import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Author, CollectedData, Legacy, LifeEvent, Work } from '../models/data';
import { DatesService } from '../services/dates.service';
import { PictureService } from '../services/picture.service';

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

    constructor(private datesService: DatesService, private pictureService: PictureService) { }

    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.event && this.data) {
            this.formattedDate = this.datesService.formatEventDate(this.event);

            this.picture = this.pictureService.getPicture(this.event, this.data);

            let authorIds: number[];
            if ((this.event as LifeEvent | Work).authorId) {
                authorIds = [(this.event as LifeEvent | Work).authorId];
            } else {
                authorIds = (this.event as Legacy).aboutIds;
            }
        }

    }

}
