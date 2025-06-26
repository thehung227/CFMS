'use strict';

import { Component } from '@angular/core';
import { ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaseCmp } from './BaseCmp';

@Component({
    selector: 'linear-gauge-cmp',
    templateUrl: './linearGaugeCmp.html',
    styleUrls: ['./../widget.component.css']
})

export class LinearGaugeCmp extends BaseCmp {

    constructor() {
        super();
    }

}