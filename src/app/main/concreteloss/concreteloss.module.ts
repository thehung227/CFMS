import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ConcreteLossComponent } from './concreteloss.component';
import { ConcreteLossEditorComponent } from './concreteloss-editor/concreteloss-editor.component';
import { ConcreteLossExplorerComponent } from './concreteloss-explorer/concreteloss-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { ConcreteLossExplorerChildComponent } from './concreteloss-explorer/concreteloss-explorer-child.component';
import { PermissionResolve } from '../../base/resolver';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';

const concretelossRoutes: Routes = [
    {
        path: '', component: ConcreteLossComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ConcreteLossExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ConcreteLossEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ConcreteLossEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(concretelossRoutes),
        UIModule,
        WjGridFilterModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule
    ],
    declarations: [
        ConcreteLossComponent,
        ConcreteLossEditorComponent,
        ConcreteLossExplorerComponent,
        ConcreteLossExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ConcreteLossComponent]
})

export class ConcreteLossModule { }
