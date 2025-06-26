import * as wjcCore from 'wijmo/wijmo';
import * as wjcData from 'wijmo/wijmo.odata';
import * as wjcGauge from 'wijmo/wijmo.gauge';
import * as wjcChart from 'wijmo/wijmo.chart';
import * as wjcGrid from 'wijmo/wijmo.grid';


// Angular
import { Component, EventEmitter, Input, Inject, enableProdMode, NgModule, ViewChild, AfterViewInit, OnInit, ViewContainerRef, ComponentRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';
import { WjChartModule } from 'wijmo/wijmo.angular2.chart';
import { WjGaugeModule } from 'wijmo/wijmo.angular2.gauge';
import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { DynamicCompService } from './widget.service';

'use strict';

// The Explorer application root component.
@Component({
    selector: 'app-widget',
    templateUrl: './widget.component.html',
    styleUrls: ['./widget.component.css']
})
export class WidgetComponent implements AfterViewInit {

    tileTypes = 'Grid,Pie Chart,Radial Gauge,Linear Gauge,Bar Chart,Column Chart,Line Chart,Bubble Chart,Bullet Graph,Blank'.split(',');
    @ViewChild('dynCompContainer', { read: ViewContainerRef }) compContainer;

    private _compService: DynamicCompService;

    private dragSource = null;
    private dropTarget = null;

    constructor( @Inject(DynamicCompService) _compService: DynamicCompService) {
        this._compService = _compService;
    }

    ngAfterViewInit() {    
        var cmp:ComponentRef<any>;    
        // for (let i = 0; i < this.tileTypes.length && i < 4; i++) {
        //     cmp = this._compService.createDynaComp(this.compContainer, this.tileTypes[i]);
        // }
            cmp = this._compService.createDynaComp(this.compContainer, 'Pie Chart');
            cmp = this._compService.createDynaComp(this.compContainer, 'Bar Chart');
            cmp = this._compService.createDynaComp(this.compContainer, 'Radial Gauge');
            cmp = this._compService.createDynaComp(this.compContainer, 'Linear Gauge');
            cmp = this._compService.createDynaComp(this.compContainer, 'Grid');

    }

    addTile(tileType: string) {
        var cmp = this._compService.createDynaComp(this.compContainer, tileType);
    }

    handleTile(e: any) {
        if (wjcCore.closest(e.target, '.glyphicon-remove') != null) {
            var tile = wjcCore.closest(e.target, '.tile');
            if (tile != null) {
                var idx = this.getIndex(tile.parentElement);
                this._compService.removeComp(this.compContainer, idx - 1);
            }
        }
        if (wjcCore.closest(e.target, '.glyphicon-pencil') != null) {
            var tile = wjcCore.closest(e.target, '.tile');
            if (tile != null) {
                alert('edit tile parameters...')
            }
        }
    }

    dragstart(e:any) {

       var panel = document.querySelector('.dashboard'),
       target = wjcCore.closest(e.target, '.tile');
        if (target) {
            this.dragSource = target;
            wjcCore.addClass(this.dragSource, 'drag-source');
            var dt = e.dataTransfer;
            dt.effectAllowed = 'move';
            dt.setData('text', this.dragSource.innerHTML);
        }
    }

    dragover(e: any) {
        if (this.dragSource) {
            var tile = wjcCore.closest(e.target, '.tile');
            if (tile == this.dragSource) {
                tile = null;
            }
            if (this.dragSource && tile && tile != this.dragSource) {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
            }
            if (this.dropTarget != tile) {
                wjcCore.removeClass(this.dropTarget, 'drag-over');
                this.dropTarget = tile;
                wjcCore.addClass(this.dropTarget, 'drag-over');
            }
        }
    }

    drop(e: any) {       
        if (this.dragSource && this.dropTarget) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            e.preventDefault();
            var srcIndex = this.getIndex(this.dragSource.parentElement),
                dstIndex = this.getIndex(this.dropTarget.parentElement),
                refChild = srcIndex > dstIndex ? this.dropTarget.parentElement : this.dropTarget.parentElement.nextElementSibling;
            this._compService.moveComp(this.compContainer, srcIndex-1, dstIndex - 1);
            // invalidate Wijmo controls after layout updates
            wjcCore.Control.invalidateAll();
        }
    }

    dragend(e: any) {
        wjcCore.removeClass(this.dragSource, 'drag-source');
        wjcCore.removeClass(this.dropTarget, 'drag-over');
        this.dragSource = this.dropTarget = null;
    }

   getIndex(e) {
        var p = e.parentElement;
        for (var i = 0; i < p.children.length; i++) {
            if (p.children[i] == e) return i;
        }
        return -1;
    }

}
