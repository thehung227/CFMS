import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedPlanSignConComponent } from './approvedplansigncon.component';
import { ApprovedPlanSignConEditorComponent } from './approvedplansigncon-editor/approvedplansigncon-editor.component';
import { ApprovedPlanSignConExplorerComponent } from './approvedplansigncon-explorer/approvedplansigncon-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedplansignconRoutes: Routes = [
    {
        path: '', component: ApprovedPlanSignConComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ApprovedPlanSignConExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ApprovedPlanSignConEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedPlanSignConEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedplansignconRoutes),
        UIModule
    ],
    declarations: [
        ApprovedPlanSignConComponent,
        ApprovedPlanSignConEditorComponent,
        ApprovedPlanSignConExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedPlanSignConComponent]
})

export class ApprovedPlanSignConModule { }
