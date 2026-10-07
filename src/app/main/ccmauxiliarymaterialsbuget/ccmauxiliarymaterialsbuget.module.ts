import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { CcmAuxiliaryMaterialsBugetComponent } from './ccmauxiliarymaterialsbuget.component';
import { CcmAuxiliaryMaterialsBugetEditorComponent } from './ccmauxiliarymaterialsbuget-editor/ccmauxiliarymaterialsbuget-editor.component';
import { CcmAuxiliaryMaterialsBugetExplorerComponent } from './ccmauxiliarymaterialsbuget-explorer/ccmauxiliarymaterialsbuget-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { CcmAuxiliaryMaterialsBugetExplorerChildComponent } from './ccmauxiliarymaterialsbuget-explorer/ccmauxiliarymaterialsbuget-explorer-child.component';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const ccmauxiliarymaterialsbugetRoutes: Routes = [
    {
        path: '', component: CcmAuxiliaryMaterialsBugetComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: CcmAuxiliaryMaterialsBugetExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: CcmAuxiliaryMaterialsBugetEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: CcmAuxiliaryMaterialsBugetEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: CcmAuxiliaryMaterialsBugetEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(ccmauxiliarymaterialsbugetRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        CcmAuxiliaryMaterialsBugetComponent,
        CcmAuxiliaryMaterialsBugetEditorComponent,
        CcmAuxiliaryMaterialsBugetExplorerComponent,
        CcmAuxiliaryMaterialsBugetExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [CcmAuxiliaryMaterialsBugetComponent]
})

export class CcmAuxiliaryMaterialsBugetModule { }
