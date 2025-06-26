import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedBillPayTeamComponent } from './approvedbillpayteam.component';
import { ApprovedBillPayTeamEditorComponent } from './approvedbillpayteam-editor/approvedbillpayteam-editor.component';
import { ApprovedBillPayTeamExplorerComponent } from './approvedbillpayteam-explorer/approvedbillpayteam-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedbillpayteamRoutes: Routes = [
    {
        path: '', component: ApprovedBillPayTeamComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ApprovedBillPayTeamExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ApprovedBillPayTeamEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedBillPayTeamEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedbillpayteamRoutes),
        UIModule
    ],
    declarations: [
        ApprovedBillPayTeamComponent,
        ApprovedBillPayTeamEditorComponent,
        ApprovedBillPayTeamExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedBillPayTeamComponent]
})

export class ApprovedBillPayTeamModule { }
