import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { BillInvesmentComponent } from './billinvesment.component';
import { BillInvesmentEditorComponent } from './billinvesment-editor/billinvesment-editor.component';
import { BillInvesmentExplorerComponent } from './billinvesment-explorer/billinvesment-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';

import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { BillInvesmentExplorerChildComponent } from './billinvesment-explorer/billinvesment-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const billinvesmentRoutes: Routes = [
    {
        path: '', component: BillInvesmentComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: BillInvesmentExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: BillInvesmentEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: BillInvesmentEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(billinvesmentRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        BillInvesmentComponent,
        BillInvesmentEditorComponent,
        BillInvesmentExplorerComponent,
        BillInvesmentExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [BillInvesmentComponent]
})

export class BillInvesmentModule { }
