import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedDebtCollectionComponent } from './approveddebtcollection.component';
import { ApprovedDebtCollectionEditorComponent } from './approveddebtcollection-editor/approveddebtcollection-editor.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approveddebtcollectionRoutes: Routes = [
    {
        path: '', component: ApprovedDebtCollectionComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'detail', component: ApprovedDebtCollectionEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedDebtCollectionEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approveddebtcollectionRoutes),
        UIModule
    ],
    declarations: [
        ApprovedDebtCollectionComponent,
        ApprovedDebtCollectionEditorComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedDebtCollectionComponent]
})

export class ApprovedDebtCollectionModule { }
