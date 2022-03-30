export enum Categories {
    Publication = 'Publication',
    PersonalBiography = 'Personal/biography',
    MediaLectures = 'Media/lectures',
    Other = 'Other'
}

export type Category =
    Categories.Publication |
    Categories.PersonalBiography |
    Categories.MediaLectures |
    Categories.Other;

export interface Location {
    name: string;
    lat: number;
    long: number;
}

export class PartialDate {
    year: number;
    month?: number;
    day?: number;

    constructor(value: string) {
        const parts = value.split('-');
        switch (parts.length) {
            case 3:
                this.day = parseInt(parts[2]);
            /* falls through */
            case 2:
                this.month = parseInt(parts[1]);
            /* falls through */
            case 1:
                this.year = parseInt(parts[0]);
                break;
        }
    }
}

export interface Author {
    name: string;
    id: number;
    pictures?: string[];
    placeOfBirth: Location;
    dateOfBirth: PartialDate;
    placeOfDeath?: Location;
    dateOfDeath?: PartialDate;
    description: string;
}

export interface Work {
    author: string;
    authorId: number;
    category: Category;
    date?: PartialDate;
    startDate?: PartialDate;
    endDate?: PartialDate;
    pictures?: string[];
    where?: Location;
    title: string;
    description: string;
}

export interface Legacy {
    authorNames: string[];
    about: string[];
    aboutIds: number[];
    category: Category;
    date?: PartialDate;
    startDate?: PartialDate;
    endDate?: PartialDate;
    pictures?: string[];
    where?: Location;
    title: string;
    description: string;
    url?: string;
}

export interface LifeEvent {
    author: string;
    authorId: number;
    category: Category;
    date?: PartialDate;
    startDate?: PartialDate;
    endDate?: PartialDate;
    pictures?: string[];
    where?: Location;
    title: string;
    description: string;
}


export interface Picture {
    name: string;
    filename: string;
    author: string;
    license: string;
    url: string;
    description: string;
}

export interface CollectedData {
    locations: Location[];
    pictures: Picture[];
    authors: Author[];
    works: Work[];
    legacies: Legacy[];
    lifeEvents: LifeEvent[];
}
