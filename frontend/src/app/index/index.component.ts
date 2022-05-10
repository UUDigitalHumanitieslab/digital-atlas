import { Component, OnInit } from '@angular/core';
import * as _ from 'underscore';
import { Author, CollectedData } from '../models/data';
import { DataService } from '../services/data.service';
import { VisualService } from '../services/visual.service';

@Component({
    selector: 'da-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
    authors: CollectedData['authors'];

    pictures: { [name: string]: string };

    constructor(private dataService: DataService, private visualService: VisualService) { }

    async ngOnInit(): Promise<void> {
        const data = await this.dataService.getData();
        this.authors = data.authors;
        this.pictures = this.getPictures(data, this.authors);
    }

    getPictures(data: CollectedData, authors: Author[]): {[name: string]: string} {
        const pictures = {};
        authors.forEach(author => {
            const picture = this.visualService.getPicture(author, data);
            pictures[author.name] = picture;
        });
        return pictures;
    }
}
