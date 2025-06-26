import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { PlanCostOfficePopupComponent } from './plancostoffice-popup.component';
import { PlanCostOfficePopupEditorComponent } from './plancostoffice-popup-editor/plancostoffice-popup-editor.component';
import { PlanCostOfficePopupExplorerComponent } from './plancostoffice-popup-explorer/plancostoffice-popup-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const plancostofficepopupRoutes: Routes = [
    {
        path: '', component: PlanCostOfficePopupComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: PlanCostOfficePopupExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: PlanCostOfficePopupEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: PlanCostOfficePopupEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(plancostofficepopupRoutes),
        UIModule
    ],
    declarations: [
        PlanCostOfficePopupComponent,
        PlanCostOfficePopupEditorComponent,
        PlanCostOfficePopupExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [PlanCostOfficePopupComponent]
})

export class PlanCostOfficePopupModule { }
