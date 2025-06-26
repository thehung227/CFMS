import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { PlanCostRevConsComponent } from './plancostrevcons.component';
import { PlanCostRevConsEditorComponent } from './plancostrevcons-editor/plancostrevcons-editor.component';
import { PlanCostRevConsExplorerComponent } from './plancostrevcons-explorer/plancostrevcons-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { PlanCostRevConsExplorerChildComponent } from './plancostrevcons-explorer/plancostrevcons-explorer-child.component';
import { PlanCostRevConsPopupComponent } from '../plancostrevcons-popup/plancostrevcons-popup.component';
import { PlanCostRevConsPopupEditorComponent } from '../plancostrevcons-popup/plancostrevcons-popup-editor/plancostrevcons-popup-editor.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const plancostrevconsRoutes: Routes = [
    {
        path: '', component: PlanCostRevConsComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: PlanCostRevConsExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: PlanCostRevConsEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: PlanCostRevConsEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: PlanCostRevConsEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(plancostrevconsRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        PlanCostRevConsComponent,
        PlanCostRevConsEditorComponent,
        PlanCostRevConsExplorerComponent,
        PlanCostRevConsExplorerChildComponent,
        PlanCostRevConsPopupComponent,
        PlanCostRevConsPopupEditorComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [PlanCostRevConsComponent]
})

export class PlanCostRevConsModule { }
