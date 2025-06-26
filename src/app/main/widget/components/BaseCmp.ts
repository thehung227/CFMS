import * as wjcCore from 'wijmo/wijmo';


'use strict';

import { Component} from '@angular/core';
import { ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'dyna-cmp',
    templateUrl: './baseCmp.html',
    styleUrls: ['./../widget.component.css']
})
export class BaseCmp {

    dynaCom = '';
    data: wjcCore.CollectionView;
    constructor() {
        this.data = this.getData();
    }
    // some random data
    protected getData() {
        var data = [],
            today = new Date();
        for (var i = 0; i < 12; i++) {
            var sales = 100 + Math.random() * 800 + i * 50,
                expenses = 50 + Math.random() * 300 + i * 5;
            data.push({
                id: i,
                date: wjcCore.DateTime.addMonths(today, 12 - i),
                sales: sales,
                expenses: expenses,
                profit: sales - expenses
            });
        }
        return new wjcCore.CollectionView(data);
    }

}