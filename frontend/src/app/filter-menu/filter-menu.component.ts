import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { VisualService } from '../services/visual.service';

@Component({
    selector: 'da-filter-menu',
    templateUrl: './filter-menu.component.html',
    styleUrls: ['./filter-menu.component.scss']
})
export class FilterMenuComponent implements OnChanges {
    faArrowLeft = faArrowLeft;
    faArrowRight = faArrowRight;

    categories = ['Life', 'Work', 'Legacy'];
    eventIcons: VisualService['icons'][keyof VisualService['icons']][];

    @Input() dateRange: [number, number];
    minYear: number;
    maxYear: number;

    selectedCategories: string[] = [];
    selectedDateRange: [number, number];

    @Output() filter = new EventEmitter<{
        categories: string[],
        dateRange?: [number, number],
    }>();

    @Input() showPrevButton = false;
    @Input() showNextButton = false;

    @Output() jump = new EventEmitter<'previous'|'next'>();

    constructor(private visualService: VisualService) {
        this.eventIcons = [
            visualService.icons['life event'],
            visualService.icons.work,
            visualService.icons.legacy];
    }

    ngOnChanges(): void {
        if (this.dateRange) {
            [this.minYear, this.maxYear] = this.dateRange;
            this.selectedDateRange = this.dateRange;
        }
    }

    emitFilters(): void {
        this.filter.emit({
            categories: this.selectedCategories,
            dateRange: this.selectedDateRange
        });
    }

    triggerJump(direction: 'previous'|'next'): void {
        this.jump.emit(direction);
    }
}
