import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedPurchaseOtherOrderComponent } from './approvedpurchaseotherorder.component';
import { ApprovedPurchaseOtherOrderEditorComponent } from './approvedpurchaseotherorder-editor/approvedpurchaseotherorder-editor.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedpurchaseotherorderRoutes: Routes = [
    {
        path: '', component: ApprovedPurchaseOtherOrderComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'detail', component: ApprovedPurchaseOtherOrderEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedPurchaseOtherOrderEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedpurchaseotherorderRoutes),
        UIModule
    ],
    declarations: [
        ApprovedPurchaseOtherOrderComponent,
        ApprovedPurchaseOtherOrderEditorComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedPurchaseOtherOrderComponent]
})

export class ApprovedPurchaseOtherOrderModule { }
