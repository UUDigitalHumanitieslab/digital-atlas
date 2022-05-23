import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MapComponent } from '../map/map.component';

import { MapContainerComponent } from './map-container.component';

describe('MapContainerComponent', () => {
    let component: MapContainerComponent;
    let fixture: ComponentFixture<MapContainerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MapContainerComponent, MapComponent],
            imports: [FontAwesomeModule]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MapContainerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
