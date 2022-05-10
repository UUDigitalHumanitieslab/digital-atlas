import { Injectable } from '@angular/core';
import { faBook, faLandmark, faUser } from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject, Observable } from 'rxjs';
import * as _ from 'underscore';
import { Author, CollectedData, Legacy, LifeEvent, Work } from '../models/data';

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

    // main-content
    private mainHeight = new BehaviorSubject(500);

    setMainHeight(value: number): void {
        this.mainHeight.next(value);
    }

    getMainHeight(): Observable<number> {
        return this.mainHeight.asObservable();
    }

    getColor(event: LifeEvent | Work | Legacy, data: CollectedData): string {
        if (_.has(event, 'authorId')) {
            const authorId = (event as { authorId: number }).authorId;
            const author = data.authors.find(candidate => candidate.id === authorId);
            return author.color;
        }
        if (_.has(event, 'aboutIds')) {
            const aboutIds = (event as { aboutIds: number[] }).aboutIds;
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
    getPicture(subject: Author | LifeEvent | Work | Legacy, data: CollectedData): string {
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
