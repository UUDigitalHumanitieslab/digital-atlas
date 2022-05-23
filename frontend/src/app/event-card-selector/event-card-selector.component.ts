import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { Author, CollectedData, Legacy, LifeEvent, PartialDate, Work } from '../models/data';
import { DataService } from '../services/data.service';
import { EventCard, EventCardService } from '../services/event-card.service';
import { VisualService } from '../services/visual.service';

interface CardAuthor {
    info: Author;
    picture: string;
    events: EventCard[];
    show: boolean;
}

@Component({
    selector: 'da-event-card-selector',
    templateUrl: './event-card-selector.component.html',
    styleUrls: ['./event-card-selector.component.scss']
})
export class EventCardSelectorComponent implements OnChanges, OnInit {
    private data: Promise<CollectedData>;
    authors: CardAuthor[] = [];

    @Input()
    events: (LifeEvent | Work | Legacy)[];

    @Output()
    selected = new EventEmitter<LifeEvent | Work | Legacy>();

    constructor(private dataService: DataService, private visualService: VisualService, private eventCardService: EventCardService) {
        this.data = this.dataService.getData();
    }

    async ngOnInit(): Promise<void> {
    }

    async ngOnChanges(changes: SimpleChanges): Promise<void> {
        const data = await this.data;
        const events = (this.events ?? []);
        events.sort((a, b) => PartialDate.comparer(a.startDate || a.date, b.startDate || b.date));
        const cards = events.map(event => this.eventCardService.get(event, data, true));
        const cardsGroupedByAuthors: { [id: number]: EventCard[] } = {};

        for (const author of data.authors) {
            cardsGroupedByAuthors[author.id] = [];
        }

        for (const card of cards) {
            for (const author of card.authors) {
                cardsGroupedByAuthors[author.id].push(card);
            }
        }

        // retain the default order of authors
        const update: EventCardSelectorComponent['authors'] = [];
        for (const author of data.authors) {
            const groupedCards = cardsGroupedByAuthors[author.id];
            if (groupedCards.length) {
                update.push({
                    info: author,
                    picture: this.visualService.getPictureSource(author, data),
                    events: groupedCards,
                    show: true
                });
            }
        }

        this.authors = update;
    }

    toggleAuthor(author: CardAuthor): void {
        if (this.authors.length > 1) {
            author.show = !author.show;
        }
    }
}

