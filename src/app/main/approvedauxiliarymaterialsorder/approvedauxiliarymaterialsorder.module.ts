import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedAuxiliaryMaterialsOrderComponent } from './approvedauxiliarymaterialsorder.component';
import { ApprovedAuxiliaryMaterialsOrderEditorComponent } from './approvedauxiliarymaterialsorder-editor/approvedauxiliarymaterialsorder-editor.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedauxiliarymaterialsorderRoutes: Routes = [
    {
        path: '', component: ApprovedAuxiliaryMaterialsOrderComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'detail', component: ApprovedAuxiliaryMaterialsOrderEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedAuxiliaryMaterialsOrderEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedauxiliarymaterialsorderRoutes),
        UIModule
    ],
    declarations: [
        ApprovedAuxiliaryMaterialsOrderComponent,
        ApprovedAuxiliaryMaterialsOrderEditorComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedAuxiliaryMaterialsOrderComponent]
})

export class ApprovedAuxiliaryMaterialsOrderModule { }
