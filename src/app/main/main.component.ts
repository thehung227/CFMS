import { Component, OnInit, OnDestroy } from '@angular/core';
declare var AdminLTE: any;

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
        AdminLTE.init();
    }

    ngOnDestroy() {

        this.body.classList.remove('login-page');
        this.body.classList.remove('skin-blue');
        this.body.classList.remove('sidebar-mini');
        this.body.classList.remove('fixed');
    }
}