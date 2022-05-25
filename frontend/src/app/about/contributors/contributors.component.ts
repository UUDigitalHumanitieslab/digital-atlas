import { Component, OnInit } from '@angular/core';
import { TitleService } from '../../services/title.service';

@Component({
    selector: 'da-contributors',
    templateUrl: './contributors.component.html',
    styleUrls: ['./contributors.component.scss']
})
export class ContributorsComponent implements OnInit {

    constructor(titleService: TitleService) {
        titleService.setTitle('Contributors');
    }

    ngOnInit(): void {
    }

}
