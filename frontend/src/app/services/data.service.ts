import { Injectable } from '@angular/core';
import { Author, Work, Location } from '../models/data';

@Injectable({
    providedIn: 'root'
})
export class DataService {

    constructor() { }

    parseData(data): void {
        const authors = this.parseAuthors(data.authors);
        const works = this.parseWorks(data.works);
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

    // TABLE PARSER FUNCTIONS

    parseAuthors(authorData: any[]): Author[] {
        return authorData.map(item => ({
            name: item.name,
            description: item.description,
            dateOfBirth: this.parseDate(item.date_of_birth),
            placeOfBirth: item.place_of_birth,
            dateOfDeath: this.parseDate(item.date_of_death),
            placeOfDeath: this.parseOptionalString(item.place_of_death),
            pictures: this.parsePictures(item.pictures)
        }));
    }

    parseWorks(workData: any[]): Work[] {
        return workData.map(item => ({
            author: item.author_name,
            category: item.category,
            date: this.parseDate(item.date),
            startDate: this.parseDate(item.start_date),
            endDate: this.parseDate(item.end_date),
            title: item.title,
            description: item.description,
            pictures: this.parsePictures(item.pictures),
            where: item.where,
        }));
    }
}
