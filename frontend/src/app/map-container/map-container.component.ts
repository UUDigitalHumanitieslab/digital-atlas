import { Component, OnInit } from '@angular/core';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import * as _ from 'underscore';
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
    faFilter = faFilter;

    hideFilterMenu = true;

    data: CollectedData;
    filteredData: CollectedData;

    categories = ['Life', 'Work', 'Legacy'];
    minYear: number;
    maxYear: number;

    selectedCategories: string[] = [];
    selectedAuthors: Author[] = [];
    selectedDateRange: number[] = [];

    eventIcons: VisualService['icons'][keyof VisualService['icons']][];

    constructor(private dataService: DataService, private datesService: DatesService, visualService: VisualService) {
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
        this.selectedAuthors = data.authors;
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
            const authorIds = this.selectedAuthors.map(author => author.id);

            let lifeEvents: LifeEvent[];
            if (this.selectedCategories.includes('Life')) {
                lifeEvents = this.data.lifeEvents.filter(event =>
                    authorIds.includes(event.authorId)
                    &&
                    this.datesService.eventInDateRange(event, this.selectedDateRange)
                );
            } else {
                lifeEvents = [];
            }

            let works: Work[];
            if (this.selectedCategories.includes('Work')) {
                works = this.data.works.filter(event =>
                    authorIds.includes(event.authorId)
                    &&
                    this.datesService.eventInDateRange(event, this.selectedDateRange)
                );
            } else {
                works = [];
            }

            let legacies: Legacy[];
            if (this.selectedCategories.includes('Legacy')) {
                legacies = this.data.legacies.filter(event =>
                    _.any(event.aboutIds, id => authorIds.includes(id))
                    &&
                    this.datesService.eventInDateRange(event, this.selectedDateRange)
                );
            } else {
                legacies = [];
            }

            this.filteredData = {
                authors: this.selectedAuthors,
                lifeEvents,
                works,
                legacies,
                pictures: this.data.pictures,
                locations: this.data.locations,
            };
        }
    }

}
