import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedDocAfterSalesComponent } from './approveddocaftersales.component';
import { ApprovedDocAfterSalesEditorComponent } from './approveddocaftersales-editor/approveddocaftersales-editor.component';
import { ApprovedDocAfterSalesExplorerComponent } from './approveddocaftersales-explorer/approveddocaftersales-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approveddocaftersalesRoutes: Routes = [
    {
        path: '', component: ApprovedDocAfterSalesComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ApprovedDocAfterSalesExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ApprovedDocAfterSalesEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedDocAfterSalesEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approveddocaftersalesRoutes),
        UIModule
    ],
    declarations: [
        ApprovedDocAfterSalesComponent,
        ApprovedDocAfterSalesEditorComponent,
        ApprovedDocAfterSalesExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedDocAfterSalesComponent]
})

export class ApprovedDocAfterSalesModule { }
