import { Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Author, CollectedData, Legacy, LifeEvent, Work } from '../models/data';
import { DataService } from '../services/data.service';
import * as _ from 'underscore';
import { DatesService } from '../services/dates.service';
import { EventType, TimelineEvent, TimelineTile } from '../models/timeline';
import { VisualService } from '../services/visual.service';


@Component({
    selector: 'da-timeline',
    templateUrl: './timeline.component.html',
    styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit, OnChanges {
    data: CollectedData;
    @Input() authors: Author[];
    events: TimelineEvent[];
    eventsByColumn: TimelineEvent[][];
    columns: TimelineTile[][];
    minYear: number;
    maxYear: number;
    timeRange: number[];

    @Input() narrowCardColumn: boolean;

    selectedEvent: TimelineEvent;
    selectedEventPosition: number;

    icons: VisualService['icons'];

    tickHeight = 2.5;

    previewEvent: TimelineEvent;
    mouseX: number;
    mouseY: number;

    @ViewChild('eventCard') eventCard: ElementRef;

    @Output() eventSelect = new EventEmitter<{event: LifeEvent|Work|Legacy, y: number}>();

    constructor(private dataService: DataService, private datesService: DatesService, private visualService: VisualService) {
        this.icons = this.visualService.icons;
    }

    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.authors) {
            this.dataService.getData().then(data => {
                this.data = data;
                this.processData();
            });
        }
    }

    processData(): void {
        this.events = this.filterAuthors(this.getEvents(this.data));
        this.eventsByColumn = this.splitEventsIntoColumns(this.events);
        const timeDomain = this.getTimeDomain(this.events);
        this.minYear = timeDomain[0];
        this.maxYear = timeDomain[1];
        this.timeRange = this.setTimeRange(this.minYear, this.maxYear);
        this.columns = this.eventsByColumn.map(col => this.makeTimelineColumn(col));
        this.setEventIndices();
    }

    getEvents(data: CollectedData): TimelineEvent[] {
        const lifeEvents = this.convertLifeEvents(data.lifeEvents);
        const works = this.convertWorks(data.works);
        const legacies = this.convertLegacies(data.legacies);

        return _.flatten([lifeEvents, works, legacies]);
    }

    filterAuthors(events: TimelineEvent[]): TimelineEvent[] {
        const ids = this.authors.map(author => author.id);
        return events.filter(event =>
            ids.includes(event.authorId)
        );
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
                index: -1, // temporary index, will be set when we have figured out layout
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
                index: -1,
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
                data: legacy,
                index: -1,
            }));
        });
        return _.flatten(legacyTimelineEvents);
    }

    /**
     * splits a list of events into columns, where each column
     * has no overlap in dates
     */
     private splitEventsIntoColumns(events: TimelineEvent[]): TimelineEvent[][] {
        const allRows = _.reduce(_.shuffle(events), this.addEventToColumns.bind(this), []);
        const sortedRows = allRows.map(row => _.sortBy(row, event => event.startYear));
        return _.shuffle(sortedRows);
    }

    /**
     * adds a new event to a list of columns. The event is added to an
     * existing column if this can be done without overlapping dates,
     * otherwise a new column is added.
     */
    private addEventToColumns(rows: TimelineEvent[][], event: TimelineEvent): TimelineEvent[][] {
        const rowWithSpace = _.find(_.shuffle(rows), row => !this.hasDateOverlap(event, row));
        if (rowWithSpace) {
            rowWithSpace.push(event);
        } else {
            rows.push([event]);
        }
        return rows;
    }

    private hasDateOverlap(event: TimelineEvent, row: TimelineEvent[]): boolean {
        return _.any(row, element =>
            !(event.startYear > element.endYear || event.endYear < element.startYear)
        );
    }

    getTimeDomain(events: TimelineEvent[]): [number, number] {
        const minYear = _.min(events.map(event => event.startYear));
        const maxYear = _.max(events.map(event => event.endYear));
        return [minYear, maxYear];
    }

    setTimeRange(minYear, maxYear): number[] {
        if (minYear && maxYear) {
            return _.range(this.minYear, this.maxYear + 1);
        }
        return [];
    }

    private makeTimelineColumn(columnEvents: TimelineEvent[]): TimelineTile[] {
        const tiles = _.reduce(columnEvents, this.addEventToTiles.bind(this), []);

        // add final filler cell if needed
        const prevYear = this.lastYearInTiles(tiles, this.minYear);
        if (prevYear < this.maxYear) {
            tiles.push({
                startYear: prevYear + 1,
                endYear: this.maxYear,
                span:  this.maxYear - prevYear,
            });
        }

        return tiles;
    }

    private addEventToTiles(tiles: TimelineTile[], event: TimelineEvent): TimelineTile[] {
        const prevYear = this.lastYearInTiles(tiles, this.minYear);

        if (prevYear + 1 < event.startYear) {
            tiles.push({
                startYear: prevYear + 1,
                endYear: event.startYear - 1,
                span: (event.startYear - 1) - prevYear,
            });
        }

        tiles.push({
            startYear: event.startYear,
            endYear: event.endYear,
            span: 1 + event.endYear - event.startYear,
            event
        });

        return tiles;
    }

    private lastYearInTiles(tiles: TimelineTile[], minYear: number): number {
        return tiles.length ? _.last(tiles).endYear : minYear - 1;
    }

    private setEventIndices(): void {
        let index = 0;
        _.range(this.minYear, this.maxYear).forEach(year =>
            this.columns.forEach(column => {
                const tile = column.find(t =>
                    t.event && (t.startYear === year || (year === this.minYear && t.startYear === undefined))
                );
                if (tile) {
                    tile.event.index = index;
                    index += 1;
                }
            })
        );
    }

    showYear(year: number): boolean {
        return year % 5 === 0;
    }

    getIcon(event: TimelineEvent): any {
        return this.icons[event.type];
    }

    getHeight(tile: TimelineTile): number {
        if (tile.span) {
            return this.tickHeight * tile.span;
        } else {
            return this.tickHeight * (1 + this.maxYear - this.minYear);
        }
    }

    getPosition(event: TimelineEvent): number {
        return (event.startYear - this.minYear) * this.tickHeight || 0;
    }

    getColor(event: TimelineEvent): string {
        return this.visualService.getColor(event.data, this.data);
    }

    selectEvent(event: TimelineEvent): void {
        this.selectedEvent = event;
        this.selectedEventPosition = this.getPosition(event);
    }

    showEventPreview(timelineEvent: TimelineEvent): void {
        this.previewEvent = timelineEvent;
    }

    @HostListener('mousemove', ['$event']) onMouseMove(event): void {
        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
    }

    hideEventPreview(): void {
        this.previewEvent = undefined;
    }

    scrollToEventCard(): void {
        const windowTop = window.scrollY;
        const windowBottom = windowTop + window.innerHeight;

        const cardTop = this.eventCard.nativeElement.offsetTop;
        const cardBottom = cardTop +  this.eventCard.nativeElement.offsetHeight;

        const cardFits = this.eventCard.nativeElement.offsetHeight <= window.innerHeight;

        if (windowTop > cardTop || (cardFits && windowBottom < cardBottom)) {
            window.scrollTo({
                behavior: 'smooth',
                top: cardTop,
            });
        }
    }

    jumpEvent(direction: 'previous'|'next'): void {
        const index = this.selectedEvent.index;
        const delta = direction === 'previous' ? - 1 : 1;
        const newIndex = index + delta;
        this.selectedEvent = this.events.find(event => event.index === newIndex);
        this.selectedEventPosition = this.getPosition(this.selectedEvent);
    }
}
