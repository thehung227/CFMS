import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { JournalEntriesComponent } from './journalentries.component';
import { JournalEntriesEditorComponent } from './journalentries-editor/journalentries-editor.component';
import { JournalEntriesExplorerComponent } from './journalentries-explorer/journalentries-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { PermissionResolve } from '../../base/resolver';
import { JournalEntriesExplorerChildComponent } from './journalentries-explorer/journalentries-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';

const journalentriesRoutes: Routes = [
    {
        path: '', component: JournalEntriesComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: JournalEntriesExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: JournalEntriesEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: JournalEntriesEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: JournalEntriesEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(journalentriesRoutes),
        UIModule,
        WjGridFilterModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule
    ],
    declarations: [
        JournalEntriesComponent,
        JournalEntriesEditorComponent,
        JournalEntriesExplorerComponent,
        JournalEntriesExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [JournalEntriesComponent]
})

export class JournalEntriesModule { }
