import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { PlanStaffCostComponent } from './planstaffcost.component';
import { PlanStaffCostEditorComponent } from './planstaffcost-editor/planstaffcost-editor.component';
import { PlanStaffCostExplorerComponent } from './planstaffcost-explorer/planstaffcost-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PlanStaffCostExplorerChildComponent } from './planstaffcost-explorer/planstaffcost-explorer-child.component';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const planstaffcostRoutes: Routes = [
    {
        path: '', component: PlanStaffCostComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: PlanStaffCostExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: PlanStaffCostEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: PlanStaffCostEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: PlanStaffCostEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(planstaffcostRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        PlanStaffCostComponent,
        PlanStaffCostEditorComponent,
        PlanStaffCostExplorerComponent,
        PlanStaffCostExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [PlanStaffCostComponent]
})

export class PlanStaffCostModule { }
