import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedConfirmProjectCompleteComponent } from './approvedconfirmprojectcomplete.component';
import { ApprovedConfirmProjectCompleteEditorComponent } from './approvedconfirmprojectcomplete-editor/approvedconfirmprojectcomplete-editor.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedconfirmprojectcompleteRoutes: Routes = [
    {
        path: '', component: ApprovedConfirmProjectCompleteComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'detail', component: ApprovedConfirmProjectCompleteEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedConfirmProjectCompleteEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedconfirmprojectcompleteRoutes),
        UIModule
    ],
    declarations: [
        ApprovedConfirmProjectCompleteComponent,
        ApprovedConfirmProjectCompleteEditorComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedConfirmProjectCompleteComponent]
})

export class ApprovedConfirmProjectCompleteModule { }
