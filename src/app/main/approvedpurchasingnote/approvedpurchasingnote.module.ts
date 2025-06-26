import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedPurchasingNoteComponent } from './approvedpurchasingnote.component';
import { ApprovedPurchasingNoteEditorComponent } from './approvedpurchasingnote-editor/approvedpurchasingnote-editor.component';
import { ApprovedPurchasingNoteExplorerComponent } from './approvedpurchasingnote-explorer/approvedpurchasingnote-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedpurchasingnoteRoutes: Routes = [
    {
        path: '', component: ApprovedPurchasingNoteComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ApprovedPurchasingNoteExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ApprovedPurchasingNoteEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedPurchasingNoteEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedpurchasingnoteRoutes),
        UIModule
    ],
    declarations: [
        ApprovedPurchasingNoteComponent,
        ApprovedPurchasingNoteEditorComponent,
        ApprovedPurchasingNoteExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedPurchasingNoteComponent]
})

export class ApprovedPurchasingNoteModule { }
