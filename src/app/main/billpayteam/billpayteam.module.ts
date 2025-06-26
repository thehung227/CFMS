import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { BillPayTeamComponent } from './billpayteam.component';
import { BillPayTeamEditorComponent } from './billpayteam-editor/billpayteam-editor.component';
import { BillPayTeamExplorerComponent } from './billpayteam-explorer/billpayteam-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { BillPayTeamExplorerChildComponent } from './billpayteam-explorer/billpayteam-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const billpayteamRoutes: Routes = [
    {
        path: '', component: BillPayTeamComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: BillPayTeamExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: BillPayTeamEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: BillPayTeamEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(billpayteamRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        BillPayTeamComponent,
        BillPayTeamEditorComponent,
        BillPayTeamExplorerComponent,
        BillPayTeamExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [BillPayTeamComponent]
})

export class BillPayTeamModule { }
