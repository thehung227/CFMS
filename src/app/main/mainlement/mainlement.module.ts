import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { MainlementComponent } from './mainlement.component';
import { MainlementEditorComponent } from './mainlement-editor/mainlement-editor.component';
import { MainlementExplorerComponent } from './mainlement-explorer/mainlement-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { MainlementExplorerChildComponent } from './mainlement-explorer/mainlement-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const mainlementRoutes: Routes = [
    {
        path: '', component: MainlementComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: MainlementExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: MainlementEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: MainlementEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(mainlementRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        MainlementComponent,
        MainlementEditorComponent,
        MainlementExplorerComponent,
        MainlementExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [MainlementComponent]
})

export class MainlementModule { }
