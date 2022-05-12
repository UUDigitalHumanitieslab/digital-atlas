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
import {OverlayPanelModule} from 'primeng/overlaypanel';

import { FooterComponent } from './footer/footer.component';
import { MenuComponent } from './menu/menu.component';
import { HomeComponent } from './home/home.component';
import { MapComponent } from './map/map.component';
import { IndexComponent } from './index/index.component';
import { IntellectualComponent } from './intellectual/intellectual.component';
import { TimelineComponent } from './timeline/timeline.component';
import { MapContainerComponent } from './map-container/map-container.component';
import { EventCardComponent } from './event-card/event-card.component';
import { CheckboxesComponent } from './checkboxes/checkboxes.component';

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
        CheckboxesComponent,
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
        OverlayPanelModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
