import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { RequestsAdvancesComponent } from './requestsadvances.component';
import { RequestsAdvancesEditorComponent } from './requestsadvances-editor/requestsadvances-editor.component';
import { RequestsAdvancesExplorerComponent } from './requestsadvances-explorer/requestsadvances-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { RequestsAdvancesExplorerChildComponent } from './requestsadvances-explorer/requestsadvances-explorer-child.component';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const requestsadvancesRoutes: Routes = [
    {
        path: '', component: RequestsAdvancesComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: RequestsAdvancesExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: RequestsAdvancesEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: RequestsAdvancesEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: RequestsAdvancesEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(requestsadvancesRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        RequestsAdvancesComponent,
        RequestsAdvancesEditorComponent,
        RequestsAdvancesExplorerComponent,
        RequestsAdvancesExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [RequestsAdvancesComponent]
})

export class RequestsAdvancesModule { }
