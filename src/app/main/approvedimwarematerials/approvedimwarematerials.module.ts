import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedImWareMaterialsComponent } from './approvedimwarematerials.component';
import { ApprovedImWareMaterialsEditorComponent } from './approvedimwarematerials-editor/approvedimwarematerials-editor.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedimwarematerialsRoutes: Routes = [
    {
        path: '', component: ApprovedImWareMaterialsComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'detail', component: ApprovedImWareMaterialsEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedImWareMaterialsEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedimwarematerialsRoutes),
        UIModule
    ],
    declarations: [
        ApprovedImWareMaterialsComponent,
        ApprovedImWareMaterialsEditorComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedImWareMaterialsComponent]
})

export class ApprovedImWareMaterialsModule { }
