import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { RegContract_ViewCTComponent } from './regcontract_viewCT.component';
import { RegContract_ViewCTEditorComponent } from './regcontract_viewCT-editor/regcontract_viewCT-editor.component';
import { RegAppendix_ViewCTEditorComponent } from './regappendix_viewCT-editor/regappendix_viewCT-editor.component';
import { RegContract_ViewCTExplorerComponent } from './regcontract_viewCT-explorer/regcontract_viewCT-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { RegContract_ViewCTExplorerChildComponent } from './regcontract_viewCT-explorer/regcontract_viewCT-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const regcontract_viewCTRoutes: Routes = [
    {
        path: '', component: RegContract_ViewCTComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: RegContract_ViewCTExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detailc3', component: RegContract_ViewCTEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detailc3/:id', component: RegContract_ViewCTEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detailc3/:id/:params', component: RegContract_ViewCTEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detailc4', component: RegAppendix_ViewCTEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detailc4/:id', component: RegAppendix_ViewCTEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detailc4/:id/:params', component: RegAppendix_ViewCTEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(regcontract_viewCTRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        RegContract_ViewCTComponent,
        RegContract_ViewCTEditorComponent,
        RegAppendix_ViewCTEditorComponent,
        RegContract_ViewCTExplorerComponent,
        RegContract_ViewCTExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [RegContract_ViewCTComponent]
})

export class RegContract_ViewCTModule { }
