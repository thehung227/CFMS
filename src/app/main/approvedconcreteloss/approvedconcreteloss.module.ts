import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedConcreteLossComponent } from './approvedconcreteloss.component';
import { ApprovedConcreteLossEditorComponent } from './approvedconcreteloss-editor/approvedconcreteloss-editor.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedconcretelossRoutes: Routes = [
    {
        path: '', component: ApprovedConcreteLossComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'detail', component: ApprovedConcreteLossEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedConcreteLossEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedconcretelossRoutes),
        UIModule
    ],
    declarations: [
        ApprovedConcreteLossComponent,
        ApprovedConcreteLossEditorComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedConcreteLossComponent]
})

export class ApprovedConcreteLossModule { }
