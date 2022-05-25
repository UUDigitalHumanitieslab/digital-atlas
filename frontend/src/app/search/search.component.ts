import { Component, OnInit } from '@angular/core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject, Subscription, } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { LifeEvent, Work, Legacy } from '../models/data';
import { DataService } from '../services/data.service';
import { EventCard, EventCardService } from '../services/event-card.service';
import { HighlightService } from '../services/highlight.service';

@Component({
    selector: 'da-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
    faSearch = faSearch;
    subscription = new Subscription();

    searchTextDebounced = '';
    searchText$ = new BehaviorSubject<string>('');
    get searchText(): string {
        return this.searchText$.value;
    }
    set searchText(value: string) {
        this.searchText$.next(value);
    }

    events: (LifeEvent | Work | Legacy)[] = [];
    selectedEvent: LifeEvent | Work | Legacy;

    private allCards: EventCard[];

    constructor(
        private dataService: DataService,
        private eventCardService: EventCardService,
        private highlightService: HighlightService) { }

    ngOnInit(): void {
        this.subscription.add(
            this.searchText$.pipe(debounceTime(100)).subscribe(searchText => {
                this.searchTextDebounced = searchText;
                this.events = this.searchEvents(searchText);
            }));

        this.dataService.getData().then(data => {
            this.allCards = [
                ...data.lifeEvents,
                ...data.works,
                ...data.legacies].map(event =>
                    this.eventCardService.get(event, data, true));
        });
    }

    private searchEvents(searchText: string): (LifeEvent | Work | Legacy)[] {
        return this.allCards.filter(card => this.cardIsMatch(card, searchText)).map(card => card.info);
    }

    private cardIsMatch(card: EventCard, searchText: string): boolean {
        for (const [key, value] of Object.entries(card)) {
            for (const part of this.highlightService.queryText(`${value || ''}`, searchText)) {
                if (part.isHit) {
                    return true;
                }
            }
        }

        return false;
    }

}
