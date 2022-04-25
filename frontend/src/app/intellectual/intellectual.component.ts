import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Author, CollectedData, LifeEvent } from '../models/data';
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
    picture: string;
    subscription = new Subscription();

    constructor(private route: ActivatedRoute, private dataService: DataService, private datesService: DatesService,
        private visualService: VisualService) { }

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
        this.events = this.dataService.findByAuthor(this.author.id, this.data.lifeEvents).map(
            event => ({
                ...event,
                formattedDate: this.datesService.formatEventDate(event)
            }));
    }

}
