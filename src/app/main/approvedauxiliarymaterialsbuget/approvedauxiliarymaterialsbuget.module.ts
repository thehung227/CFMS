import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedAuxiliaryMaterialsBugetComponent } from './approvedauxiliarymaterialsbuget.component';
import { ApprovedAuxiliaryMaterialsBugetEditorComponent } from './approvedauxiliarymaterialsbuget-editor/approvedauxiliarymaterialsbuget-editor.component';
import { ApprovedAuxiliaryMaterialsBugetExplorerComponent } from './approvedauxiliarymaterialsbuget-explorer/approvedauxiliarymaterialsbuget-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedauxiliarymaterialsbugetRoutes: Routes = [
    {
        path: '', component: ApprovedAuxiliaryMaterialsBugetComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ApprovedAuxiliaryMaterialsBugetExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ApprovedAuxiliaryMaterialsBugetEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedAuxiliaryMaterialsBugetEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedauxiliarymaterialsbugetRoutes),
        UIModule
    ],
    declarations: [
        ApprovedAuxiliaryMaterialsBugetComponent,
        ApprovedAuxiliaryMaterialsBugetEditorComponent,
        ApprovedAuxiliaryMaterialsBugetExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedAuxiliaryMaterialsBugetComponent]
})

export class ApprovedAuxiliaryMaterialsBugetModule { }
