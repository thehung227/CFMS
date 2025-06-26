import { Component, OnInit } from '@angular/core'
import { SystemConstants } from './../../core/common/system.constants';
declare var AdminLTE: any;

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
    bodyClasses = 'skin-blue sidebar-mini';
    body: HTMLBodyElement = document.getElementsByTagName('body')[0];

    ngOnInit() {
        AdminLTE.init();
    }

    ngOnDestroy() {
    }
}