import { Injectable } from '@angular/core';
import { Author, Work, Location } from '../models/data';

@Injectable({
    providedIn: 'root'
})
export class DataService {

    constructor() { }

    parseData(data): void {
        const locations = data.locations as Location[];
        const authors = this.parseAuthors(data.authors, locations);
        const works = this.parseWorks(data.works, locations);
        console.log(works[0]);
    }

    loadDataFile(): Promise<any> {
        return fetch('/assets/data/data.json').then(response => {
            return response.json();
        });
    }

    //  FIELD PARSER FUNCTION

    parseOptionalString(input?: string): string|undefined {
        if (input && input.length) {
            return input;
        }
    }

    parseDate(input?: string): Date {
        if (input && input.length) {
            return new Date(input);
        }
    }

    parsePictures(input?: string): string[] {
        if (input && input.length) {
            return input.split(',').map(item => item.trim());
        }
    }

    // LOCATION MATCH-UP

    findLocation(name: string, locations: Location[]): Location {
        return locations.find(location => location.name === name);
    }

    // TABLE PARSER FUNCTIONS

    parseAuthors(authorData: any[], locations: Location[]): Author[] {
        return authorData.map(item => ({
            name: item.name,
            description: item.description,
            dateOfBirth: this.parseDate(item.date_of_birth),
            placeOfBirth: this.findLocation(item.place_of_birth, locations),
            dateOfDeath: this.parseDate(item.date_of_death),
            placeOfDeath: this.findLocation(item.place_of_death, locations),
            pictures: this.parsePictures(item.pictures)
        }));
    }

    parseWorks(workData: any[], locations: Location[]): Work[] {
        return workData.map(item => ({
            author: item.author_name,
            category: item.category,
            date: this.parseDate(item.date),
            startDate: this.parseDate(item.start_date),
            endDate: this.parseDate(item.end_date),
            title: item.title,
            description: item.description,
            pictures: this.parsePictures(item.pictures),
            where: this.findLocation(item.where, locations),
        }));
    }
}
