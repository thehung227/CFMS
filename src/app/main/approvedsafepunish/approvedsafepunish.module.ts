import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedSafePunishComponent } from './approvedsafepunish.component';
import { ApprovedSafePunishEditorComponent } from './approvedsafepunish-editor/approvedsafepunish-editor.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedsafepunishRoutes: Routes = [
    {
        path: '', component: ApprovedSafePunishComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'detail', component: ApprovedSafePunishEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedSafePunishEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedsafepunishRoutes),
        UIModule
    ],
    declarations: [
        ApprovedSafePunishComponent,
        ApprovedSafePunishEditorComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedSafePunishComponent]
})

export class ApprovedSafePunishModule { }
