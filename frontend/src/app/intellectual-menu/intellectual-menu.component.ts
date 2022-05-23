import { Component, OnInit, Output } from '@angular/core';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject } from 'rxjs';
import * as _ from 'underscore';
import { Author, CollectedData } from '../models/data';
import { DataService } from '../services/data.service';
import { VisualService } from '../services/visual.service';

const doubleClickTimeout = 500;

@Component({
    selector: 'da-intellectual-menu',
    templateUrl: './intellectual-menu.component.html',
    styleUrls: ['./intellectual-menu.component.scss']
})
export class IntellectualMenuComponent implements OnInit {
    private lastClick = new Date().getTime();
    private lastAuthorClick = -1;

    data: CollectedData;

    icons = {
        hide: faEyeSlash,
        show: faEye,
    };
    pictures: { [authorId: number]: string };

    authorSelections: { [index: number]: boolean } = {};
    @Output() selectedAuthors = new BehaviorSubject<Author[]>([]);

    constructor(private dataService: DataService, private visualService: VisualService) { }

    async ngOnInit(): Promise<void> {
        this.data = await this.dataService.getData();
        this.data.authors.forEach(author => this.authorSelections[author.id] = true);
        this.updateAuthorSelection();
        this.pictures = this.getPictures(this.data);

    }

    getPictures(data: CollectedData): { [authorId: number]: string } {
        const authors = data.authors;
        const authorsById = _.indexBy(authors, author => author.id);
        const picturesById = _.mapObject(authorsById, author => this.visualService.getPictureSource(author, data));
        return picturesById;
    }

    toggleAuthor(author: Author): void {
        const now = new Date().getTime();
        const exclusive = this.lastAuthorClick === author.id &&
            (now - this.lastClick) < doubleClickTimeout;

        if (exclusive) {
            const current = this.authorSelections[author.id];
            for (let id of Object.keys(this.authorSelections)) {
                this.authorSelections[id] = current;
            }
            this.authorSelections[author.id] = !current;
            this.lastAuthorClick = -1;
        } else {
            this.authorSelections[author.id] = !this.authorSelections[author.id];
            this.lastAuthorClick = author.id;
            this.lastClick = now;
        }
        this.updateAuthorSelection();
    }

    updateAuthorSelection(): void {
        const authors = this.data.authors.filter(author =>
            this.authorSelections[author.id]);
        this.selectedAuthors.next(authors);
    }

    isActive(author: Author): boolean {
        return this.selectedAuthors.value.includes(author);
    }

    tooltipMessage(author: Author): string {
        if (this.isActive(author)) {
            return `click to hide ${author.name} from the map; double click to hide all others`;
        } else {
            return `click to include ${author.name} in the map; double click to only show others`;
        }
    }
}
