import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { EventCardSelectorComponent } from './event-card-selector.component';

describe('EventCardSelectorComponent', () => {
    let component: EventCardSelectorComponent;
    let fixture: ComponentFixture<EventCardSelectorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EventCardSelectorComponent],
            imports: [FontAwesomeModule]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EventCardSelectorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
