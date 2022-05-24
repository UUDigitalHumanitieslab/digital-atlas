import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class HighlightService {
    constructor() { }

    // TODO: use the highlight service from I-Analyzer and extract that as a library
    public queryText(text: string, query: string): { text: string, isHit: boolean }[] {
        const index = query === undefined || query === null
            ? -1
            : text.toLowerCase().indexOf(query.toLowerCase());

        if (index === -1) {
            return [{
                text,
                isHit: false
            }];
        }

        const endIndex = index + query.length;
        const start = text.substring(0, index);
        const match = text.substring(index, endIndex);
        const end = text.substring(endIndex);

        return [
            { text: start, isHit: false },
            { text: match, isHit: true },
            { text: end, isHit: false }
        ].filter((part) => part.text.length);
    }
}
