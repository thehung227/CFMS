import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ProposalRevenueExpenComponent } from './proposalrevenueexpen.component';
import { ProposalRevenueExpenEditorComponent } from './proposalrevenueexpen-editor/proposalrevenueexpen-editor.component';
import { ProposalRevenueExpenExplorerComponent } from './proposalrevenueexpen-explorer/proposalrevenueexpen-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { ProposalRevenueExpenExplorerChildComponent } from './proposalrevenueexpen-explorer/proposalrevenueexpen-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const proposalrevenueexpenRoutes: Routes = [
    {
        path: '', component: ProposalRevenueExpenComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ProposalRevenueExpenExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ProposalRevenueExpenEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ProposalRevenueExpenEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: ProposalRevenueExpenEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(proposalrevenueexpenRoutes),
        UIModule,
        WjGridModule,
        WjGridDetailModule,        
        WjGridFilterModule
    ],
    declarations: [
        ProposalRevenueExpenComponent,
        ProposalRevenueExpenEditorComponent,
        ProposalRevenueExpenExplorerComponent,
        ProposalRevenueExpenExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ProposalRevenueExpenComponent]
})

export class ProposalRevenueExpenModule { }
