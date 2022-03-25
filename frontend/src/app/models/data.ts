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

export interface Author {
    name: string;
    id: number;
    pictures?: string[];
    placeOfBirth: Location;
    dateOfBirth: Date;
    placeOfDeath?: Location;
    dateOfDeath?: Date;
    description: string;
}

export interface Work {
    author: string;
    authorId: number;
    category: Category;
    date?: Date;
    startDate?: Date;
    endDate?: Date;
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
    date?: Date;
    startDate?: Date;
    endDate?: Date;
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
    date?: Date;
    startDate?: Date;
    endDate?: Date;
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
