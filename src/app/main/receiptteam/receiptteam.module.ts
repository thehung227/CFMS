import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ReceiptTeamComponent } from './receiptteam.component';
import { ReceiptTeamEditorComponent } from './receiptteam-editor/receiptteam-editor.component';
import { ReceiptTeamExplorerComponent } from './receiptteam-explorer/receiptteam-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const receiptteamRoutes: Routes = [
    {
        path: '', component: ReceiptTeamComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ReceiptTeamExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ReceiptTeamEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ReceiptTeamEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: ReceiptTeamEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(receiptteamRoutes),
        UIModule,
        WjGridFilterModule
    ],
    declarations: [
        ReceiptTeamComponent,
        ReceiptTeamEditorComponent,
        ReceiptTeamExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ReceiptTeamComponent]
})

export class ReceiptTeamModule { }
