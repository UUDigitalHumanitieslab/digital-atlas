import { Component, OnInit } from '@angular/core';
import * as _ from 'underscore';
import { CollectedData } from '../models/data';
import { DataService } from '../services/data.service';

@Component({
    selector: 'da-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
    authors: CollectedData['authors'];

    pictures: {[name: string]: string}

    constructor(private dataService: DataService) { }

    async ngOnInit(): Promise<void> {
        const data = await this.dataService.getData();
        this.authors = data.authors;
        this.pictures = this.getPictures(data, this.authors);
    }

    getPictures(data, authors): {[name: string]: string} {
        const pictures = {};
        authors.forEach(author => {
            const picture = this.dataService.getPicture(data, author);
            pictures[author.name] = picture;
        });
        return pictures;
    }
}
