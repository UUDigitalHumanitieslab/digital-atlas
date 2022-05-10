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
                this.day = parseInt(parts[2], 10);
            /* falls through */
            case 2:
                this.month = parseInt(parts[1], 10);
            /* falls through */
            case 1:
                this.year = parseInt(parts[0], 10);
                break;
        }
    }

    toString(): string {
        if (this.day !== undefined) {
            return `${this.monthName()} ${this.day}, ${this.year}`;
        } else if (this.month !== undefined) {
            return `${this.monthName()} ${this.year}`;
        }
        return `${this.year}`;
    }

    monthName(): string {
        return {
            1: 'January',
            2: 'February',
            3: 'March',
            4: 'April',
            5: 'May',
            6: 'June',
            7: 'July',
            8: 'August',
            9: 'September',
            10: 'October',
            11: 'November',
            12: 'December'
        }[this.month];
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
    color: string;
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
    type: 'work';
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
    type: 'legacy';
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
    type: 'life event';
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
