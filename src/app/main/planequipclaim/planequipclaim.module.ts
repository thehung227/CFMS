import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { PlanEquipClaimComponent } from './planequipclaim.component';
import { PlanEquipClaimEditorComponent } from './planequipclaim-editor/planequipclaim-editor.component';
import { PlanEquipClaimExplorerComponent } from './planequipclaim-explorer/planequipclaim-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PlanEquipClaimExplorerChildComponent } from './planequipclaim-explorer/planequipclaim-explorer-child.component';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const planequipclaimRoutes: Routes = [
    {
        path: '', component: PlanEquipClaimComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: PlanEquipClaimExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: PlanEquipClaimEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: PlanEquipClaimEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: PlanEquipClaimEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(planequipclaimRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        PlanEquipClaimComponent,
        PlanEquipClaimEditorComponent,
        PlanEquipClaimExplorerComponent,
        PlanEquipClaimExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [PlanEquipClaimComponent]
})

export class PlanEquipClaimModule { }
