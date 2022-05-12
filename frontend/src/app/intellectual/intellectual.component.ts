import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Author, CollectedData, Legacy, LifeEvent, Picture, Work } from '../models/data';
import { TimelineEvent } from '../models/timeline';
import { DataService } from '../services/data.service';
import { DatesService } from '../services/dates.service';
import { VisualService } from '../services/visual.service';

@Component({
    selector: 'da-intellectual',
    templateUrl: './intellectual.component.html',
    styleUrls: ['./intellectual.component.scss']
})
export class IntellectualComponent implements OnInit, OnDestroy {
    data: CollectedData;
    author: Author;
    events: (LifeEvent & { formattedDate: string })[];
    pictureFile: string;
    picture: Picture;
    subscription = new Subscription();

    selectedEvent: LifeEvent|Work|Legacy;
    selectedEventPosition: number;

    icons: any;

    constructor(private route: ActivatedRoute, private dataService: DataService, private datesService: DatesService,
                private visualService: VisualService) {
        this.icons = this.visualService.icons;
    }

    ngOnInit(): void {
        this.subscription.add(
            this.route.params.subscribe(params =>
                this.loadData(parseInt(params.id, 10))));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    private async loadData(id: number): Promise<void> {
        this.data = await this.dataService.getData();
        this.author = this.dataService.findAuthorById(id, this.data.authors);
        this.picture = this.visualService.getPicture(this.author, this.data);
        this.pictureFile = this.visualService.pictureSource(this.picture);
    }

    onEventSelect(event: {event: LifeEvent|Work|Legacy, y: number}): void {
        this.selectedEvent = event.event;
        this.selectedEventPosition = event.y;
    }
}
