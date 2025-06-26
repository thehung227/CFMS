import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { TradeMarkComponent } from './trademark.component';
import { TradeMarkEditorComponent } from './trademark-editor/trademark-editor.component';
import { TradeMarkExplorerComponent } from './trademark-explorer/trademark-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const trademarkRoutes: Routes = [
    {
        path: '', component: TradeMarkComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: TradeMarkExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: TradeMarkEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: TradeMarkEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: TradeMarkEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(trademarkRoutes),
        UIModule,
        WjGridFilterModule
    ],
    declarations: [
        TradeMarkComponent,
        TradeMarkEditorComponent,
        TradeMarkExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [TradeMarkComponent]
})

export class TradeMarkModule { }
