import { Component, ElementRef, HostListener, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import * as d3 from 'd3';
import * as topojson from 'topojson';
import * as _ from 'underscore';

import { faSquare } from '@fortawesome/free-solid-svg-icons';

import { CollectedData, Legacy, LifeEvent, Location, Work } from '../models/data';
import { colors } from '../../colors';
import { VisualService } from '../services/visual.service';
import { TimelineEvent } from '../models/timeline';
import { DatesService } from '../services/dates.service';

const worldPath = '/assets/data/world-atlas-110m.json';

const mapWidth = 962;
const mapHeight = 550;
const scaleExtent: [number, number] = [0.27, 3.5];
const overlapThreshold = 15;
const coords = {
    topLeft: {
        long: -160,
        lat: 80
    },

    bottomRight: {
        long: 170,
        lat: - 76
    },

    center: {
        long: 0,
        lat: 55
    }
};

type MergedEvents = {
    type: 'mixed',
    events: (LifeEvent | Work | Legacy)[]
    where: Location
};

type PointLocation = {
    where: Location,
    stackSize: number,
    color: string,
    event: LifeEvent | Work | Legacy | MergedEvents,
    indices: number[],
};


@Component({
    selector: 'da-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy, OnChanges {
    private svg: d3.Selection<SVGElement, any, any, any>;
    private projection: d3.GeoProjection;
    private zoom: d3.ZoomBehavior<Element, unknown>;
    private mapReady: Promise<void>;
    private height: number;
    private subscription: Subscription;

    faSquare = faSquare;

    icons: VisualService['icons'];
    iconList: VisualService['icons'][keyof VisualService['icons']][];

    zoomFactor = 1;

    @Input() data: CollectedData;
    points: any = undefined;

    @ViewChild('target')
    target: ElementRef<SVGElement>;

    mergedEvents: MergedEvents;
    selectedPoint: PointLocation;
    selectedEvent: LifeEvent | Work | Legacy;
    previewEventTitle?: string;

    mouseX: number;
    mouseY: number;

    // don't trigger mouseovers when automatically moving the card
    moving = false;

    allPoints: PointLocation[];
    pointLocations: PointLocation[];

    constructor(private visualService: VisualService, private datesService: DatesService) {
        this.icons = visualService.icons;
        this.iconList = Object.values(visualService.icons);

        this.subscription = new Subscription().add(
            this.visualService.getMainHeight().subscribe(height => {
                this.height = height;
                this.mapReady = this.drawMap();
            }));
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    async ngOnChanges(changes: SimpleChanges): Promise<void> {
        if (this.data) {
            await this.mapReady;

            const allEvents = _.flatten([
                _.map(this.data.lifeEvents, this.locationFromEvent, this),
                _.map(this.data.works, this.locationFromEvent, this),
                _.map(this.data.legacies, this.locationFromEvent, this)
            ]);
            const points = allEvents.filter(event => event.where);
            this.allPoints = this.setPointIndices(points);
            this.updatePoints();
        }
    }

    private locationFromEvent(event: LifeEvent | Work | Legacy): PointLocation {
        return {
            where: event.where,
            color: this.visualService.getColor(event, this.data),
            event,
            stackSize: 1,
            indices: [-1], // temprorary index, wi
        };
    }

    private setPointIndices(points: PointLocation[]): PointLocation[] {
        const sorted = _.sortBy(points,
            point => this.datesService.getStartYear(point.event as LifeEvent | Work | Legacy)
        );
        sorted.forEach((point, index) => point.indices = [index]);

        return sorted;
    }


    /** take an array of points and merge all overlapping ones */
    private collapseOverlappingPoints(points: PointLocation[]): PointLocation[] {
        const combinePoints = (existingPoints: PointLocation[], newPoint: PointLocation) => {
            const overlapIndex = _.findIndex(existingPoints, point => this.pointsOverlap(point, newPoint));
            if (overlapIndex !== -1) {
                const merged = this.mergePoints(existingPoints[overlapIndex], newPoint);
                existingPoints[overlapIndex] = merged;
                return existingPoints;
            } else {
                existingPoints.push(newPoint);
                return existingPoints;
            }
        };

        return _.reduce(points, combinePoints, []);
    }


    /** merge two points into one with a mixed event */
    private mergePoints(point1: PointLocation, point2: PointLocation): PointLocation {
        const color = point1.color === point2.color ? point1.color : 'blank';
        const event = this.mergeEvents(point1, point2);
        const stackSize = point1.stackSize + point2.stackSize;
        const indices = _.flatten([point1.indices, point2.indices]);

        return {
            where: event.where,
            stackSize,
            color,
            event,
            indices,
        };
    }

    /** create a mixed event from two points */
    private mergeEvents(point1: PointLocation, point2: PointLocation): MergedEvents {
        const events1 = (point1.event as MergedEvents).events || [point1.event as LifeEvent | Work | Legacy];
        const events2 = (point2.event as MergedEvents).events || [point2.event as LifeEvent | Work | Legacy];
        const where = this.mergeLocation(point1, point2);

        return {
            type: 'mixed',
            events: events1.concat(events2),
            where,
        };
    }

    private mergeLocation(point1: PointLocation, point2: PointLocation): Location {
        const weight1 = point1.stackSize;
        const weight2 = point2.stackSize;
        const lat = (point1.where.lat * weight1 + point2.where.lat * weight2) / (weight1 + weight2);
        const long = (point1.where.long * weight1 + point2.where.long * weight2) / (weight1 + weight2);
        const name = `${point1.where.name}; ${point2.where.name}`;

        return { name, lat, long };
    }

    /** whether two points overlap on the map */
    private pointsOverlap(point1: PointLocation, point2: PointLocation): boolean {
        // same location: always overlap
        if (point1.where.name === point2.where.name) {
            return true;
        }

        const distance = this.eventsDistance(point1, point2);
        return distance < overlapThreshold;
    }

    /** distance between points on map */
    private eventsDistance(point1: PointLocation, point2: PointLocation): number {
        const position1 = this.projection([point1.where.long, point1.where.lat]);
        const position2 = this.projection([point2.where.long, point2.where.lat]);

        const deltaX = Math.abs(position1[0] - position2[0]);
        const deltaY = Math.abs(position1[1] - position2[1]);
        const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

        const scaledDistance = distance * this.zoomFactor;
        return scaledDistance;
    }

    private async drawMap(): Promise<void> {
        const world = await d3.json<any>(worldPath);

        const projection = d3.geoMercator()
            .scale(400);

        const svg = d3.select(this.target.nativeElement)
            .attr('width', '100%')
            // warning! this reads the current height outside of this component
            .attr('height', this.height)
            .attr('viewBox', `0 0 ${mapWidth} ${mapHeight}`);

        const path = d3.geoPath()
            .projection(projection);

        const g = svg.append('g');

        g.append('g')
            .attr('class', 'boundary')
            .selectAll('boundary')
            .data(topojson.feature(world, world.objects.countries).features)
            .enter().append('path')
            .attr('name', (d: any) => d.properties.name)
            .attr('id', (d: any) => d.id)
            .attr('d', path)
            .on('click', this.hideEventCard.bind(this));

        this.svg = svg;
        this.projection = projection;

        this.setZoom();
        const [x, y] = this.projection([
            coords.center.long,
            coords.center.lat]);
        this.zoom.translateTo(this.svg, x, y);
    }

    private pointTransform(location: Location): string {
        const [x, y] = this.projection([location.long, location.lat]);
        return this.SVGTransform(x, y, this.zoomFactor);
    }

    private SVGTransform(x: number, y: number, zoomFactor: number): string {
        const scale = 0.05 * (1 / zoomFactor);
        return `translate(${x}, ${y}) scale(${scale})`;
    }

    private setZoom(): void {
        const handleZoom = (e: any) => {
            d3.select('svg g')
                .attr('transform', e.transform);

            // update points overlap and size
            this.zoomFactor = e.transform.k;

            this.updatePoints();

        };

        const topLeft = this.projection([
            coords.topLeft.long,
            coords.topLeft.lat
        ]);
        const bottomRight = this.projection([
            coords.bottomRight.long,
            coords.bottomRight.lat
        ]);

        this.zoom = d3.zoom()
            .on('zoom', handleZoom)
            .scaleExtent(scaleExtent)
            .translateExtent([topLeft, bottomRight]);

        d3.select(this.target.nativeElement)
            .call(this.zoom);
    }

    private updatePoints(): void {
        this.pointLocations = this.collapseOverlappingPoints(this.allPoints);
        this.drawPoints();
    }

    private async drawPoints(): Promise<void> {
        if (this.points) {
            this.points.remove();
        }
        this.points = this.svg.select('g').selectAll('use')
            .data(this.pointLocations)
            .enter()
            .append('use')
            .attr('href', this.pointHref.bind(this))
            .attr('x', -256)
            .attr('y', -256)
            .attr('transform', (d: PointLocation) => this.pointTransform(d.where))
            .attr('color', (d: PointLocation) => colors[d.color])
            .attr('fill', (d: PointLocation) => colors[d.color])
            .on('click', this.selectEvent.bind(this))
            .on('mouseover', this.showEventPreview.bind(this))
            .on('mouseleave', this.hideEventPreview.bind(this));
    }

    private pointHref(point: PointLocation): string {
        if (point.where.lat === this.selectedPoint?.where.lat &&
            point.where.long === this.selectedPoint?.where.long) {
            if (point.stackSize > 1) {
                return '#stack_selected_' + point.stackSize;
            } else {
                return '#selected_' + this.icons[point.event.type].iconName;
            }
        }
        else {
            if (point.stackSize > 1) {
                return '#stack_' + point.stackSize;
            } else {
                return '#' + this.icons[point.event.type].iconName;
            }
        }
    }


    async moveToPoint(event: { where?: Location }): Promise<void> {
        if (event.where) {
            this.moving = true;
            const [x, y] = this.projection([
                event.where.long,
                event.where.lat]);

            this.hideEventPreview();

            await this.svg.transition()
                .duration(750)
                .call(this.zoom.translateTo, x, y)
                .end();

            this.moving = false;
            this.hideEventPreview();
        }
    }

    openMixedEvent(obj: MergedEvents): void {
        this.mergedEvents = obj;
    }

    selectEvent(clickEvent: MouseEvent, obj: PointLocation): void {
        this.moveToPoint(obj.event);
        this.selectedPoint = obj;

        if (obj.event.type === 'mixed') {
            this.selectedEvent = undefined;
            this.openMixedEvent(obj.event);
        } else {
            this.selectedEvent = obj.event;
            this.mergedEvents = undefined
        }
    }

    hideEventCard(): void {
        this.selectedPoint = undefined;
        this.selectedEvent = undefined;
        this.mergedEvents = undefined;
    }

    showEventPreview(e: MouseEvent, obj: PointLocation): void {
        if (this.moving) {
            return;
        }

        if (obj.event.type === 'mixed') {
            this.previewEventTitle = `${obj.event.events.length} events`;
        } else {
            this.previewEventTitle = obj.event.title;
        }
    }

    @HostListener('mousemove', ['$event']) onMouseMove(event): void {
        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
    }

    hideEventPreview(): void {
        this.previewEventTitle = undefined;
    }

    jumpEvent(direction: 'previous' | 'next'): void {
        let index: number;
        if (this.selectedPoint.event.type === 'mixed') {
            const eventIndex = this.selectedPoint.event.events.findIndex(event =>
                _.isEqual(event, this.selectedEvent)
            );
            index = this.selectedPoint.indices[eventIndex];
        } else {
            index = this.selectedPoint.indices[0];
        }

        const delta = direction === 'previous' ? -1 : 1;
        const newIndex = index + delta;

        const newPoint = this.pointLocations.find(point => point.indices.includes(newIndex));
        let newEvent: LifeEvent | Work | Legacy;

        if (newPoint.event.type === 'mixed') {
            const eventIndex = newPoint.indices.findIndex(i => i === newIndex);
            newEvent = newPoint.event.events[eventIndex];
        } else {
            newEvent = newPoint.event;
        }

        this.selectEvent(null, newPoint);
        this.selectedEvent = newEvent;
    }

    get stackSizes(): number[] {
        if (this.pointLocations) {
            return _.uniq(this.pointLocations.map(point => point.stackSize));
        }
        return [];
    }
}
