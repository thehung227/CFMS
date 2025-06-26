import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { DocAfterSalesFileComponent } from './docaftersalesfile.component';
import { DocAfterSalesFileEditorComponent } from './docaftersalesfile-editor/docaftersalesfile-editor.component';
import { DocAfterSalesFileExplorerComponent } from './docaftersalesfile-explorer/docaftersalesfile-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { DocAfterSalesFileExplorerChildComponent } from './docaftersalesfile-explorer/docaftersalesfile-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const docaftersalesfileRoutes: Routes = [
    {
        path: '', component: DocAfterSalesFileComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: DocAfterSalesFileExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: DocAfterSalesFileEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: DocAfterSalesFileEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: DocAfterSalesFileEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(docaftersalesfileRoutes),
        UIModule,
        WjGridModule,
        WjGridDetailModule,        
        WjGridFilterModule
    ],
    declarations: [
        DocAfterSalesFileComponent,
        DocAfterSalesFileEditorComponent,
        DocAfterSalesFileExplorerComponent,
        DocAfterSalesFileExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [DocAfterSalesFileComponent]
})

export class DocAfterSalesFileModule { }
