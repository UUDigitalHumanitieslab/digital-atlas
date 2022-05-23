import { Component, Input, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
    selector: 'da-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
    environment = environment;

    @Input()
    compact = false;

    constructor() { }

    ngOnInit(): void {
    }

}
