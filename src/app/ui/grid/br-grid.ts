import { WjFlexGrid, wjFlexGridMeta } from 'wijmo/wijmo.angular2.grid';
import { Component, forwardRef, ElementRef, Injector, ChangeDetectorRef, OnInit, Inject, SkipSelf, Optional } from '@angular/core';
import * as wjc from 'wijmo/wijmo'
import * as wjg from 'wijmo/wijmo.grid'
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'br-grid',
  template: '',
  inputs: [...wjFlexGridMeta.inputs],
  outputs: wjFlexGridMeta.outputs,
  providers: [
    { provide: "WjComponent", useExisting: forwardRef(() => BRGrid) }, ...wjFlexGridMeta.providers,
  ]
})
export class BRGrid extends WjFlexGrid {
  private _isCloning: boolean;
  private _clipBoard: string;
  private _bindHandleOnMouseMove = this._handleOnMouseMove.bind(this);
  private _bindHandleOnMouseUp = this._handleOnMouseUp.bind(this);
  private _name: string;
  protected ngUnsubscribe = new Subject();

  public get name(): string {
    return this._name;
  }
  public set name(value: string) {
    this._name = value;
  }

  constructor(@Inject(ElementRef) elRef: ElementRef, @Inject(Injector) injector: Injector,
    @Inject('WjComponent') @SkipSelf() @Optional() parentCmp: any,
    @Inject(ChangeDetectorRef) cdRef: ChangeDetectorRef) {
    super(elRef, injector, parentCmp, cdRef);
  }

  ngOnInit() {
    super.ngOnInit();
    if (!this.isReadOnly)
      this._addListener();
  }


  private _getTreeIcon(gr: wjg.GroupRow, text: string): string {
    let _glyph = gr.isCollapsed ? 'fa-plus' : 'fa-minus';
    let _span = `<span class="fa ${_glyph}"></span>`;

    return `<button class="wj-btn wj-btn-glyph ${wjg.CellFactory._WJC_COLLAPSE}" type = "button" tabindex = "-1">${_span}${text}</button >`
  }

  private _handleOnFormatItem(e: wjg.FormatItemEventArgs) {
    if (e.panel.cellType == wjg.CellType.Cell && !this.isReadOnly && !e._p.columns[e.col].isReadOnly) {
      this._createCloneDataBehavior(e);
    }
  }

  private _handleOnMouseMove(e: MouseEvent) {
    if (this._isCloning && this._clipBoard && e.buttons > 0) {
      // let _ht = this.hitTest(e);
      // this.setCellData(_ht.row, _ht.col, this._clipBoard);
    }
  }

  private _handleOnMouseUp(e: MouseEvent) {
    if (this._isCloning && this._clipBoard) {
      this.setClipString(this._clipBoard);
      this._isCloning = false;
    }
  }

  private _addListener() {
    this.formatItemNg.pipe(takeUntil(this.ngUnsubscribe)).subscribe(this._handleOnFormatItem.bind(this));
    this.addEventListener(this.cells.hostElement, 'mousemove', this._bindHandleOnMouseMove, false);
    this.addEventListener(this.cells.hostElement, 'mouseup', this._bindHandleOnMouseUp, false);
  }

  private _removeListener() {
    this.removeEventListener(this.cells.hostElement, 'mousemove', this._bindHandleOnMouseMove, false);
    this.removeEventListener(this.cells.hostElement, 'mouseup', this._bindHandleOnMouseUp, false);
  }

  private _createCloneDataBehavior(e: wjg.FormatItemEventArgs) {
    let _row = e.panel.rows[e.row],
      _gr = _row instanceof wjg.GroupRow ? _row : null;

    if (e.cell instanceof HTMLElement) {
      if (_gr) {
        let _text = e.cell.innerText;
        e.cell.innerHTML = this._getTreeIcon(_gr, _text);
        return;
      }
      let _btn = document.createElement('btn');
      _btn.classList.add('clone-btn');
      _btn.style.width = '5px';
      _btn.style.height = '5px';
      _btn.style.position = 'absolute';
      _btn.style.bottom = '0px';
      _btn.style.right = '0px';
      _btn.style.cursor = 'crosshair';
      e.cell.appendChild(_btn);

      this.removeEventListener(_btn, 'mousedown');
      _btn.addEventListener('mousedown', (e: MouseEvent) => {
        // e.stopPropagation();
        this._isCloning = true;
        let val = this.getClipString();
        this._clipBoard = val;
      });


    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this._removeListener();
    super.ngOnDestroy();
  }
}
