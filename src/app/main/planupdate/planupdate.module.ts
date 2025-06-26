import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { PlanUpdateComponent } from './planupdate.component';
import { PlanUpdateEditorComponent } from './planupdate-editor/planupdate-editor.component';
import { PlanUpdateExplorerComponent } from './planupdate-explorer/planupdate-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { PlanUpdateExplorerChildComponent } from './planupdate-explorer/planupdate-explorer-child.component';
// import { PlanUpdatePopupComponent } from '../planupdate-popup/planupdate-popup.component';
// import { PlanUpdatePopupEditorComponent } from '../planupdate-popup/planupdate-popup-editor/planupdate-popup-editor.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const planupdateRoutes: Routes = [
    {
        path: '', component: PlanUpdateComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: PlanUpdateExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: PlanUpdateEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: PlanUpdateEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: PlanUpdateEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(planupdateRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        PlanUpdateComponent,
        PlanUpdateEditorComponent,
        PlanUpdateExplorerComponent,
        PlanUpdateExplorerChildComponent,
        // PlanUpdatePopupComponent,
        // PlanUpdatePopupEditorComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [PlanUpdateComponent]
})

export class PlanUpdateModule { }
