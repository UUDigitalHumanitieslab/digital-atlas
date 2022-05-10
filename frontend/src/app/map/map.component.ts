import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import * as d3 from 'd3';
import * as topojson from 'topojson';
import * as _ from 'underscore';

import { faSquare } from '@fortawesome/free-solid-svg-icons';

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

    faSquare = faSquare;

    icons: VisualService['icons'];
    iconList: VisualService['icons'][keyof VisualService['icons']][];

    zoomFactor = 1;

    @Input() data: CollectedData;
    points: any = undefined;

    @ViewChild('target')
    target: ElementRef<SVGElement>;

    selectedEvent: LifeEvent | Work | Legacy;
    pointLocations: PointLocation[];

    constructor(private visualService: VisualService) {
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
            this.pointLocations = allEvents.filter(event => event.where);
            this.drawPoints();
        }
    }

    private locationFromEvent(event: LifeEvent | Work | Legacy): PointLocation {
        return {
            where: event.where,
            color: this.visualService.getColor(event, this.data),
            event,
        };
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
        const scale = 0.05 * (1 / this.zoomFactor);
        return `translate(${x}, ${y}) scale(${scale})`;
    }

    private setZoom(): void {
        const handleZoom = (e: any) => {
            d3.select('svg g')
                .attr('transform', e.transform);

            // update size of points
            this.zoomFactor = e.transform.k;
            d3.select('svg g').selectAll('use')
                .attr('transform', (d: PointLocation) => this.pointTransform(d.where));
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

    private async drawPoints(): Promise<void> {
        if (this.points) {
            this.points.remove();
        }
        this.points = this.svg.select('g').selectAll('use')
            .data(this.pointLocations)
            .enter()
            .append('use')
            .attr('href', (d: PointLocation) => '#' + this.icons[d.event.type].iconName)
            .attr('x', -256)
            .attr('y', -256)
            .attr('transform', (d: PointLocation) => this.pointTransform(d.where))
            .attr('color', (d: PointLocation) => colors[d.color])
            .on('mouseover', this.showEventCard.bind(this))
            .on('click', this.moveToPoint.bind(this));
    }

    moveToPoint(event: Event, obj: PointLocation): void {
        const [x, y] = this.projection([
            obj.event.where.long,
            obj.event.where.lat]);

        this.svg.transition()
            .duration(750)
            .call(this.zoom.translateTo, x, y);
    }

    showEventCard(event: Event, obj: PointLocation): void {
        this.selectedEvent = obj.event;
    }

    hideEventCard(): void {
        this.selectedEvent = undefined;
    }

}
