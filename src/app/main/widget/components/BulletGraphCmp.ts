'use strict';

import { Component} from '@angular/core';
import { ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaseCmp } from './BaseCmp';

@Component({
    selector: 'bullet-Graph-cmp',
    templateUrl: './bulletGraphCmp.html',
    styleUrls: ['./../widget.component.css']
})

export class BulletGraphCmp extends BaseCmp{

    constructor() {
        super();
    }
}