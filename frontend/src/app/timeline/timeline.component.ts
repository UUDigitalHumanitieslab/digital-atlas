import { Component, OnInit } from '@angular/core';
import { Author, CollectedData, Legacy, LifeEvent, Work } from '../models/data';
import { DataService } from '../services/data.service';
import * as _ from 'underscore';
import { DatesService } from '../services/dates.service';
import { EventType, TimelineEvent } from '../models/timeline';


@Component({
    selector: 'da-timeline',
    templateUrl: './timeline.component.html',
    styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {
    data: CollectedData;
    authors: Author[];
    events: TimelineEvent[];
    eventColumns: { [year: number]: TimelineEvent}[];
    minYear: number;
    maxYear: number;
    timeRange: number[];

    constructor(private dataService: DataService, private datesService: DatesService) { }

    ngOnInit(): void {
        this.dataService.getData().then(data => this.storeData(data));
    }

    storeData(data: CollectedData): void {
        this.data = data;
        this.authors = this.data.authors;
        this.events = this.getEvents(this.data);
        const eventsByColumn = this.makeEventColumns(_.shuffle(this.events));
        this.eventColumns = this.indexColumnsByYear(eventsByColumn);
        const timeDomain = this.getTimeDomain(this.events);
        this.minYear = timeDomain[0];
        this.maxYear = timeDomain[1];
        this.timeRange = this.setTimeRange(this.minYear, this.maxYear);
    }

    getEvents(data: CollectedData): TimelineEvent[] {
        const lifeEvents = this.convertLifeEvents(data.lifeEvents);
        const works = this.convertWorks(data.works);
        const legacies = this.convertLegacies(data.legacies);

        return _.flatten([lifeEvents, works, legacies]);
    }

    convertLifeEvents(lifeEvents: LifeEvent[]): TimelineEvent[] {
        return lifeEvents.map(event => (
            {
                startYear: this.datesService.getStartYear(event),
                endYear: this.datesService.getEndYear(event),
                dateString: this.datesService.formatEventDate(event),
                author: event.author,
                authorId: event.authorId,
                type: 'life event' as EventType,
                data: event,
            }
        ));
    }

    convertWorks(works: Work[]): TimelineEvent[] {
        return works.map(work => (
            {
                startYear: this.datesService.getStartYear(work),
                endYear: this.datesService.getEndYear(work),
                dateString: this.datesService.formatEventDate(work),
                author: work.author,
                authorId: work.authorId,
                type: 'work' as EventType,
                data: work,
            }
        ));
    }

    convertLegacies(legacies: Legacy[]): TimelineEvent[] {
        const legacyTimelineEvents = legacies.map(legacy => {
            // create a timeline object for every author the legacy event is about
            return legacy.aboutIds.map((id, index) => ({
                startYear: this.datesService.getStartYear(legacy),
                endYear: this.datesService.getEndYear(legacy),
                dateString: this.datesService.formatEventDate(legacy),
                author: legacy.about[index],
                authorId: id,
                type: 'legacy' as EventType,
                data: legacy
            }));
        });
        return _.flatten(legacyTimelineEvents);
    }

    /**
     * splits a list of events into columns, where each column
     * has no overlap in dates
     */
     makeEventColumns(events: TimelineEvent[]): TimelineEvent[][] {
        const allRows = _.reduce(events, this.addEventToRows.bind(this), []);
        const sortedRows = allRows.map(row => _.sortBy(row, event => event.startYear));
        return sortedRows;
    }

    /**
     * adds a new event to a list of columns. The event is added to an
     * existing column if this can be done without overlapping dates,
     * otherwise a new column is added.
     */
    addEventToRows(rows: TimelineEvent[][], event: TimelineEvent): TimelineEvent[][] {
        const rowWithSpace = _.find(_.shuffle(rows), row => !this.hasDateOverlap(event, row));
        if (rowWithSpace) {
            rowWithSpace.push(event);
        } else {
            rows.push([event]);
        }
        return rows;
    }

    hasDateOverlap(event: TimelineEvent, row: TimelineEvent[]): boolean {
        return _.any(row, element =>
            !(event.startYear > element.endYear || event.endYear < element.startYear)
        );
    }

    indexColumnsByYear(columns: TimelineEvent[][]): { [year: number]: TimelineEvent}[] {
        return _.map(columns, events =>
            _.indexBy(events, event => event.startYear)
        );
    }

    getTimeDomain(events: TimelineEvent[]): [number, number] {
        const minYear = _.min(events.map(event => event.startYear));
        const maxYear = _.max(events.map(event => event.endYear));
        return [minYear, maxYear];
    }

    setTimeRange(minYear, maxYear): number[] {
        if (minYear && maxYear) {
            return _.range(this.minYear, this.maxYear);
        }
        return [];
    }

    getRowSpan(column: { [year: number]: TimelineEvent}, year: number): number {
        const event = column[year];
        if (event) {
            return 1 + event.endYear - event.startYear;
        }
        return 1;
    }

    showYear(year: number): boolean {
        return year % 5 === 0;
    }
}
