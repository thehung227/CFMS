import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { IncurredCcmComponent } from './incurredccm.component';
import { IncurredCcmEditorComponent } from './incurredccm-editor/incurredccm-editor.component';
import { IncurredCcmExplorerComponent } from './incurredccm-explorer/incurredccm-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { IncurredCcmExplorerChildComponent } from './incurredccm-explorer/incurredccm-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const incurredccmRoutes: Routes = [
    {
        path: '', component: IncurredCcmComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: IncurredCcmExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: IncurredCcmEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: IncurredCcmEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: IncurredCcmEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(incurredccmRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        IncurredCcmComponent,
        IncurredCcmEditorComponent,
        IncurredCcmExplorerComponent,
        IncurredCcmExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [IncurredCcmComponent]
})

export class IncurredCcmModule { }
