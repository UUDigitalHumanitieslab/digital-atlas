import { Injectable } from '@angular/core';
import * as _ from 'underscore';
import { Author, Work, Location, Legacy, LifeEvent, Categories, Category, Picture, CollectedData, PartialDate } from '../models/data';
import { DatesService } from './dates.service';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private dataPath = '/assets/data/data.json';

    private data: CollectedData;

    private promiseData: Promise<CollectedData>;

    constructor(private datesService: DatesService) { }

    /**
     * load all data
     */
    getData(): Promise<CollectedData> {
        if (!this.promiseData) {
            this.promiseData = new Promise<CollectedData>(async (resolve) => {
                const result = await this.loadDataFile();
                resolve(this.parseData(result));
            });
        }

        return this.promiseData;
    }

    filterData(data, authors: Author[], categories: string[], dateRange: number[]): CollectedData {
        const authorIds = authors.map(author => author.id);

        let lifeEvents: LifeEvent[];
        if (categories.includes('Life')) {
            lifeEvents = data.lifeEvents.filter(event =>
                authorIds.includes(event.authorId)
                &&
                this.datesService.eventInDateRange(event, dateRange)
            );
        } else {
            lifeEvents = [];
        }

        let works: Work[];
        if (categories.includes('Work')) {
            works = data.works.filter(event =>
                authorIds.includes(event.authorId)
                &&
                this.datesService.eventInDateRange(event, dateRange)
            );
        } else {
            works = [];
        }

        let legacies: Legacy[];
        if (categories.includes('Legacy')) {
            legacies = data.legacies.filter(event =>
                _.any(event.aboutIds, id => authorIds.includes(id))
                &&
                this.datesService.eventInDateRange(event, dateRange)
            );
        } else {
            legacies = [];
        }

        return {
            authors,
            lifeEvents,
            works,
            legacies,
            pictures: data.pictures,
            locations: data.locations,
        };
    }

    parseData(data: any): CollectedData {
        // pictures and locations can be imported as-is
        const locations = data.locations as Location[];
        const pictures = data.pictures as Picture[];

        // tables which require some transformations / data validation
        const authors = this.parseAuthors(data.authors, locations);
        const works = this.parseWorks(data.works, locations, authors);
        const legacies = this.parseLegacies(data.legacy, locations, authors);
        const lifeEvents = this.parseLifeEvents(data.events, locations, authors);

        return {
            locations, pictures, authors, works, legacies, lifeEvents
        };
    }

    loadDataFile(): Promise<any> {
        return fetch(this.dataPath).then(response => {
            return response.json();
        });
    }

    //  FIELD PARSER FUNCTION

    parseOptionalString(input?: string): string | undefined {
        if (input && input.length) {
            return input;
        }
    }

    parseDate(input?: string): PartialDate {
        if (input && input.length) {
            return new PartialDate(input);
        }
    }

    parseStringList(input?: string): string[] {
        if (input && input.length) {
            return input.split(',').map(item => item.trim());
        }
    }

    parseCategory(input?: string): Category {
        if ((Object.values(Categories) as string[]).includes(input)) {
            return input as Category;
        }
        return Categories.Other;
    }

    // LINKED DATA LOOKUPS

    private matchNames(a: string, b: string): boolean {
        if (a == null || b == null) { return false; }
        const process = (name: string) => name.trim().toLowerCase();
        return process(a) === process(b);
    }

    findLocation(name: string, locations: Location[]): Location {
        if (name) {
            return locations.find(location => this.matchNames(location.name, name));
        }
    }

    findAuthor(name: string, authors: Author[]): Author {
        return authors.find(author => this.matchNames(author.name, name)) || authors[0];
    }

    findAuthorById(id: number, authors: Author[]): Author {
        return authors.find(author => author.id === id);
    }

    findByAuthor<T extends LifeEvent | Work>(authorId: number, items: T[]): T[] {
        return items.filter(item => item.authorId === authorId);
    }

    // TABLE PARSER FUNCTIONS

    parseAuthors(authorData: any[], locations: Location[]): Author[] {
        return authorData.map((item, index) => ({
            name: item.name,
            id: index,
            description: item.description,
            dateOfBirth: this.parseDate(item.date_of_birth),
            placeOfBirth: this.findLocation(item.place_of_birth, locations),
            dateOfDeath: this.parseDate(item.date_of_death),
            placeOfDeath: this.findLocation(item.place_of_death, locations),
            pictures: this.parseStringList(item.pictures),
            color: item.color
        }));
    }

    parseWorks(workData: any[], locations: Location[], authors: Author[]): Work[] {
        return workData.map(item => {
            const author = this.findAuthor(item.author_name, authors);
            return {
                author: author.name,
                authorId: author.id,
                category: this.parseCategory(item.category),
                date: this.parseDate(item.date),
                startDate: this.parseDate(item.start_date),
                endDate: this.parseDate(item.end_date),
                title: item.title,
                description: item.description,
                pictures: this.parseStringList(item.pictures),
                where: this.findLocation(item.where, locations),
                type: 'work'
            };
        });
    }

    parseLegacies(legacyData: any[], locations: Location[], authors: Author[]): Legacy[] {
        return legacyData.map(item => {
            const aboutAuthors = this.parseStringList(item.about).map(name => this.findAuthor(name, authors));
            return {
                authorNames: this.parseStringList(item.author_names),
                about: aboutAuthors.map(author => author.name),
                aboutIds: aboutAuthors.map(author => author.id),
                category: this.parseCategory(item.category),
                date: this.parseDate(item.date),
                startDate: this.parseDate(item.start_date),
                endDate: this.parseDate(item.end_date),
                pictures: this.parseStringList(item.pictures),
                where: this.findLocation(item.where, locations),
                title: item.title,
                description: item.description,
                url: this.parseOptionalString(item.url),
                type: 'legacy'
            };
        });
    }

    parseLifeEvents(lifeEventData: any[], locations: Location[], authors: Author[]): LifeEvent[] {
        return lifeEventData.map(item => {
            const author = this.findAuthor(item.author, authors);
            return {
                author: author.name,
                authorId: author.id,
                category: this.parseCategory(item.category),
                date: this.parseDate(item.date),
                startDate: this.parseDate(item.start_date),
                endDate: this.parseDate(item.end_date),
                pictures: this.parseStringList(item.pictures),
                where: this.findLocation(item.where, locations),
                title: item.title,
                description: item.description,
                type: 'life event'
            };
        });
    }
}
