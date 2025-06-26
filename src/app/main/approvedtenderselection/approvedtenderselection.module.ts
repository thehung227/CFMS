import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedTenderSelectionComponent } from './approvedtenderselection.component';
import { ApprovedTenderSelectionEditorComponent } from './approvedtenderselection-editor/approvedtenderselection-editor.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedtenderselectionRoutes: Routes = [
    {
        path: '', component: ApprovedTenderSelectionComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'detail', component: ApprovedTenderSelectionEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedTenderSelectionEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedtenderselectionRoutes),
        UIModule
    ],
    declarations: [
        ApprovedTenderSelectionComponent,
        ApprovedTenderSelectionEditorComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedTenderSelectionComponent]
})

export class ApprovedTenderSelectionModule { }
