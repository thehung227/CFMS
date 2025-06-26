import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { BillPayMainComponent } from './billpaymain.component';
import { BillPayMainEditorComponent } from './billpaymain-editor/billpaymain-editor.component';
import { BillPayMainExplorerComponent } from './billpaymain-explorer/billpaymain-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { BillPayMainExplorerChildComponent } from './billpaymain-explorer/billpaymain-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const billpaymainRoutes: Routes = [
    {
        path: '', component: BillPayMainComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: BillPayMainExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: BillPayMainEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: BillPayMainEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: BillPayMainEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(billpaymainRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        BillPayMainComponent,
        BillPayMainEditorComponent,
        BillPayMainExplorerComponent,
        BillPayMainExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [BillPayMainComponent]
})

export class BillPayMainModule { }
