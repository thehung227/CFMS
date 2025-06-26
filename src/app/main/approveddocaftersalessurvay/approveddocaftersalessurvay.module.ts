import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedDocAfterSalesSurvayComponent } from './approveddocaftersalessurvay.component';
import { ApprovedDocAfterSalesSurvayEditorComponent } from './approveddocaftersalessurvay-editor/approveddocaftersalessurvay-editor.component';
import { ApprovedDocAfterSalesSurvayExplorerComponent } from './approveddocaftersalessurvay-explorer/approveddocaftersalessurvay-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approveddocaftersalessurvayRoutes: Routes = [
    {
        path: '', component: ApprovedDocAfterSalesSurvayComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ApprovedDocAfterSalesSurvayExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ApprovedDocAfterSalesSurvayEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedDocAfterSalesSurvayEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approveddocaftersalessurvayRoutes),
        UIModule
    ],
    declarations: [
        ApprovedDocAfterSalesSurvayComponent,
        ApprovedDocAfterSalesSurvayEditorComponent,
        ApprovedDocAfterSalesSurvayExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedDocAfterSalesSurvayComponent]
})

export class ApprovedDocAfterSalesSurvayModule { }
