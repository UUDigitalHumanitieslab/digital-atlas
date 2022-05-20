import { Component, Input, OnChanges, OnInit, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faCalendar, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

import { Author, CollectedData, Legacy, LifeEvent, Work } from '../models/data';
import { DataService } from '../services/data.service';
import { EventCardService } from '../services/event-card.service';
import { VisualService } from '../services/visual.service';

@Component({
    selector: 'da-event-card',
    templateUrl: './event-card.component.html',
    styleUrls: ['./event-card.component.scss']
})
export class EventCardComponent implements OnInit, OnChanges {
    private data: Promise<CollectedData>;

    @Input() event: LifeEvent | Work | Legacy;
    @Input() includeAuthor = true;

    authors: { info: Author, picture: string }[];
    picture: string;
    formattedDate: string;
    color: string;

    categoryIcon: IconDefinition;
    faCalendar = faCalendar;
    faMapMarker = faMapMarkerAlt;

    @Output() ready = new EventEmitter<void>();

    constructor(private dataService: DataService, private eventCardService: EventCardService, private visualService: VisualService) {
        this.data = this.dataService.getData();
    }

    async ngOnInit(): Promise<void> {
    }

    async ngOnChanges(changes: SimpleChanges): Promise<void> {
        if (this.event) {
            const data = await this.data;
            const card = this.eventCardService.get(this.event, data, this.includeAuthor);

            this.formattedDate = card.date;

            this.picture = card.picture;
            this.color = card.color;

            this.categoryIcon = card.categoryIcon;
            this.authors = card.authors.map(author => ({
                info: author,
                picture: this.getPicture(author, data)
            }));
        }

        this.ready.emit();
    }


    getPicture(author: Author, data: CollectedData): string {
        return this.visualService.getPictureSource(author, data);
    }

}
