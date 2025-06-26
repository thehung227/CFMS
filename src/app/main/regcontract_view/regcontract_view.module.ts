import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { RegContract_ViewComponent } from './regcontract_view.component';
import { RegContract_ViewEditorComponent } from './regcontract_view-editor/regcontract_view-editor.component';
import { RegAppendix_ViewEditorComponent } from './regappendix_view-editor/regappendix_view-editor.component';
import { RegContract_ViewExplorerComponent } from './regcontract_view-explorer/regcontract_view-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { RegContract_ViewExplorerChildComponent } from './regcontract_view-explorer/regcontract_view-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const regcontract_viewRoutes: Routes = [
    {
        path: '', component: RegContract_ViewComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: RegContract_ViewExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detailc3', component: RegContract_ViewEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detailc3/:id', component: RegContract_ViewEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detailc3/:id/:params', component: RegContract_ViewEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detailc4', component: RegAppendix_ViewEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detailc4/:id', component: RegAppendix_ViewEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detailc4/:id/:params', component: RegAppendix_ViewEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(regcontract_viewRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        RegContract_ViewComponent,
        RegContract_ViewEditorComponent,
        RegAppendix_ViewEditorComponent,
        RegContract_ViewExplorerComponent,
        RegContract_ViewExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [RegContract_ViewComponent]
})

export class RegContract_ViewModule { }
