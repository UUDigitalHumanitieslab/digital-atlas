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
            return this.formatPartialDate(event.date);
        }
        if (event.startDate && event.endDate) {
            return `${this.formatPartialDate(event.startDate)} to ${this.formatPartialDate(event.endDate)}`;
        }
        if (event.startDate) {
            return `since ${this.formatPartialDate(event.startDate)}`;
        }
        if (event.endDate) {
            return `until ${this.formatPartialDate(event.endDate)}`;
        }
    }

    /**
     * Turn a partial date into a nice string for user interface.
     */
    formatPartialDate(date: PartialDate): string {
        if (date.day && date.month) {
            const month = this.months[date.month];
            return `${date.day} ${month} ${date.year}`;
        }
        if (date.month) {
            const month = this.months[date.month];
            return `${month} ${date.year}`;
        }
        return `${date.year}`;
    }
}
