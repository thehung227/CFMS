'use strict';

import { Component} from '@angular/core';
import { ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaseCmp } from './BaseCmp';

@Component({
    selector: 'blank-cmp',
    templateUrl: './blankCmp.html',
    styleUrls: ['./../widget.component.css']
})

export class BlankCmp extends BaseCmp{

    constructor() {
        super();
    }
}