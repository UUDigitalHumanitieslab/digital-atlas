import { Injectable } from '@angular/core';
import { Legacy, LifeEvent, PartialDate, Work } from '../models/data';

@Injectable({
    providedIn: 'root'
})
export class DatesService {

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

    eventInDateRange(event: LifeEvent|Work|Legacy, dateRange: number[]): boolean {
        const minYear = dateRange[0];
        const maxYear = dateRange[1];
        const startYear = this.getStartYear(event);
        const endYear = this.getEndYear(event);
        return startYear <= maxYear && endYear >= minYear;
    }
}
