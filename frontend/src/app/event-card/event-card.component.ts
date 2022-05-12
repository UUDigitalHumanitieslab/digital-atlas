import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { faCalendar, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { Author, CollectedData, Legacy, LifeEvent, Work } from '../models/data';
import { DataService } from '../services/data.service';
import { DatesService } from '../services/dates.service';
import { VisualService } from '../services/visual.service';

@Component({
    selector: 'da-event-card',
    templateUrl: './event-card.component.html',
    styleUrls: ['./event-card.component.scss']
})
export class EventCardComponent implements OnInit, OnChanges {
    @Input() event: LifeEvent|Work|Legacy;
    data: CollectedData;
    @Input() includeAuthor = true;

    authors: Author[];
    picture: string;
    formattedDate: string;
    color: string;

    faCalendar = faCalendar;
    faMapMarker = faMapMarkerAlt;

    constructor(private dataService: DataService, private datesService: DatesService, private visualService: VisualService) { }

    ngOnInit(): void {
    }

    async ngOnChanges(changes: SimpleChanges): Promise<void> {
        if (this.event) {
            this.data = await this.dataService.getData();

            this.formattedDate = this.datesService.formatEventDate(this.event);

            this.picture = this.visualService.getPictureSource(this.event, this.data);
            this.color = this.visualService.getColor(this.event, this.data);

            if (this.includeAuthor) {
                const authorIds = (this.event as Legacy).aboutIds || [(this.event as LifeEvent|Work).authorId];
                this.authors = authorIds.map(id => this.data.authors.find(author => author.id === id));
            } else {
                this.authors = [];
            }
        }
    }

    getPicture(author: Author): string {
        return this.visualService.getPictureSource(author, this.data);
    }

}
