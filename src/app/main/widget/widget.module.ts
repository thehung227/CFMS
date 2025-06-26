import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { WidgetComponent } from './widget.component';

import { DynamicCompService } from './widget.service';
import { InputControlService } from './../../ui/input/InputControlService';
import { AuthenService } from './../../core/services/authen.service';
import { BarChartCmp } from './components/BarChartCmp';
import { GridCmp } from './components/GridCmp';
import { RadialGaugeCmp } from './components/RadialGaugeCmp';
import { LinearGaugeCmp } from './components/LinearGaugeCmp';
import { ColumnChartCmp } from './components/ColumnChartCmp';
import { LineChartCmp } from './components/LineChartCmp';
import { BubbleChartCmp } from './components/BubbleChartCmp';
import { BulletGraphCmp } from './components/BulletGraphCmp';
import { BlankCmp } from './components/BlankCmp';
import { WjChartModule, WjFlexPie } from 'wijmo/wijmo.angular2.chart';
import { WjGaugeModule } from 'wijmo/wijmo.angular2.gauge';
import { PieChartCmp } from './components/PieChartCmp';

const widgetRoutes: Routes = [
    { path: '', redirectTo: 'view', pathMatch: 'full' },
    { path: 'view', component: WidgetComponent },
    { path: 'view/:id', component: WidgetComponent }
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(widgetRoutes),
        UIModule,WjChartModule,WjGaugeModule
    ],
    declarations: [
        WidgetComponent, BarChartCmp, GridCmp, RadialGaugeCmp, LinearGaugeCmp, ColumnChartCmp, LineChartCmp, BubbleChartCmp, BulletGraphCmp, BlankCmp,PieChartCmp],
    entryComponents: [BarChartCmp, GridCmp, RadialGaugeCmp, LinearGaugeCmp, ColumnChartCmp, LineChartCmp, BubbleChartCmp, BulletGraphCmp, BlankCmp,PieChartCmp],
    providers: [
        DynamicCompService,
        InputControlService,
        AuthenService
    ],
    exports: [WidgetComponent]
})

export class WidgetModule { }