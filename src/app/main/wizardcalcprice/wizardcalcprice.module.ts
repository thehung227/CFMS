import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { WizardCalcPriceComponent } from './wizardcalcprice.component';

import { AuthenService } from './../../core/services/authen.service';
import { WjChartModule, WjFlexPie } from 'wijmo/wijmo.angular2.chart';
import { WjGaugeModule } from 'wijmo/wijmo.angular2.gauge';
import { BaseService } from '../../base/base.service';
import { PanelControlService } from '../../ui/panel/PanelControlService';
import { BaseWizardService } from '../../base/base.service-wizard';
import { PermissionResolve } from '../../base/resolver';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';

const wizardcalcpriceRoutes: Routes = [
    { path: '', redirectTo: 'wizard', pathMatch: 'full' },
    { path: 'wizard', component: WizardCalcPriceComponent,resolve: { permission: PermissionResolve } },
    { path: 'wizard/:id', component: WizardCalcPriceComponent,resolve: { permission: PermissionResolve } },
    { path: 'wizard/:id/:params', component: WizardCalcPriceComponent,resolve: { permission: PermissionResolve } }
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(wizardcalcpriceRoutes),
        UIModule,WjChartModule,WjGaugeModule,WjGridFilterModule
    ],
    declarations: [
        WizardCalcPriceComponent
    ],
    providers: [
        PanelControlService,
        AuthenService,
        BaseService,
        BaseWizardService,
        PermissionResolve
    ],
    exports: [WizardCalcPriceComponent]
})

export class WizardCalcPriceModule { }