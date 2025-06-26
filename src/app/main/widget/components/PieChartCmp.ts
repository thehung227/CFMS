'use strict';

import { Component } from '@angular/core';
import { ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as wjcCore from 'wijmo/wijmo';

import { BaseCmp } from './BaseCmp';

@Component({
    selector: 'pie-chart-cmp',
    templateUrl: './pieChartCmp.html',
    styleUrls: ['./../widget.component.css']
})

export class PieChartCmp extends BaseCmp {

    constructor() {
        super();
    }
}

