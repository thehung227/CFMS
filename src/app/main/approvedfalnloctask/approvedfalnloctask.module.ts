import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedFalnLocTaskComponent } from './approvedfalnloctask.component';
import { ApprovedFalnLocTaskEditorComponent } from './approvedfalnloctask-editor/approvedfalnloctask-editor.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedfalnloctaskRoutes: Routes = [
    {
        path: '', component: ApprovedFalnLocTaskComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'detail', component: ApprovedFalnLocTaskEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedFalnLocTaskEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedfalnloctaskRoutes),
        UIModule
    ],
    declarations: [
        ApprovedFalnLocTaskComponent,
        ApprovedFalnLocTaskEditorComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedFalnLocTaskComponent]
})

export class ApprovedFalnLocTaskModule { }
