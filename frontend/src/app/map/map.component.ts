import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import * as d3 from 'd3';
import * as topojson from 'topojson';
import * as _ from 'underscore';
import { CollectedData, Legacy, LifeEvent, Location, Work } from '../models/data';
import { colors } from '../../colors';
import { VisualService } from '../services/visual.service';

const worldPath = '/assets/data/world-atlas-110m.json';

const circleRadius = 5;
const mapWidth = 962;
const mapHeight = 550;
const scaleExtent: [number, number] = [0.27, 3.5];
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

type PointLocation = {
    where: Location,
    color: string,
    event: LifeEvent | Work | Legacy
};


@Component({
    selector: 'da-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy, OnChanges {
    private svg: any;
    private projection: d3.GeoProjection;
    private zoom: d3.ZoomBehavior<Element, unknown>;
    private mapReady: Promise<void>;
    private height: number;
    private subscription: Subscription;

    zoomFactor = 1;

    @Input() data: CollectedData;
    points: any = undefined;

    @ViewChild('target')
    target: ElementRef<SVGElement>;

    selectedEvent: LifeEvent | Work | Legacy;
    pointLocations: PointLocation[];

    constructor(private visualService: VisualService) {
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
            this.pointLocations = allEvents.filter(event => event.where);

            this.pointLocations.forEach(event1 =>
                this.pointLocations.forEach(event2 => {
                    if (event1 !== event2) {
                        const overlap = this.eventsOverlap(event1, event2);
                        if (overlap) {
                            console.log(event1.event.where.name, event2.event.where.name, overlap);
                        }
                    }

                })
            );

            this.drawPoints();
        }
    }

    private locationFromEvent(event: LifeEvent|Work|Legacy): PointLocation {
        return {
            where: event.where,
            color: this.visualService.getColor(event, this.data),
            event,
        };
    }

    /** whether two points overlap on the map */
    private eventsOverlap(event1: PointLocation, event2: PointLocation): boolean {
        // same location: always overlap
        if (event1.where.name === event2.where.name) {
            return true;
        }

        const position1 = this.projection([event1.where.long, event1.where.lat]);
        const position2 = this.projection([event2.where.long, event2.where.lat]);

        const deltaX = Math.abs(position1[0] - position2[0]);
        const deltaY = Math.abs(position1[1] - position2[1]);
        const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

        console.log(event1.where.name, event2.where.name, distance);


        return false;
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

    private setZoom(): void {
        const self = this;
        function handleZoom(e: any): void {
            d3.select('svg g')
                .attr('transform', e.transform);

            // update size of points
            self.zoomFactor = e.transform.k;
            d3.select('svg g').selectAll('circle')
                .attr('r', circleRadius / self.zoomFactor);
        }

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

    private async drawPoints(): Promise<void> {
        if (this.points) {
            this.points.remove();
        }
        this.points = this.svg.select('g').selectAll('circle')
            .data(this.pointLocations)
            .enter()
            .append('circle')
            .attr('cx', (d: { where: Location }) => this.projection([d.where.long, d.where.lat])[0])
            .attr('cy', (d: { where: Location }) => this.projection([d.where.long, d.where.lat])[1])
            .attr('r', circleRadius / this.zoomFactor)
            .attr('fill', (d: { color: string }) => colors[d.color])
            .attr('stroke-width', 0)
            .on('click', this.showEventCard.bind(this));
    }

    showEventCard(clickEvent, obj: { event: MapComponent['selectedEvent'] }): void {
        this.selectedEvent = obj.event;
        const [x, y] = this.projection([
            obj.event.where.long,
            obj.event.where.lat]);

        this.svg.transition()
            .duration(750)
            .call(this.zoom.translateTo, x, y);
    }

    hideEventCard(): void {
        this.selectedEvent = undefined;
    }

}
