import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { BillEditPayTeamComponent } from './billeditpayteam.component';
import { BillEditPayTeamEditorComponent } from './billeditpayteam-editor/billeditpayteam-editor.component';
import { BillEditPayTeamExplorerComponent } from './billeditpayteam-explorer/billeditpayteam-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { BillEditPayTeamExplorerChildComponent } from './billeditpayteam-explorer/billeditpayteam-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const billeditpayteamRoutes: Routes = [
    {
        path: '', component: BillEditPayTeamComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: BillEditPayTeamExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: BillEditPayTeamEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: BillEditPayTeamEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(billeditpayteamRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        BillEditPayTeamComponent,
        BillEditPayTeamEditorComponent,
        BillEditPayTeamExplorerComponent,
        BillEditPayTeamExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [BillEditPayTeamComponent]
})

export class BillEditPayTeamModule { }
