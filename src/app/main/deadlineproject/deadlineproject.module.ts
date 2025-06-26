import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { DeadlineProjectComponent } from './deadlineproject.component';
import { DeadlineProjectEditorComponent } from './deadlineproject-editor/deadlineproject-editor.component';
import { DeadlineProjectExplorerComponent } from './deadlineproject-explorer/deadlineproject-explorer.component';
import { DeadlineProjectPopupComponent } from '../deadlineproject-popup/deadlineproject-popup.component';
import { DeadlineProjectPopupEditorComponent } from '../deadlineproject-popup/deadlineproject-popup-editor/deadlineproject-popup-editor.component';
// import { DeadlineProject1PopupComponent } from '../deadlineproject1-popup/deadlineproject1-popup.component';
// import { DeadlineProject1PopupEditorComponent } from '../deadlineproject1-popup/deadlineproject1-popup-editor/deadlineproject1-popup-editor.component';
// import { DeadlineProject2PopupComponent } from '../deadlineproject2-popup/deadlineproject2-popup.component';
// import { DeadlineProject2PopupEditorComponent } from '../deadlineproject2-popup/deadlineproject2-popup-editor/deadlineproject2-popup-editor.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { PermissionResolve } from '../../base/resolver';
import { DeadlineProjectExplorerChildComponent } from './deadlineproject-explorer/deadlineproject-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';

const deadlineprojectRoutes: Routes = [
    {
        path: '', component: DeadlineProjectComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: DeadlineProjectExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: DeadlineProjectEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: DeadlineProjectEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: DeadlineProjectEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(deadlineprojectRoutes),
        UIModule,
        WjGridFilterModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule
    ],
    declarations: [
        DeadlineProjectComponent,
        DeadlineProjectEditorComponent,
        DeadlineProjectExplorerComponent,
        DeadlineProjectExplorerChildComponent,
        DeadlineProjectPopupComponent,
        DeadlineProjectPopupEditorComponent,
        // DeadlineProject1PopupComponent,
        // DeadlineProject1PopupEditorComponent,
        // DeadlineProject2PopupComponent,
        // DeadlineProject2PopupEditorComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [DeadlineProjectComponent]
})

export class DeadlineProjectModule { }
