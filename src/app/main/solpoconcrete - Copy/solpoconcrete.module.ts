import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { SolPOConcreteComponent } from './solpoconcrete.component';
import { SolPOConcreteEditorComponent } from './solpoconcrete-editor/solpoconcrete-editor.component';
import { SolPOConcreteExplorerComponent } from './solpoconcrete-explorer/solpoconcrete-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { SolPOConcreteExplorerChildComponent } from './solpoconcrete-explorer/solpoconcrete-explorer-child.component';
import { PermissionResolve } from '../../base/resolver';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';

const solpoconcreteRoutes: Routes = [
    {
        path: '', component: SolPOConcreteComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: SolPOConcreteExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: SolPOConcreteEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: SolPOConcreteEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(solpoconcreteRoutes),
        UIModule,
        WjGridFilterModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule
    ],
    declarations: [
        SolPOConcreteComponent,
        SolPOConcreteEditorComponent,
        SolPOConcreteExplorerComponent,
        SolPOConcreteExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [SolPOConcreteComponent]
})

export class SolPOConcreteModule { }
