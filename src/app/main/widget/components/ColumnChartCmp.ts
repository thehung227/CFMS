'use strict';

import { Component} from '@angular/core';
import { ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaseCmp } from './BaseCmp';

@Component({
    selector: 'column-chart-cmp',
    templateUrl: './columnChartCmp.html',
    styleUrls: ['./../widget.component.css']
})

export class ColumnChartCmp extends BaseCmp{

    constructor() {
        super();
    }
}