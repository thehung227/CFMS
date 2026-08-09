import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { AllocSettlementComponent } from './allocsettlement.component';
import { AllocSettlementEditorComponent } from './allocsettlement-editor/allocsettlement-editor.component';
import { AllocSettlementExplorerComponent } from './allocsettlement-explorer/allocsettlement-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';

import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { AllocSettlementExplorerChildComponent } from './allocsettlement-explorer/allocsettlement-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const allocsettlementRoutes: Routes = [
    {
        path: '', component: AllocSettlementComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: AllocSettlementExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: AllocSettlementEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: AllocSettlementEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(allocsettlementRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        AllocSettlementComponent,
        AllocSettlementEditorComponent,
        AllocSettlementExplorerComponent,
        AllocSettlementExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [AllocSettlementComponent]
})

export class AllocSettlementModule { }
