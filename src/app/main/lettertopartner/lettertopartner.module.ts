import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { LetterToPartnerComponent } from './lettertopartner.component';
import { LetterToPartnerEditorComponent } from './lettertopartner-editor/lettertopartner-editor.component';
import { LetterToPartnerExplorerComponent } from './lettertopartner-explorer/lettertopartner-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { LetterToPartnerExplorerChildComponent } from './lettertopartner-explorer/lettertopartner-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const lettertopartnerRoutes: Routes = [
    {
        path: '', component: LetterToPartnerComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: LetterToPartnerExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: LetterToPartnerEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: LetterToPartnerEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: LetterToPartnerEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(lettertopartnerRoutes),
        UIModule,
        WjGridModule,
        WjGridDetailModule,        
        WjGridFilterModule
    ],
    declarations: [
        LetterToPartnerComponent,
        LetterToPartnerEditorComponent,
        LetterToPartnerExplorerComponent,
        LetterToPartnerExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [LetterToPartnerComponent]
})

export class LetterToPartnerModule { }
