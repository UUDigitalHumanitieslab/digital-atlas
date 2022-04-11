import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Author, LifeEvent } from '../models/data';
import { DataService } from '../services/data.service';
import { DatesService } from '../services/dates.service';

@Component({
    selector: 'da-intellectual',
    templateUrl: './intellectual.component.html',
    styleUrls: ['./intellectual.component.scss']
})
export class IntellectualComponent implements OnInit, OnDestroy {
    author: Author;
    events: (LifeEvent & { formattedDate: string })[];
    subscription = new Subscription();

    constructor(private route: ActivatedRoute, private dataService: DataService, private datesService: DatesService) { }

    ngOnInit(): void {
        this.subscription.add(
            this.route.params.subscribe(params =>
                this.loadData(params.id)));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    private async loadData(id: number) {
        const data = await this.dataService.getData();
        this.author = this.dataService.findAuthorById(id, data.authors);
        this.events = this.dataService.findByAuthor(this.author.id, data.lifeEvents).map(
            event => ({
                ...event,
                formattedDate: this.datesService.formatEventDate(event)
            }));
    }

}
