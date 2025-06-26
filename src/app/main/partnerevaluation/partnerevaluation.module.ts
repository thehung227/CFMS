import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { PartnerEvaluationComponent } from './partnerevaluation.component';
import { PartnerEvaluationEditorComponent } from './partnerevaluation-editor/partnerevaluation-editor.component';
import { PartnerEvaluationExplorerComponent } from './partnerevaluation-explorer/partnerevaluation-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { PartnerEvaluationExplorerChildComponent } from './partnerevaluation-explorer/partnerevaluation-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const partnerevaluationRoutes: Routes = [
    {
        path: '', component: PartnerEvaluationComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: PartnerEvaluationExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: PartnerEvaluationEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: PartnerEvaluationEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: PartnerEvaluationEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(partnerevaluationRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        PartnerEvaluationComponent,
        PartnerEvaluationEditorComponent,
        PartnerEvaluationExplorerComponent,
        PartnerEvaluationExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [PartnerEvaluationComponent]
})

export class PartnerEvaluationModule { }
