import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { faCheck, } from '@fortawesome/free-solid-svg-icons';
import * as _ from 'underscore';

@Component({
    selector: 'da-checkboxes',
    templateUrl: './checkboxes.component.html',
    styleUrls: ['./checkboxes.component.scss']
})
export class CheckboxesComponent implements OnChanges {
    @Input() options: any[];
    @Input() labelKey: string;
    @Input() colorKey: string;

    @Output() selection = new EventEmitter<any[]>();

    selectedIndices: { [index: number]: boolean };

    faCheck = faCheck;

    constructor() { }

    ngOnChanges(changes: SimpleChanges): void {
        this.selectedIndices = {};
        this.indices.forEach(index => this.selectedIndices[index] = true);
        this.emitSelection();
    }

    emitSelection(): void {
        const selection = this.options.filter((option, index) => this.selectedIndices[index]);
        this.selection.emit(selection);
    }

    toggleItem(index): void {
        this.selectedIndices[index]  = !this.selectedIndices[index];
        this.emitSelection();
    }

    label(index): any {
        const item = this.options[index];
        if (this.labelKey) {
            return item[this.labelKey];
        } else {
            return item;
        }
    }

    color(index): any {
        if (this.colorKey) {
            const item = this.options[index];
            return item[this.colorKey];
        } else {
            return 'no-color';
        }
    }

    get indices(): number[] {
        if (this.options) {
            return this.options.map((value, key) => key);
        }
    }
}
