import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { PlanQuantityComponent } from './planquantity.component';
import { PlanQuantityEditorComponent } from './planquantity-editor/planquantity-editor.component';
import { PlanQuantityExplorerComponent } from './planquantity-explorer/planquantity-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PlanQuantityExplorerChildComponent } from './planquantity-explorer/planquantity-explorer-child.component';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const planquantityRoutes: Routes = [
    {
        path: '', component: PlanQuantityComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: PlanQuantityExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: PlanQuantityEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: PlanQuantityEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: PlanQuantityEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(planquantityRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        PlanQuantityComponent,
        PlanQuantityEditorComponent,
        PlanQuantityExplorerComponent,
        PlanQuantityExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [PlanQuantityComponent]
})

export class PlanQuantityModule { }
