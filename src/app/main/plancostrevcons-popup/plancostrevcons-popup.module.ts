import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { PlanCostRevConsPopupComponent } from './plancostrevcons-popup.component';
import { PlanCostRevConsPopupEditorComponent } from './plancostrevcons-popup-editor/plancostrevcons-popup-editor.component';
import { PlanCostRevConsPopupExplorerComponent } from './plancostrevcons-popup-explorer/plancostrevcons-popup-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const plancostrevconspopupRoutes: Routes = [
    {
        path: '', component: PlanCostRevConsPopupComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: PlanCostRevConsPopupExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: PlanCostRevConsPopupEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: PlanCostRevConsPopupEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(plancostrevconspopupRoutes),
        UIModule
    ],
    declarations: [
        PlanCostRevConsPopupComponent,
        PlanCostRevConsPopupEditorComponent,
        PlanCostRevConsPopupExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [PlanCostRevConsPopupComponent]
})

export class PlanCostRevConsPopupModule { }
