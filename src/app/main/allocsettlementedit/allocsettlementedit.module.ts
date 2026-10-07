import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { AllocSettlementEditComponent } from './allocsettlementedit.component';
import { AllocSettlementEditEditorComponent } from './allocsettlementedit-editor/allocsettlementedit-editor.component';
import { AllocSettlementEditExplorerComponent } from './allocsettlementedit-explorer/allocsettlementedit-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';

import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { AllocSettlementEditExplorerChildComponent } from './allocsettlementedit-explorer/allocsettlementedit-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const allocsettlementeditRoutes: Routes = [
    {
        path: '', component: AllocSettlementEditComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: AllocSettlementEditExplorerComponent,resolve: { permission: PermissionResolve } },
            // Chỉ điều chỉnh hồ sơ đã có, không tạo mới
            { path: 'detail/:id', component: AllocSettlementEditEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(allocsettlementeditRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        AllocSettlementEditComponent,
        AllocSettlementEditEditorComponent,
        AllocSettlementEditExplorerComponent,
        AllocSettlementEditExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [AllocSettlementEditComponent]
})

export class AllocSettlementEditModule { }
