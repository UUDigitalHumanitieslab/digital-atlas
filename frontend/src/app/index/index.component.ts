import { Component, OnInit } from '@angular/core';
import { CollectedData } from '../models/data';
import { DataService } from '../services/data.service';

@Component({
    selector: 'da-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
    authors: CollectedData['authors'];

    constructor(private dataService: DataService) { }

    async ngOnInit(): Promise<void> {
        const data = await this.dataService.getData();
        this.authors = data.authors;
    }
}
