import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { EventCardComponent } from './event-card.component';

describe('EventCardComponent', () => {
    let component: EventCardComponent;
    let fixture: ComponentFixture<EventCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EventCardComponent],
            imports: [FontAwesomeModule]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EventCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
