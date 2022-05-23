import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { VisualService } from './services/visual.service';

@Component({
    selector: 'da-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnDestroy {
    private subscription = new Subscription();
    title = 'digital-atlas';
    compactFooter = false;

    @ViewChild('main')
    main: ElementRef<HTMLElement>;

    constructor(private visualService: VisualService, router: Router) {
        this.subscription.add(router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                if (event.urlAfterRedirects?.split(/[\/#\?]/)[1] === 'map') {
                    this.compactFooter = true;
                } else {
                    this.compactFooter = false;
                }
            }
        }));
    }

    ngAfterViewInit(): void {
        this.visualService.setMainHeight(this.main.nativeElement.clientHeight);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
