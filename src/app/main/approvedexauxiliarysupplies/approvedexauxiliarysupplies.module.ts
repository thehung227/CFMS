import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedExAuxiliarySuppliesComponent } from './approvedexauxiliarysupplies.component';
import { ApprovedExAuxiliarySuppliesEditorComponent } from './approvedexauxiliarysupplies-editor/approvedexauxiliarysupplies-editor.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedexauxiliarysuppliesRoutes: Routes = [
    {
        path: '', component: ApprovedExAuxiliarySuppliesComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'detail', component: ApprovedExAuxiliarySuppliesEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedExAuxiliarySuppliesEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedexauxiliarysuppliesRoutes),
        UIModule
    ],
    declarations: [
        ApprovedExAuxiliarySuppliesComponent,
        ApprovedExAuxiliarySuppliesEditorComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedExAuxiliarySuppliesComponent]
})

export class ApprovedExAuxiliarySuppliesModule { }
