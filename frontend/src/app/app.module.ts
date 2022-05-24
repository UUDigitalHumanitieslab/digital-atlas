import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { FormsModule } from '@angular/forms';
import {CheckboxModule} from 'primeng/checkbox';
import {SliderModule} from 'primeng/slider';
import {TooltipModule } from 'primeng/tooltip';

import { FooterComponent } from './footer/footer.component';
import { MenuComponent } from './menu/menu.component';
import { HomeComponent } from './home/home.component';
import { MapComponent } from './map/map.component';
import { IndexComponent } from './index/index.component';
import { IntellectualComponent } from './intellectual/intellectual.component';
import { TimelineComponent } from './timeline/timeline.component';
import { MapContainerComponent } from './map-container/map-container.component';
import { EventCardComponent } from './event-card/event-card.component';
import { EventCardSelectorComponent } from './event-card-selector/event-card-selector.component';
import { CheckboxesComponent } from './checkboxes/checkboxes.component';
import { AboutComponent } from './about/about.component';
import { ContributorsComponent } from './about/contributors/contributors.component';
import { PinComponent } from './about/pin/pin.component';
import { CompleteTimelineComponent } from './complete-timeline/complete-timeline.component';
import { IntellectualMenuComponent } from './intellectual-menu/intellectual-menu.component';
import { FilterMenuComponent } from './filter-menu/filter-menu.component';

@NgModule({
    declarations: [
        AppComponent,
        FooterComponent,
        MenuComponent,
        HomeComponent,
        MapComponent,
        IndexComponent,
        IntellectualComponent,
        TimelineComponent,
        MapContainerComponent,
        EventCardComponent,
        EventCardSelectorComponent,
        CheckboxesComponent,
        AboutComponent,
        ContributorsComponent,
        PinComponent,
        CompleteTimelineComponent,
        IntellectualMenuComponent,
        FilterMenuComponent,
    ],
    imports: [
        AppRoutingModule,
        BrowserModule,
        BrowserAnimationsModule,
        FontAwesomeModule,
        HttpClientModule,
        HttpClientXsrfModule.withOptions({
            cookieName: 'csrftoken',
            headerName: 'X-CSRFToken'
        }),
        FormsModule,
        CheckboxModule,
        SliderModule,
        TooltipModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
