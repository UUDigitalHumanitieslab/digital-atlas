import { Injectable } from '@angular/core';
import { faBook, faLandmark, faUser } from '@fortawesome/free-solid-svg-icons';
import * as _ from 'underscore';
import { Author, CollectedData, Legacy, LifeEvent, Picture, Work } from '../models/data';

@Injectable({
    providedIn: 'root'
})
export class VisualService {
    icons = {
        'life event': faUser,
        work: faBook,
        legacy: faLandmark
    };

    constructor() { }

    getColor(event: LifeEvent | Work| Legacy, data: CollectedData): string {
        if (_.has(event, 'authorId')) {
            const authorId = (event as {authorId: number}).authorId;
            const author = data.authors.find(candidate => candidate.id === authorId);
            return author.color;
        }
        if (_.has(event, 'aboutIds')) {
            const aboutIds = (event as {aboutIds: number[]}).aboutIds;
            if (aboutIds.length === 1) {
                const authorId = aboutIds[0];
                const author = data.authors.find(candidate => candidate.id === authorId);
                return author.color;
            }
        }

        return 'blank';
    }

    /**
     * get the picture for an author or event
     */
    getPicture(subject: Author|LifeEvent|Work|Legacy, data: CollectedData): Picture {
        if (subject.pictures && subject.pictures.length) {
            const pictureName = subject.pictures[0];
            const picture = this.pictureObject(pictureName, data);
            return picture;
        }
    }

    getPictureSource(subject: Author|LifeEvent|Work|Legacy, data: CollectedData): string {
        const picture = this.getPicture(subject, data);
        return this.pictureSource(picture);
    }

    private pictureObject(pictureName: string, data: CollectedData): Picture {
        return data.pictures.find(pic => pic.name === pictureName);
    }

    pictureSource(picture?: Picture): string {
        if (picture) {
            return `/assets/img/${picture.filename}`;
        }
    }
}
