import { Component, OnInit } from '@angular/core';
import { CollectedData } from '../models/data';
import { DataService } from '../services/data.service';

@Component({
    selector: 'da-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
    data: CollectedData;

    constructor(private dataService: DataService) { }

    ngOnInit(): void {
        this.dataService.getData().then(data => this.data = data);
    }

}
