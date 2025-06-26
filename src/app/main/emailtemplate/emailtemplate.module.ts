import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { EmailTemplateComponent } from './emailtemplate.component';
import { EmailTemplateEditorComponent } from './emailtemplate-editor/emailtemplate-editor.component';
import { EmailTemplateExplorerComponent } from './emailtemplate-explorer/emailtemplate-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const emailtemplateRoutes: Routes = [
    {
        path: '', component: EmailTemplateComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: EmailTemplateExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: EmailTemplateEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: EmailTemplateEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: EmailTemplateEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(emailtemplateRoutes),
        UIModule,
        WjGridFilterModule
    ],
    declarations: [
        EmailTemplateComponent,
        EmailTemplateEditorComponent,
        EmailTemplateExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [EmailTemplateComponent]
})

export class EmailTemplateModule { }
