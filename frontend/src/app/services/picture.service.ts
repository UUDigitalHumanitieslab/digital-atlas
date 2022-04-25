import { Injectable } from '@angular/core';
import { Author, CollectedData, Legacy, LifeEvent, Work } from '../models/data';

@Injectable({
    providedIn: 'root'
})
export class PictureService {

    constructor() { }

    /**
     * get the picture for an author or event
     */
     getPicture(subject: Author|LifeEvent|Work|Legacy, data: CollectedData): string {
        if (subject.pictures && subject.pictures.length) {
            const pictureName = subject.pictures[0];
            return this.pictureSource(pictureName, data);
        }
    }

    private pictureSource(pictureName: string, data: CollectedData): string {
        const picture = data.pictures.find(pic => pic.name === pictureName);
        if (picture) {
            return `/assets/img/${picture.filename}`;
        }
    }
}
