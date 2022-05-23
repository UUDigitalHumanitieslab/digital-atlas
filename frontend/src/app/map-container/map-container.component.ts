import { Component, OnInit, ViewChild } from '@angular/core';
import { faArrowLeft, faArrowRight, faEye, faEyeSlash, faFilter } from '@fortawesome/free-solid-svg-icons';
import * as _ from 'underscore';
import { MapComponent } from '../map/map.component';
import { Author, CollectedData, Legacy, LifeEvent, Work } from '../models/data';
import { DataService } from '../services/data.service';
import { DatesService } from '../services/dates.service';
import { VisualService } from '../services/visual.service';

@Component({
    selector: 'da-map-container',
    templateUrl: './map-container.component.html',
    styleUrls: ['./map-container.component.scss']
})
export class MapContainerComponent implements OnInit {
    faArrowLeft = faArrowLeft;
    faArrowRight = faArrowRight;
    faFilter = faFilter;

    hideFilterMenu = true;

    data: CollectedData;
    filteredData: CollectedData;

    categories = ['Life', 'Work', 'Legacy'];
    minYear: number;
    maxYear: number;

    authorSelections: { [index: number]: boolean };

    selectedCategories: string[] = [];
    selectedAuthors: Author[] = [];
    selectedDateRange: number[] = [];

    showPrevButton = false;
    showNextButton = false;

    eventIcons: VisualService['icons'][keyof VisualService['icons']][];

    pictures: { [authorId: number]: string };

    @ViewChild(MapComponent)
    map!: MapComponent;

    constructor(private dataService: DataService, private datesService: DatesService, private visualService: VisualService) {
        this.eventIcons = [
            visualService.icons['life event'],
            visualService.icons.work,
            visualService.icons.legacy];
    }

    ngOnInit(): void {
        this.dataService.getData().then(data => this.onDataLoaded(data));
    }

    onDataLoaded(data: CollectedData): void {
        this.data = data;
        const dateRange = this.dateRange(this.data);
        this.minYear = dateRange[0];
        this.maxYear = dateRange[1];

        this.selectedCategories = this.categories;
        this.selectedDateRange = dateRange;
        this.updateFilteredData();
    }

    dateRange(data: CollectedData): [number, number] {
        const allEvents = _.flatten([data.lifeEvents, data.works, data.legacies]);
        const minmax: [number, number] = _.reduce(allEvents, this.minMaxDate.bind(this), [1980, 1980]);
        return minmax;
    }

    minMaxDate(range: [number, number], event: LifeEvent | Work | Legacy): [number, number] {
        const eventStart = this.datesService.getStartYear(event);
        const minYear = _.min([eventStart, range[0]]);

        const eventEnd = this.datesService.getEndYear(event);
        const maxYear = _.max([eventEnd, range[1]]);

        return [minYear, maxYear];
    }

    updateFilteredData(): void {
        if (this.data) {
            this.filteredData = this.dataService.filterData(
                this.data,
                this.selectedAuthors,
                this.selectedCategories,
                this.selectedDateRange,
            );
        }
    }

    previous(): void {
        this.map.jumpEvent('previous');
    }

    next(): void {
        this.map.jumpEvent('next');
    }
}
