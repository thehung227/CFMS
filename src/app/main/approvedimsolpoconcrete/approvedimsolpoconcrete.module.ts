import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedImSolPoConcreteComponent } from './approvedimsolpoconcrete.component';
import { ApprovedImSolPoConcreteEditorComponent } from './approvedimsolpoconcrete-editor/approvedimsolpoconcrete-editor.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedimsolpoconcreteRoutes: Routes = [
    {
        path: '', component: ApprovedImSolPoConcreteComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'detail', component: ApprovedImSolPoConcreteEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedImSolPoConcreteEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedimsolpoconcreteRoutes),
        UIModule
    ],
    declarations: [
        ApprovedImSolPoConcreteComponent,
        ApprovedImSolPoConcreteEditorComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedImSolPoConcreteComponent]
})

export class ApprovedImSolPoConcreteModule { }
