import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedLetterToPartnerComponent } from './approvedlettertopartner.component';
import { ApprovedLetterToPartnerEditorComponent } from './approvedlettertopartner-editor/approvedlettertopartner-editor.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedlettertopartnerRoutes: Routes = [
    {
        path: '', component: ApprovedLetterToPartnerComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'detail', component: ApprovedLetterToPartnerEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedLetterToPartnerEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedlettertopartnerRoutes),
        UIModule
    ],
    declarations: [
        ApprovedLetterToPartnerComponent,
        ApprovedLetterToPartnerEditorComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedLetterToPartnerComponent]
})

export class ApprovedLetterToPartnerModule { }
