import { Component, OnInit } from '@angular/core';
import { CollectedData } from '../models/data';
import { DataService } from '../services/data.service';
import { VisualService } from '../services/visual.service';

@Component({
    selector: 'da-complete-timeline',
    templateUrl: './complete-timeline.component.html',
    styleUrls: ['./complete-timeline.component.scss']
})
export class CompleteTimelineComponent implements OnInit {
    data: CollectedData;
    icons: any;

    constructor(private dataService: DataService, private visualService: VisualService) { }

    ngOnInit(): void {
        this.dataService.getData().then(data => this.data = data);
        this.icons = this.visualService.icons;
    }

}
