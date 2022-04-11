import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { FooterComponent } from './footer/footer.component';
import { MenuComponent } from './menu/menu.component';
import { HomeComponent } from './home/home.component';
import { MapComponent } from './map/map.component';
import { TimelineComponent } from './timeline/timeline.component';

@NgModule({
    declarations: [
        AppComponent,
        FooterComponent,
        MenuComponent,
        HomeComponent,
        MapComponent,
        TimelineComponent,
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
        })
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
