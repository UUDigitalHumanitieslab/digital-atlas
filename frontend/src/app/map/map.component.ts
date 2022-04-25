import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CollectedData, Legacy, LifeEvent, Location, Work } from '../models/data';
import { colors } from '../../colors';
import * as d3 from 'd3';
import * as topojson from 'topojson';
import * as _ from 'underscore';

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

    constructor() { }

    ngOnInit(): void {
        this.mapReady = this.drawMap();
    }

    async ngOnChanges(changes: SimpleChanges): Promise<void> {
        if (this.data) {
            await this.mapReady;

            const allEvents = _.flatten([
                this.data.lifeEvents.map(event => ({ where: event.where, color: this.determineColor(event) })),
                this.data.works.map(work => ({ where: work.where, color: this.determineColor(work) })),
                this.data.legacies.map(legacy => ({ where: legacy.where, color: this.determineLegacyColor(legacy) }))]);
            const eventsWithLocation = allEvents.filter(event => event.where);
            this.drawPoints(eventsWithLocation);
        }
    }

    private determineColor(event: LifeEvent | Work): string {
        const author = this.data.authors.find(candidate => candidate.id === event.authorId);
        return author.color;
    }

    private determineLegacyColor(legacy: Legacy): string {
        // TODO: about multiple??
        const author = this.data.authors.find(candidate => candidate.id === legacy.aboutIds[0]);
        return author.color;
    }

    private async drawMap(): Promise<void> {
        const world = await d3.json<any>(worldPath);

        const projection = d3.geoMercator()
            .scale(500)
            .translate([width / 2, height / 0.65]);

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
            .attr('d', path);

        this.svg = svg;
        this.projection = projection;
    }

    private async drawPoints(locations: { where: Location, color: string }[]): Promise<any> {
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
            .attr('stroke-width', 0);
    }

}
