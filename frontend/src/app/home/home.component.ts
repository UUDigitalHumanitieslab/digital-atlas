import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'da-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    hooray: string;

    constructor() { }

    ngOnInit(): void {
    }

}
