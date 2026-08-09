import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { PlanRevenueAdjustComponent } from './planrevenueadjust.component';
import { PlanRevenueAdjustEditorComponent } from './planrevenueadjust-editor/planrevenueadjust-editor.component';
import { PlanRevenueAdjustExplorerComponent } from './planrevenueadjust-explorer/planrevenueadjust-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PlanRevenueAdjustExplorerChildComponent } from './planrevenueadjust-explorer/planrevenueadjust-explorer-child.component';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const planrevenueadjustRoutes: Routes = [
    {
        path: '', component: PlanRevenueAdjustComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: PlanRevenueAdjustExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: PlanRevenueAdjustEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: PlanRevenueAdjustEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: PlanRevenueAdjustEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(planrevenueadjustRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        PlanRevenueAdjustComponent,
        PlanRevenueAdjustEditorComponent,
        PlanRevenueAdjustExplorerComponent,
        PlanRevenueAdjustExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [PlanRevenueAdjustComponent]
})

export class PlanRevenueAdjustModule { }
