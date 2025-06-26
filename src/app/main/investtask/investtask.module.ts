import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { InvestTaskComponent } from './investtask.component';
import { InvestTaskEditorComponent } from './investtask-editor/investtask-editor.component';
import { InvestTaskExplorerComponent } from './investtask-explorer/investtask-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { InvestTaskExplorerChildComponent } from './investtask-explorer/investtask-explorer-child.component';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const investtaskRoutes: Routes = [
    {
        path: '', component: InvestTaskComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: InvestTaskExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: InvestTaskEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: InvestTaskEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: InvestTaskEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(investtaskRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        InvestTaskComponent,
        InvestTaskEditorComponent,
        InvestTaskExplorerComponent,
        InvestTaskExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [InvestTaskComponent]
})

export class InvestTaskModule { }
