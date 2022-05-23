import { Injectable } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';

import { Author, Categories, CollectedData, Legacy, LifeEvent, Work } from '../models/data';
import { DatesService } from './dates.service';
import { VisualService } from './visual.service';

export interface EventCard  {
    title: string;
    description: string;
    category: Categories;
    color: string;
    date: string;
    picture: string;
    categoryIcon: IconDefinition;
    authors: Author[];
    info: LifeEvent | Work | Legacy;
}

@Injectable({
    providedIn: 'root'
})
export class EventCardService {

    constructor(private datesService: DatesService, private visualService: VisualService) { }

    get(event: LifeEvent | Work | Legacy, data: CollectedData, includeAuthors = true): EventCard {
        return {
            title: event.title,
            description: event.description,
            date: this.datesService.formatEventDate(event),
            picture: this.visualService.getPictureSource(event, data),
            color: this.visualService.getColor(event, data),
            category: event.category,
            categoryIcon: this.visualService.icons[event.type],
            authors: includeAuthors ? this.getAuthors(event, data) : [],
            info: event
        };
    }

    private getAuthors(event: LifeEvent | Work | Legacy, data: CollectedData): Author[] {
        const authorIds = (event as Legacy).aboutIds || [(event as LifeEvent | Work).authorId];
        return authorIds.map(id => data.authors.find(author => author.id === id));
    }
}
