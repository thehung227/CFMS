import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { TenderSelectionComponent } from './tenderselection.component';
import { TenderSelectionEditorComponent } from './tenderselection-editor/tenderselection-editor.component';
import { TenderSelectionExplorerComponent } from './tenderselection-explorer/tenderselection-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { PermissionResolve } from '../../base/resolver';
import { TenderSelectionExplorerChildComponent } from './tenderselection-explorer/tenderselection-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';

const tenderselectionRoutes: Routes = [
    {
        path: '', component: TenderSelectionComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: TenderSelectionExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: TenderSelectionEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: TenderSelectionEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: TenderSelectionEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(tenderselectionRoutes),
        UIModule,
        WjGridFilterModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule
    ],
    declarations: [
        TenderSelectionComponent,
        TenderSelectionEditorComponent,
        TenderSelectionExplorerComponent,
        TenderSelectionExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [TenderSelectionComponent]
})

export class TenderSelectionModule { }
