import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { BehaviorSubject } from 'rxjs';

import { MapComponent } from '../map/map.component';
import { DataService } from '../services/data.service';
import { DatesService } from '../services/dates.service';
import { TimelineComponent } from '../timeline/timeline.component';

import { IntellectualComponent } from './intellectual.component';

describe('IntellectualComponent', () => {
    let component: IntellectualComponent;
    let fixture: ComponentFixture<IntellectualComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [IntellectualComponent, TimelineComponent, MapComponent],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        params: new BehaviorSubject({ id: 1 })
                    }
                },
                DataService,
                DatesService],
            imports: [FontAwesomeModule]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(IntellectualComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
