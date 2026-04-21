import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ImSolPoConcreteComponent } from './imsolpoconcrete.component';
import { ImSolPoConcreteEditorComponent } from './imsolpoconcrete-editor/imsolpoconcrete-editor.component';
import { ImSolPoConcreteExplorerComponent } from './imsolpoconcrete-explorer/imsolpoconcrete-explorer.component';


import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { PermissionResolve } from '../../base/resolver';
import { ImSolPoConcreteExplorerChildComponent } from './imsolpoconcrete-explorer/imsolpoconcrete-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';

const imsolpoconcreteRoutes: Routes = [
    {
        path: '', component: ImSolPoConcreteComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ImSolPoConcreteExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ImSolPoConcreteEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ImSolPoConcreteEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: ImSolPoConcreteEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(imsolpoconcreteRoutes),
        UIModule,
        WjGridFilterModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule
    ],
    declarations: [
        ImSolPoConcreteComponent,
        ImSolPoConcreteEditorComponent,
        ImSolPoConcreteExplorerComponent,
        ImSolPoConcreteExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ImSolPoConcreteComponent]
})

export class ImSolPoConcreteModule { }
