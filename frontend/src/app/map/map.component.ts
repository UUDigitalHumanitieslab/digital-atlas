import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CollectedData, Legacy, LifeEvent, Location, Work } from '../models/data';
import { colors } from '../../colors';
import * as d3 from 'd3';
import * as topojson from 'topojson';
import * as _ from 'underscore';
import { VisualService } from '../services/visual.service';

const worldPath = '/assets/data/world-atlas-110m.json';
const width = 962;
const height = 550;

@Component({
    selector: 'da-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnChanges {
    private svg: any;
    private projection: d3.GeoProjection;
    private mapReady: Promise<void>;

    @Input() data: CollectedData;
    points: any = undefined;

    @ViewChild('target')
    target: ElementRef<SVGElement>;

    selectedEvent: LifeEvent|Work|Legacy;

    constructor(private visualService: VisualService) { }

    ngOnInit(): void {
        this.mapReady = this.drawMap();
    }

    async ngOnChanges(changes: SimpleChanges): Promise<void> {
        if (this.data) {
            await this.mapReady;


            const allEvents = _.flatten([
                _.map(this.data.lifeEvents, this.locationFromEvent, this),
                _.map(this.data.works, this.locationFromEvent, this),
                _.map(this.data.legacies, this.locationFromEvent, this)
            ]);
            const eventsWithLocation = allEvents.filter(event => event.where);
            this.drawPoints(eventsWithLocation);
        }
    }

    private locationFromEvent(event: LifeEvent|Work|Legacy):
        {where: Location, color: string, event: LifeEvent|Work|Legacy} {
        return {
            where: event.where,
            color: this.visualService.getColor(event, this.data),
            event,
        };
    }

    private async drawMap(): Promise<void> {
        const world = await d3.json<any>(worldPath);

        const projection = d3.geoMercator()
            .scale(500)
            .translate([width / 2.5, height / 0.65]);

        const svg = d3.select(this.target.nativeElement)
            .attr('width', '100%')
            .attr('height', `${(height / width) * 100}vw`)
            .attr('viewBox', `0 0 ${width} ${height}`)
            ;

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
    }

    private async drawPoints(locations: { where: Location, color: string, event: LifeEvent|Work|Legacy }[]): Promise<any> {
        if (this.points) {
            this.points.remove();
        }
        this.points = this.svg.selectAll('circle')
            .data(locations)
            .enter()
            .append('circle')
            .attr('cx', (d: { where: Location }) => this.projection([d.where.long, d.where.lat])[0])
            .attr('cy', (d: { where: Location }) => this.projection([d.where.long, d.where.lat])[1])
            .attr('r', 5)
            .attr('fill', (d: { color: string }) => colors[d.color])
            .attr('stroke-width', 0)
            .on('mouseover', this.showEventCard.bind(this));
    }

    showEventCard(clickEvent, obj): void {
        this.selectedEvent = obj.event;
    }

    hideEventCard(): void {
        this.selectedEvent = undefined;
    }

}
