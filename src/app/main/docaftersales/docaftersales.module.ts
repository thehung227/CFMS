import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { DocAfterSalesComponent } from './docaftersales.component';
import { DocAfterSalesEditorComponent } from './docaftersales-editor/docaftersales-editor.component';
import { DocAfterSalesExplorerComponent } from './docaftersales-explorer/docaftersales-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { DocAfterSalesExplorerChildComponent } from './docaftersales-explorer/docaftersales-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const docaftersalesRoutes: Routes = [
    {
        path: '', component: DocAfterSalesComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: DocAfterSalesExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: DocAfterSalesEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: DocAfterSalesEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: DocAfterSalesEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(docaftersalesRoutes),
        UIModule,
        WjGridModule,
        WjGridDetailModule,        
        WjGridFilterModule
    ],
    declarations: [
        DocAfterSalesComponent,
        DocAfterSalesEditorComponent,
        DocAfterSalesExplorerComponent,
        DocAfterSalesExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [DocAfterSalesComponent]
})

export class DocAfterSalesModule { }
