import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { BuyingTaskComponent } from './buyingtask.component';
import { BuyingTaskEditorComponent } from './buyingtask-editor/buyingtask-editor.component';
import { BuyingTaskExplorerComponent } from './buyingtask-explorer/buyingtask-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { BuyingTaskExplorerChildComponent } from './buyingtask-explorer/buyingtask-explorer-child.component';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const buyingtaskRoutes: Routes = [
    {
        path: '', component: BuyingTaskComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: BuyingTaskExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: BuyingTaskEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: BuyingTaskEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: BuyingTaskEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(buyingtaskRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        BuyingTaskComponent,
        BuyingTaskEditorComponent,
        BuyingTaskExplorerComponent,
        BuyingTaskExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [BuyingTaskComponent]
})

export class BuyingTaskModule { }
