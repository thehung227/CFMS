import { Component, OnInit, OnDestroy } from '@angular/core';
declare var AdminLTE: any;

import * as wjcCore from 'wijmo/wijmo';

import { SystemConstants } from './../core/common/system.constants';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css']
})

export class MainComponent implements OnInit, OnDestroy{
    bodyClasses = 'skin-blue-light sidebar-mini';
    body: HTMLBodyElement = document.getElementsByTagName('body')[0];

    constructor() { }

    ngOnInit() {
        this.body.classList.remove('login-page');
        this.body.classList.add('skin-blue');
        this.body.classList.add('sidebar-mini');
        this.body.classList.add('fixed');
        this.body.classList.add('newt-theme');
        AdminLTE.init();

        document.addEventListener('transitionend', this.onLayoutTransitionEnd, true);
    }

    ngOnDestroy() {

        document.removeEventListener('transitionend', this.onLayoutTransitionEnd, true);

        this.body.classList.remove('login-page');
        this.body.classList.remove('skin-blue');
        this.body.classList.remove('sidebar-mini');
        this.body.classList.remove('fixed');
        this.body.classList.remove('newt-theme');
    }

    /**
     * Thu/mở sidebar chỉ đổi class trên <body>; AdminLTE dùng CSS để chạy
     * margin-left của .content-wrapper (230px <-> 50px) kèm transition 0.3s.
     * Quá trình này KHÔNG phát window.resize, mà Wijmo lại chỉ đo lại kích thước
     * khi có sự kiện đó -> lưới giữ nguyên chiều rộng cũ cho tới khi người dùng
     * reload hoặc tự kéo cửa sổ.
     *
     * Bắt transitionend của chính .content-wrapper để đo lại ĐÚNG LÚC hiệu ứng
     * kết thúc (không đoán bằng setTimeout), rồi yêu cầu mọi control Wijmo trên
     * trang tính lại layout. Đặt ở đây - lớp bọc chung của toàn bộ khu vực
     * /main - nên mọi màn hình đều được xử lý, không phải sửa từng module.
     */
    private onLayoutTransitionEnd = (e: TransitionEvent) => {
        if (e.propertyName !== 'margin-left' && e.propertyName !== 'transform') return;

        const target = <HTMLElement>e.target;
        if (!target || !target.classList || !target.classList.contains('content-wrapper')) return;

        wjcCore.Control.invalidateAll();
    }
}
