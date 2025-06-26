import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { PriceLibraryComponent } from './pricelibrary.component';
import { PriceLibraryEditorComponent } from './pricelibrary-editor/pricelibrary-editor.component';
import { PriceLibraryExplorerComponent } from './pricelibrary-explorer/pricelibrary-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const pricelibraryRoutes: Routes = [
    {
        path: '', component: PriceLibraryComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: PriceLibraryExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: PriceLibraryEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: PriceLibraryEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: PriceLibraryEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(pricelibraryRoutes),
        UIModule,
        WjGridFilterModule
    ],
    declarations: [
        PriceLibraryComponent,
        PriceLibraryEditorComponent,
        PriceLibraryExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [PriceLibraryComponent]
})

export class PriceLibraryModule { }
