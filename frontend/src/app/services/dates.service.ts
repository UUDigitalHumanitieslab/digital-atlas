import { Injectable } from '@angular/core';
import { Legacy, LifeEvent, PartialDate, Work } from '../models/data';

@Injectable({
    providedIn: 'root'
})
export class DatesService {
    months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    constructor() { }

    getStartYear(event: LifeEvent|Work|Legacy): number {
        if (event.startDate) {
            return event.startDate.year;
        }
        if (event.date) {
            return event.date.year;
        }
    }

    getEndYear(event: LifeEvent|Work|Legacy): number {
        if (event.endDate) {
            return event.endDate.year;
        }
        if (event.date) {
            return event.date.year;
        }
        return 2022;
    }

    formatEventDate(event: LifeEvent|Work|Legacy): string {
        if (event.date) {
            return event.date.toString();
        }
        if (event.startDate && event.endDate) {
            return `${event.startDate.toString()} to ${event.endDate.toString()}`;
        }
        if (event.startDate) {
            return `since ${event.startDate.toString()}`;
        }
        if (event.endDate) {
            return `until ${event.endDate.toString()}`;
        }
    }
}
