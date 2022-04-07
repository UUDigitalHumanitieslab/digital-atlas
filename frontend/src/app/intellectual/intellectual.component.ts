import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Author } from '../models/data';
import { DataService } from '../services/data.service';

@Component({
    selector: 'da-intellectual',
    templateUrl: './intellectual.component.html',
    styleUrls: ['./intellectual.component.scss']
})
export class IntellectualComponent implements OnInit, OnDestroy {
    author: Author;
    subscription = new Subscription();

    constructor(private route: ActivatedRoute, private dataService: DataService) { }

    ngOnInit(): void {
        this.subscription.add(
            this.route.params.subscribe(params =>
                this.loadAuthor(params.id)));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    private async loadAuthor(id: number) {
        console.log(id);
        this.author = this.dataService.findAuthorById(id, (await this.dataService.getData()).authors);
    }

}
