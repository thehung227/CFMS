import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ProposalQuarterlyComponent } from './proposalquarterly.component';
import { ProposalQuarterlyEditorComponent } from './proposalquarterly-editor/proposalquarterly-editor.component';
import { ProposalQuarterlyExplorerComponent } from './proposalquarterly-explorer/proposalquarterly-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { ProposalQuarterlyExplorerChildComponent } from './proposalquarterly-explorer/proposalquarterly-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const proposalquarterlyRoutes: Routes = [
    {
        path: '', component: ProposalQuarterlyComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ProposalQuarterlyExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ProposalQuarterlyEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ProposalQuarterlyEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: ProposalQuarterlyEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(proposalquarterlyRoutes),
        UIModule,
        WjGridModule,
        WjGridDetailModule,        
        WjGridFilterModule
    ],
    declarations: [
        ProposalQuarterlyComponent,
        ProposalQuarterlyEditorComponent,
        ProposalQuarterlyExplorerComponent,
        ProposalQuarterlyExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ProposalQuarterlyComponent]
})

export class ProposalQuarterlyModule { }
