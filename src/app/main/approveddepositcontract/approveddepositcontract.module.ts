import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedDepositContractComponent } from './approveddepositcontract.component';
import { ApprovedDepositContractEditorComponent } from './approveddepositcontract-editor/approveddepositcontract-editor.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approveddepositcontractRoutes: Routes = [
    {
        path: '', component: ApprovedDepositContractComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'detail', component: ApprovedDepositContractEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedDepositContractEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approveddepositcontractRoutes),
        UIModule
    ],
    declarations: [
        ApprovedDepositContractComponent,
        ApprovedDepositContractEditorComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedDepositContractComponent]
})

export class ApprovedDepositContractModule { }
