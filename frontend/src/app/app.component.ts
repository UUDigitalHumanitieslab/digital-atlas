import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { VisualService } from './services/visual.service';

@Component({
    selector: 'da-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
    title = 'digital-atlas';

    @ViewChild('main')
    main: ElementRef<HTMLElement>;

    constructor(private visualService: VisualService) {
    }

    ngAfterViewInit(): void {
        this.visualService.setMainHeight(this.main.nativeElement.clientHeight);
    }
}
