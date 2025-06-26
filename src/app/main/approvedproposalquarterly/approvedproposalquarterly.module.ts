import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedProposalQuarterlyComponent } from './approvedproposalquarterly.component';
import { ApprovedProposalQuarterlyEditorComponent } from './approvedproposalquarterly-editor/approvedproposalquarterly-editor.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedproposalquarterlyRoutes: Routes = [
    {
        path: '', component: ApprovedProposalQuarterlyComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'detail', component: ApprovedProposalQuarterlyEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedProposalQuarterlyEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedproposalquarterlyRoutes),
        UIModule
    ],
    declarations: [
        ApprovedProposalQuarterlyComponent,
        ApprovedProposalQuarterlyEditorComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedProposalQuarterlyComponent]
})

export class ApprovedProposalQuarterlyModule { }
