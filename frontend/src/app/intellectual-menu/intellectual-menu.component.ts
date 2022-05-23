import { Component, OnInit, Output } from '@angular/core';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject } from 'rxjs';
import * as _ from 'underscore';
import { Author, CollectedData } from '../models/data';
import { DataService } from '../services/data.service';
import { VisualService } from '../services/visual.service';

@Component({
    selector: 'da-intellectual-menu',
    templateUrl: './intellectual-menu.component.html',
    styleUrls: ['./intellectual-menu.component.scss']
})
export class IntellectualMenuComponent implements OnInit {
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
        this.authorSelections[author.id] = !this.authorSelections[author.id];
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
            return `click to hide ${author.name} from the map`;
        } else {
            return `click to include ${author.name} in the map`;
        }
    }
}
