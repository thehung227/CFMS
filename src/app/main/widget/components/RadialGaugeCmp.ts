'use strict';

import { Component } from '@angular/core';
import { ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaseCmp } from './BaseCmp';


@Component({
    selector: 'radial-gauge-cmp',
    templateUrl: './radialGaugeCmp.html',
    styleUrls: ['./../widget.component.css']
})

export class RadialGaugeCmp extends BaseCmp {

    constructor() {
        super();
    }
}