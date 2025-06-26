'use strict';

import { Component } from '@angular/core';
import { ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaseCmp } from './BaseCmp';

@Component({
    selector: 'grid-cmp',
    templateUrl: './gridCmp.html',
    styleUrls: ['./../widget.component.css']
})

export class GridCmp extends BaseCmp {
    constructor() {
        super();
    }

}
