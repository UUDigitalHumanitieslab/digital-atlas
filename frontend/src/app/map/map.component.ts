import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CollectedData, Location } from '../models/data';
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
    locations: Location[] = [];
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

            const allEvents = _.flatten([this.data.lifeEvents, this.data.works, this.data.legacies]);
            const eventsWithLocation = allEvents.filter(event => event.where);
            this.locations = eventsWithLocation.map(event => event.where);
            this.drawPoints(this.locations);
        }
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
            .attr('fill', '#aaa')
            .attr('stroke', 'white')
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
            // .attr('class', (d: any) => {
            //     const info = countryInformation[d.id];
            //     if (!info) {
            //         return 'country unknown';
            //     } else {
            //         let type;
            //         switch (info.type) {
            //             case 'Ja':
            //                 type = 'yes';
            //                 break;
            //             case 'Nee':
            //                 type = 'no';
            //                 break;
            //             default:
            //                 type = 'partial';
            //                 break;
            //         }
            //         return `country ${type}`;
            //     }
            // })
            // .on('click', (d) => d && countryInformation[d.id] && showCountry(countryInformation[d.id], $description))
            .attr('d', path);

        this.svg = svg;
        this.projection = projection;
    }

    private async drawPoints(locations: Location[]): Promise<any> {
        if (this.points) {
            this.points.remove();
        }
        this.points = this.svg.selectAll('circle')
            .data(locations)
            .enter()
            .append('circle')
            .attr('cx', (d) => this.projection([d.long, d.lat])[0])
            .attr('cy', (d) => this.projection([d.long, d.lat])[1])
            .attr('r', 5)
            .attr('fill', 'red')
            .attr('stroke-width', 0)
        ;
    }

}
