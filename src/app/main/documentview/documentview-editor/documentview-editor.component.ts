import { Component, ViewChild, OnInit, OnDestroy, ElementRef, HostListener } from "@angular/core";
import { BaseEditorComponent } from "../../_baseform/base-editor.component";
import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import * as wjcCore from 'wijmo/wijmo';
import * as wjcGrid from 'wijmo/wijmo.grid';
import * as wjcInput from 'wijmo/wijmo.angular2.input';
import { DynamicFormPanelComponent } from "../../../ui/form/dynamic-form-panel.component";
import { BaseEditorService } from "../../../base/base.service-editor";
import { ActivatedRoute, Router } from "@angular/router";
import { PanelControlService } from "../../../ui/panel/PanelControlService";
import { LayoutDocumentViewEditor } from "../DeclareLayout";
import { Title } from "@angular/platform-browser";
import { Global } from "../../../shared/global";
import { ParameterContract } from "../../../contracts/parameter.contract";
import { CryptoExtension } from "../../../core/extensions/crypto.extension";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-documentview-editor-form',
  templateUrl: './documentview-editor.component.html',
  styleUrls: ['./documentview-editor.component.css']
})

export class DocumentViewEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;

  indexPage = ['/main', 'documentview', 'index'];
  indexPage_Editor = ['/main', 'documentview', 'detail'];
  folderName = '13.DocumentView';

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutDocumentViewEditor(service, this.parentData);

    const sub = this.route.params.subscribe(param => {
      let _value = param['params'];
      if (_value) {
        this.paramsRoute = JSON.parse(CryptoExtension.decrypt(decodeURIComponent(_value)));
      }
      else { this.paramsRoute = _value; }
    });
    this.subscription = new Subscription();
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid];
    //this.init();
  }

  ngAfterViewInit() {
    // //this.dfpanel = this._dfpanel;
    // //this.afterViewInit();
    if (this.paramsRoute.command != '' && this.paramsRoute.command != null && this.paramsRoute.command != undefined)
      this.viewerDocumentHtml(this.paramsRoute.wordName,this.paramsRoute.fileName,this.paramsRoute.folderPath);
    else
      this.viewerDocument(this.paramsRoute.folderName, this.paramsRoute.id, this.paramsRoute.name);
  }

  onSubmit(formData: any) {
    this.submit(formData, this.indexPage_Editor);
  }

  viewerDocument(folder: string, id: number, name: string) {

    var x = document.getElementById("viewfileattach");
    var y = document.getElementById("fileView");
    var z = document.getElementById('htmlShow');

    x.style.display = "block";
    y.style.display = "block";
    z.style.display = "none";

    folder = Global.translateAutoText(folder, this.parentData);

    //let _data = await this._service.fetchDataChild(Global.DataExplorerEndpoint, 'B30BizDoc', "Id = " + id).toPromise().then();

    let fileName = name;// _data[0]['FilePath'];

    if (folder && fileName) {

      let p = this._service.dowload(folder, id.toString(), fileName).toPromise();
      p.then(blob => {

        if (fileName.toUpperCase().endsWith('PDF') == true || fileName.toUpperCase().endsWith('JPG') == true || fileName.toUpperCase().endsWith('PNG') == true || fileName.toUpperCase().endsWith('JPEG') == true || fileName.toUpperCase().endsWith('GIF') == true) {
          let url = window.URL.createObjectURL(blob);
          y.setAttribute('data', url);
        }
      });
    }
    else {
      alert('Không tồn tại file đính kèm!');
    }

  }

  viewerDocumentHtml(name: string, fileName: string, folderPath: string) { 
    var x = document.getElementById("viewfileattach");
    var y = document.getElementById("fileView");
    var z = document.getElementById('htmlShow');

    x.style.display = "none";
    y.style.display = "none";
    z.style.display = "block";

    this.showLoading = true;

    let _command = this.paramsRoute.command;

    const params = new Array<ParameterContract>();
    const param1 = new ParameterContract();

    param1.ParameterName = this.convertParameterName('Id');
    param1.ParameterValue = this.paramsRoute.id;
    params.push(param1);

    let ctor1 = CryptoExtension.encrypt(_command);
    const ctor2 = CryptoExtension.encrypt(JSON.stringify(params));

    let body = {
      "storeName": ctor1,
      "params": ctor2
    }

    this._service.exportHtml(folderPath + name, body).subscribe(data => {

      let _title = fileName;

      if (_title == '' || _title == null || _title == undefined) {
        _title = this._layoutDeclare.layout.PrintDocument.Text;
      }

      let _html = `<html>
    <head>
    <title>`+ Global.translateAutoText(_title, this.parentData) + `</title>
        </head>`;
      _html += '<body onload="window.print();window.close()">';

      _html += Global.translateImageOutput(data['html'], data['output']);

      _html += '</body></html>'

      this.showLoading = false;

      document.getElementById('htmlShow').innerHTML = _html;
    });

  }

  ngOnDestroy() {
    this.destroy();
  }
}
