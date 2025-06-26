import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { IncurredComponent } from './incurred.component';
import { IncurredEditorComponent } from './incurred-editor/incurred-editor.component';
import { IncurredExplorerComponent } from './incurred-explorer/incurred-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { IncurredExplorerChildComponent } from './incurred-explorer/incurred-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const incurredRoutes: Routes = [
    {
        path: '', component: IncurredComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: IncurredExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: IncurredEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: IncurredEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: IncurredEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(incurredRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        IncurredComponent,
        IncurredEditorComponent,
        IncurredExplorerComponent,
        IncurredExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [IncurredComponent]
})

export class IncurredModule { }
