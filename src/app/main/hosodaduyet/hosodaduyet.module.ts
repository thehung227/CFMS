import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';

import { HoSoDaDuyetComponent } from './hosodaduyet.component';
import { HoSoDaDuyetExplorerComponent } from './hosodaduyet-explorer/hosodaduyet-explorer.component';
import { BaseExplorerService } from '../../base/base.service-explorer';

// Danh sách hồ sơ người đăng nhập đã duyệt. Mở hồ sơ bằng màn approved* có sẵn
// với ?view=1 (chỉ xem) nên module này không có editor riêng.
const hosodaduyetRoutes: Routes = [
    {
        path: '', component: HoSoDaDuyetComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: HoSoDaDuyetExplorerComponent }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        WjGridModule,
        WjGridFilterModule,
        RouterModule.forChild(hosodaduyetRoutes)
    ],
    declarations: [
        HoSoDaDuyetComponent,
        HoSoDaDuyetExplorerComponent
    ],
    providers: [
        BaseExplorerService
    ]
})

export class HoSoDaDuyetModule { }
