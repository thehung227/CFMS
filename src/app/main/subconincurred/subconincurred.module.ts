import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { SubconIncurredComponent } from './subconincurred.component';
import { SubconIncurredEditorComponent } from './subconincurred-editor/subconincurred-editor.component';
import { SubconIncurredExplorerComponent } from './subconincurred-explorer/subconincurred-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { SubconIncurredExplorerChildComponent } from './subconincurred-explorer/subconincurred-explorer-child.component';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const subconincurredRoutes: Routes = [
    {
        path: '', component: SubconIncurredComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: SubconIncurredExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: SubconIncurredEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: SubconIncurredEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: SubconIncurredEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(subconincurredRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        SubconIncurredComponent,
        SubconIncurredEditorComponent,
        SubconIncurredExplorerComponent,
        SubconIncurredExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [SubconIncurredComponent]
})

export class SubconIncurredModule { }
