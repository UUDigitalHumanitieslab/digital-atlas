import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'da-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    constructor(private dataService: DataService) { }

    ngOnInit(): void {
        this.dataService.loadDataFile().then(data => {
            this.dataService.parseData(data);
        });
    }

}
