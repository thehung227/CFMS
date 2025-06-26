import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { GuaranteeTaskComponent } from './guaranteetask.component';
import { GuaranteeTaskEditorComponent } from './guaranteetask-editor/guaranteetask-editor.component';
import { GuaranteeTaskExplorerComponent } from './guaranteetask-explorer/guaranteetask-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { GuaranteeTaskExplorerChildComponent } from './guaranteetask-explorer/guaranteetask-explorer-child.component';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const guaranteetaskRoutes: Routes = [
    {
        path: '', component: GuaranteeTaskComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: GuaranteeTaskExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: GuaranteeTaskEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: GuaranteeTaskEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: GuaranteeTaskEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(guaranteetaskRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        GuaranteeTaskComponent,
        GuaranteeTaskEditorComponent,
        GuaranteeTaskExplorerComponent,
        GuaranteeTaskExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [GuaranteeTaskComponent]
})

export class GuaranteeTaskModule { }
