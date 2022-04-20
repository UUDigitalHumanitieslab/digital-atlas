import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CollectedData } from '../models/data';
import { DataService } from '../services/data.service';
import * as d3 from 'd3';
import * as topojson from 'topojson';

const worldPath = '/assets/data/world-atlas-110m.json';
const width = 962;
const height = 550;

@Component({
    selector: 'da-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
    private svg: any;
    private projection: d3.GeoProjection;

    data: CollectedData;
    locations: Location[] = [];
    points: any = undefined;

    @ViewChild('target')
    target: ElementRef<SVGElement>;

    constructor(private dataService: DataService) { }

    async ngOnInit(): Promise<void> {
        this.dataService.getData().then(data => this.data = data);
        await this.drawMap();
    }

    private async drawMap(): Promise<void> {
        const world = await d3.json<any>(worldPath);

        const projection = d3.geoMercator()
            .scale(150)
            .translate([width / 2, height / 1.5]);

        const svg = d3.select(this.target.nativeElement)
            .attr('width', '100%')
            .attr('height', `${(height / width) * 100}vw`)
            .attr('viewBox', `0 0 ${width} ${height}`);

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
            .attr('r', 2)
            .attr('fill', 'red');
    }

    handleLocation(location: Location): void {
        const index = this.locations.indexOf(location);
        if (index >= 0) {
            this.locations.splice(index, 1);
        } else {
            this.locations.push(location);
        }

        this.drawPoints(this.locations);
    }
}
