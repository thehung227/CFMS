import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { BillTeamComponent } from './billteam.component';
import { BillTeamEditorComponent } from './billteam-editor/billteam-editor.component';
import { BillTeamExplorerComponent } from './billteam-explorer/billteam-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const billteamRoutes: Routes = [
    {
        path: '', component: BillTeamComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: BillTeamExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: BillTeamEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: BillTeamEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: BillTeamEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(billteamRoutes),
        UIModule,
        WjGridFilterModule
    ],
    declarations: [
        BillTeamComponent,
        BillTeamEditorComponent,
        BillTeamExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [BillTeamComponent]
})

export class BillTeamModule { }
