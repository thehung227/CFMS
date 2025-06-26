import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { CostDeductionComponent } from './costdeduction.component';
import { CostDeductionEditorComponent } from './costdeduction-editor/costdeduction-editor.component';
import { CostDeductionExplorerComponent } from './costdeduction-explorer/costdeduction-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { CostDeductionExplorerChildComponent } from './costdeduction-explorer/costdeduction-explorer-child.component';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const costdeductionRoutes: Routes = [
    {
        path: '', component: CostDeductionComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: CostDeductionExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: CostDeductionEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: CostDeductionEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: CostDeductionEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(costdeductionRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        CostDeductionComponent,
        CostDeductionEditorComponent,
        CostDeductionExplorerComponent,
        CostDeductionExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [CostDeductionComponent]
})

export class CostDeductionModule { }
