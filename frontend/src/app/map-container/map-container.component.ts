import { Component, OnInit } from '@angular/core';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'da-map-container',
    templateUrl: './map-container.component.html',
    styleUrls: ['./map-container.component.scss']
})
export class MapContainerComponent implements OnInit {
    faFilter = faFilter;

    hideFilterMenu = false;

    constructor() { }

    ngOnInit(): void {
    }

}
