import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { BillEwiComponent } from './billewi.component';
import { BillEwiEditorComponent } from './billewi-editor/billewi-editor.component';
import { BillEwiExplorerComponent } from './billewi-explorer/billewi-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { BillEwiExplorerChildComponent } from './billewi-explorer/billewi-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const billewiRoutes: Routes = [
    {
        path: '', component: BillEwiComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: BillEwiExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: BillEwiEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: BillEwiEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(billewiRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        BillEwiComponent,
        BillEwiEditorComponent,
        BillEwiExplorerComponent,
        BillEwiExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [BillEwiComponent]
})

export class BillEwiModule { }
