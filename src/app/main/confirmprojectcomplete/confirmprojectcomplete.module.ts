import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ConfirmProjectCompleteComponent } from './confirmprojectcomplete.component';
import { ConfirmProjectCompleteEditorComponent } from './confirmprojectcomplete-editor/confirmprojectcomplete-editor.component';
import { ConfirmProjectCompleteExplorerComponent } from './confirmprojectcomplete-explorer/confirmprojectcomplete-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { ConfirmProjectCompleteExplorerChildComponent } from './confirmprojectcomplete-explorer/confirmprojectcomplete-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const confirmprojectcompleteRoutes: Routes = [
    {
        path: '', component: ConfirmProjectCompleteComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ConfirmProjectCompleteExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ConfirmProjectCompleteEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ConfirmProjectCompleteEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: ConfirmProjectCompleteEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(confirmprojectcompleteRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        ConfirmProjectCompleteComponent,
        ConfirmProjectCompleteEditorComponent,
        ConfirmProjectCompleteExplorerComponent,
        ConfirmProjectCompleteExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ConfirmProjectCompleteComponent]
})

export class ConfirmProjectCompleteModule { }
