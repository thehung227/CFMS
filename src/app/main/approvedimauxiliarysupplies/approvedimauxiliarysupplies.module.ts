import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedImAuxiliarySuppliesComponent } from './approvedimauxiliarysupplies.component';
import { ApprovedImAuxiliarySuppliesEditorComponent } from './approvedimauxiliarysupplies-editor/approvedimauxiliarysupplies-editor.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedimauxiliarysuppliesRoutes: Routes = [
    {
        path: '', component: ApprovedImAuxiliarySuppliesComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'detail', component: ApprovedImAuxiliarySuppliesEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedImAuxiliarySuppliesEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedimauxiliarysuppliesRoutes),
        UIModule
    ],
    declarations: [
        ApprovedImAuxiliarySuppliesComponent,
        ApprovedImAuxiliarySuppliesEditorComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedImAuxiliarySuppliesComponent]
})

export class ApprovedImAuxiliarySuppliesModule { }
