import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedJournalEntriesComponent } from './approvedjournalentries.component';
import { ApprovedJournalEntriesEditorComponent } from './approvedjournalentries-editor/approvedjournalentries-editor.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedjournalentriesRoutes: Routes = [
    {
        path: '', component: ApprovedJournalEntriesComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'detail', component: ApprovedJournalEntriesEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedJournalEntriesEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedjournalentriesRoutes),
        UIModule
    ],
    declarations: [
        ApprovedJournalEntriesComponent,
        ApprovedJournalEntriesEditorComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedJournalEntriesComponent]
})

export class ApprovedJournalEntriesModule { }
