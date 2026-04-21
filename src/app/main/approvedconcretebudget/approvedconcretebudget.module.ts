import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedConcreteBudgetComponent } from './approvedconcretebudget.component';
import { ApprovedConcreteBudgetEditorComponent } from './approvedconcretebudget-editor/approvedconcretebudget-editor.component';
import { ApprovedConcreteBudgetExplorerComponent } from './approvedconcretebudget-explorer/approvedconcretebudget-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedconcretebudgetRoutes: Routes = [
    {
        path: '', component: ApprovedConcreteBudgetComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ApprovedConcreteBudgetExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ApprovedConcreteBudgetEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedConcreteBudgetEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedconcretebudgetRoutes),
        UIModule
    ],
    declarations: [
        ApprovedConcreteBudgetComponent,
        ApprovedConcreteBudgetEditorComponent,
        ApprovedConcreteBudgetExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedConcreteBudgetComponent]
})

export class ApprovedConcreteBudgetModule { }
