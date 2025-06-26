import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { GuaranteeTaskAtchComponent } from './guaranteetaskatch.component';
import { GuaranteeTaskAtchEditorComponent } from './guaranteetaskatch-editor/guaranteetaskatch-editor.component';
import { GuaranteeTaskAtchExplorerComponent } from './guaranteetaskatch-explorer/guaranteetaskatch-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { GuaranteeTaskAtchExplorerChildComponent } from './guaranteetaskatch-explorer/guaranteetaskatch-explorer-child.component';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const guaranteetaskatchRoutes: Routes = [
    {
        path: '', component: GuaranteeTaskAtchComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: GuaranteeTaskAtchExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: GuaranteeTaskAtchEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: GuaranteeTaskAtchEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: GuaranteeTaskAtchEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(guaranteetaskatchRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        GuaranteeTaskAtchComponent,
        GuaranteeTaskAtchEditorComponent,
        GuaranteeTaskAtchExplorerComponent,
        GuaranteeTaskAtchExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [GuaranteeTaskAtchComponent]
})

export class GuaranteeTaskAtchModule { }
