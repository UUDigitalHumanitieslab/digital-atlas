import { Component, OnInit } from '@angular/core';
import { TitleService } from '../services/title.service';

@Component({
    selector: 'da-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

    constructor(titleService: TitleService) {
        titleService.setTitle('About');
    }

    ngOnInit(): void {
    }

}
