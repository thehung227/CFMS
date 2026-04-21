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
import { timeout } from "q";
import { Title } from "@angular/platform-browser";
import { Location } from "@angular/common";
import { CryptoExtension } from "../../../core/extensions/crypto.extension";
import { LayoutApprovedSettlementRecordsEditor } from "../Layout";
import { Global } from "../../../shared/global";
import { ParameterContract } from "../../../contracts/parameter.contract";
import { BravoCtorEnum } from "../../../core/enum/type.enum";
import { SystemConstants } from "../../../core/common/system.constants";

@Component({
  selector: 'app-approvedsettlementrecords-editor-form',
  templateUrl: './approvedsettlementrecords-editor.component.html',
  styleUrls: ['./approvedsettlementrecords-editor.component.css']
})

export class ApprovedSettlementRecordsEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
  @ViewChild('grid3') grid3: wjcGrid.FlexGrid;
  @ViewChild('grid4') grid4: wjcGrid.FlexGrid;


  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;

  indexPage = ['/main', 'approvedsettlementrecords', 'detail'];
  // ['/main', 'approvedsettlementrecords', 'index'];
  indexPage_Editor = ['/main', 'approvedsettlementrecords', 'detail'];
  folderName = 'Ho_So_Quyet_Toan';

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title,
    private _location: Location) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutApprovedSettlementRecordsEditor(service, this.parentData);
  }
  private _isResized = false;
  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid,this.grid1,this.grid2,this.grid3,this.grid4];
    this.init().then(() => {
      this.showDefaultFile();
    });
    this.grid1.allowAddNew = false;
    // this.grid2.allowAddNew = false;
    this.grid.allowAddNew = false;

  }
  dbClickCellContent2(flex: wjcGrid.FlexGrid) {
    let pop = this.frmPopupTooltip;

    if (!flex.isReadOnly)
      return;

    let host = flex.hostElement;
    let self = this;

    host.addEventListener('dblclick', () => {
      var sel = flex.selection;

      let _content = flex.getCellData(sel.row, sel.col, true);

      this.contentPopupTooltip['nativeElement'].innerHTML = _content;

      pop.show();


    });
  }
  ngAfterViewInit() {
    this.dfpanel = this._dfpanel; this.afterViewInit();
    this.grid2.itemsSourceChanged.addHandler(() => {
          this.applyGroupGrid2();
        });
    
        this.grid1.formatItem.addHandler((s, e: wjcGrid.FormatItemEventArgs) => {
    
          if (s.rows[e.row] != undefined && s.rows[e.row]._data != undefined) {
            let column = e.panel.columns[e.col].binding;
            let data = s.rows[e.row].dataItem;
    
            // if (e.panel.cellType == wjcGrid.CellType.Cell) {
            //           if (data["IsTitleRow"] == true) {
            //             wjcCore.setCss(e.cell, {
            //               color: "red",
            //               fontWeight: "",
            //               backgroundColor: "",
            //             });
            //           } else {
            //             wjcCore.setCss(e.cell, {
            //               color: "",
            //               fontWeight: "",
            //               backgroundColor: "",
            //             });
            //           }
            //         }
    
            if (e.panel.cellType == wjcGrid.CellType.Cell) {
              if (column == 'TongGiaTriDuKienQT_ChuaVAT') {
                wjcCore.setCss(e.cell, {
                  color: 'blue',
                  fontWeight: 'bold',
                  backgroundColor: ''
                });
              }
              else
                if (column == 'TongDoanhThuDaXacNhan_ChuaVAT') {
                  wjcCore.setCss(e.cell, {
                    color: 'blue',
                    fontWeight: 'bold',
                    backgroundColor: ''
                  });
                }
                else
                  if (column == 'DoanhThuConLai_TrucTiep_ChuaVAT' || column == 'DoanhThuConLai_NSC_ChuaVAT' || column == 'PhaiThuConLai_TrucTiep_ChuaVAT' || column == 'PhaiThuConLai_NSC_ChuaVAT'
                    || column == 'TongGiaTriDuKienQT_GomVAT' || column == 'CDTThanhToan_GomVAT' || column == 'PhaiThuConLai_TrucTiep_GomVAT' || column == 'PhaiThuConLai_NSC_GomVAT'
                    || column == 'TongDoanhThuConLai_ChuaVAT' || column == 'PhaiThuConLai_GomVAT'
                  ) {
                    wjcCore.setCss(e.cell, {
                      color: 'blue',
                      fontWeight: 'bold',
                      backgroundColor: ''
                    });
                  }
                  else {
                    wjcCore.setCss(e.cell, {
                      color: '',
                      fontWeight: '',
                      backgroundColor: ''
                    });
                  }
            }
          }
        });
    
      }
    
      applyGroupGrid2() {
        var cv = this.grid2.collectionView;
        if (cv != null) {
          cv.beginUpdate();
          cv.groupDescriptions.clear();
          var groupDesc = new wjcCore.PropertyGroupDescription('GoiThau');
          cv.groupDescriptions.push(groupDesc);
          cv.endUpdate();
        }
        this.grid2.groupHeaderFormat = '<b>{value}</b> ({count:n0} mục)';
      }

  ngOnDestroy() {
    this.destroy();
  }

  initialized(grid) {
    console.log('gridInitialized');
    setTimeout(()=>{
      grid.autoSizeRows();
    }, 100);
  }
  
  loadedRows(grid){
    console.log('gridLoadedRows');
    if (grid.isInitialized) {
      grid.autoSizeRows();
    }
  }
  
  cellEditEnded(grid, e) {
    console.log('cellEditEnded');
    grid.autoSizeRow(e.row);
  }
  
  resizedColumn(grid, e) {
    console.log('resizedColumn');
    grid.autoSizeRows();
  }
  
  updatedLayout(grid) {
    console.log('updatedLayout');
    if (this._isResized) {
      this._isResized = false;
      console.log('Resize on updatedLayout');
      grid.autoSizeRows();
    }
  }

  onSubmit(formData: any) {
    this.submit(formData, this.indexPage);
  }

  backClick() {
    this._location.back();
  }

  openWindow(_id: any) {
    let navigateUrl = [];
    navigateUrl.push('#/main/consdocumentfile/detail');
    navigateUrl.push(_id);
    window.open(navigateUrl.join('/'));
  }

  filesUpload2: File[] = [];

  output: any;
  _err: boolean = false;
  _errMess: any;


  isLoading = false;
  async onClick(state: any) {
    let txt;
    if (state == 0) txt = 'Trả lại';
    else
      if (state == 1) txt = 'Duyệt';
      else
        if (state == 3) txt = 'Đề xuất trả';

    let r = confirm("Xác nhận thao tác: " + txt.toUpperCase());

    if (r == true) {
      this.showLoading = true;
      this.parentData["ApproveStatus"] = state;
      this.parentData["ApproveStatusWeb"] = state;

      this.dfpanel.runConstraintVer2('Evaluator_ServerUpdating_UpdateStatusByApproveStatus').then(() => {
        this.sendMail(this.editorFrm, 'S1', this.parentData['IdClaim'], false, state).then(() => {
          this.router.navigate(['/main', 'notifications', 'index']);
        });
      });
      // this.backClick();
    }
  }

  _errItemSets: boolean = false;

  async saveData(formData: any,state: any) {
    this.showLoading = true;
    let params = new Array<ParameterContract>();
    const param1 = new ParameterContract();

    param1.ParameterName = Global.convertParameterName('Stt');
    param1.ParameterValue = this.editorFrm.controls['Stt'].value.toString();
    params.push(param1);

    try {
      let paramXML = new ParameterContract();
      paramXML.ParameterName = this.convertParameterName('B20DebtDetail');
      paramXML.ParameterValue = 'B20DebtDetail';
      params.push(paramXML);

      let paramXML1 = new ParameterContract();
      paramXML1.ParameterName = this.convertParameterName('B20DebtDetail1');
      paramXML1.ParameterValue = 'B20DebtDetail1';
      params.push(paramXML1);

      let paramXML2 = new ParameterContract();
      paramXML2.ParameterName = this.convertParameterName('B20DebtDetail2');
      paramXML2.ParameterValue = 'B20DebtDetail2';
      params.push(paramXML2);

      let ds = Global.getDataSetContract(
        {
          name: 'B20DebtDetail',
          collection: Global.createColection(this.grid.itemsSource)
        },
        {
          name: 'B20DebtDetail1',
          collection: Global.createColection(this.grid1.itemsSource)
        },
        {
          name: 'B20DebtDetail2',
          collection: Global.createColection(this.grid2.itemsSource)
        }
      )
      console.log(ds)
      let _data = await this._service.postXML(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_B20Debt_ApproveSaveData', params, ds)
        .toPromise().then();
    
      this.output = <Array<Object>>(_data['output']);
      
      this._errItemSets = this.output['@_Error'];
      this._errMess = this.output['@_ErrorMessage'];
    }
    catch (ex) {
      console.log(ex);
    }

    if (this._errItemSets) {
      alert(this._errMess)
      this.showLoading = true;
    }
    else
    {
      location.reload()
      // console.log(this.parentData['Id'])
      // this.indexPage_Editor.push(this.parentData['Id']);
      // this.router.navigate(['main']).then(() => {
      //   this.router.navigate(this.indexPage_Editor).then(() => {
      //     if (this.indexPage_Editor.length > 3)
      //     this.indexPage_Editor.pop();
      //   })
      // });
    }
  }

async sendMailBCH(formData: any,state: any) {
    this.showLoading = true;
    let params = new Array<ParameterContract>();
    const param1 = new ParameterContract();
    const param2 = new ParameterContract();

    param1.ParameterName = Global.convertParameterName('Stt');
    param1.ParameterValue = this.editorFrm.controls['Stt'].value.toString();
    params.push(param1);

    param2.ParameterName = Global.convertParameterName('ParentKey');
    param2.ParameterValue = this.editorFrm.controls['ParentKey'].value.toString();
    params.push(param2);

    try {
      let paramXML = new ParameterContract();
      paramXML.ParameterName = this.convertParameterName('B20DebtDetail');
      paramXML.ParameterValue = 'B20DebtDetail';
      params.push(paramXML);

      let paramXML1 = new ParameterContract();
      paramXML1.ParameterName = this.convertParameterName('B20DebtDetail1');
      paramXML1.ParameterValue = 'B20DebtDetail1';
      params.push(paramXML1);

      let paramXML2 = new ParameterContract();
      paramXML2.ParameterName = this.convertParameterName('B20DebtDetail2');
      paramXML2.ParameterValue = 'B20DebtDetail2';
      params.push(paramXML2);

      let ds = Global.getDataSetContract(
        {
          name: 'B20DebtDetail',
          collection: Global.createColection(this.grid.itemsSource)
        },
        {
          name: 'B20DebtDetail1',
          collection: Global.createColection(this.grid1.itemsSource)
        },
        {
          name: 'B20DebtDetail2',
          collection: Global.createColection(this.grid2.itemsSource)
        }
      )
      
      let _data = await this._service.postXML(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_B20Debt_SendMail_BCH', params, ds)
        .toPromise().then();
    
      this.output = <Array<Object>>(_data['output']);
      
      this._errItemSets = this.output['@_Error'];
      this._errMess = this.output['@_ErrorMessage'];
    }
    catch (ex) {
      console.log(ex);
    }

    if (this._errItemSets) {
      alert(this._errMess)
      this.showLoading = true;
    }
    else
    {
      location.reload()
      // console.log(this.parentData['Id'])
      // this.indexPage_Editor.push(this.parentData['Id']);
      // this.router.navigate(['main']).then(() => {
      //   this.router.navigate(this.indexPage_Editor).then(() => {
      //     if (this.indexPage_Editor.length > 3)
      //     this.indexPage_Editor.pop();
      //   })
      // });
    }
  }

  async doubleClickGrid(grid: wjcGrid.FlexGrid) {
    grid.addEventListener(grid.hostElement, 'click', (e) => {

      if (grid.selectedItems[0]) {
        // let key = grid.selectedItems[0]['Id'];
        let fileName = grid.selectedItems[0]['FilePath'] + '.pdf';
        let _description = grid.selectedItems[0]['Description'];

        var x = document.getElementById("viewfileattach");
        var y = document.getElementById("fileView");
        var z = document.getElementById('htmlShow');
        var w = document.getElementById('fileViewInfo');

        x.style.display = "block";
        y.style.display = "block";
        z.style.display = "none";
        w.style.display = "none";

        let folder = "{EXPR=ProductCostId}\\" + this.folderName;

        folder = Global.translateAutoText(folder, this.parentData);

        // window.open(_description);

        if (folder && fileName) {
          let p = this._service.dowload(folder, this.parentData['IdBizDocParent'].toString(), fileName).toPromise();
          p.then(blob => {


            if (fileName.toUpperCase().endsWith('PDF') == true || fileName.toUpperCase().endsWith('JPG') == true || fileName.toUpperCase().endsWith('PNG') == true || fileName.toUpperCase().endsWith('JPEG') == true || fileName.toUpperCase().endsWith('GIF') == true) {
              let url = window.URL.createObjectURL(blob);
              y.setAttribute('data', url);

              // if (y instanceof HTMLIFrameElement)
              //   y.src = _description + "&amp;action=embedview&amp;wdAr=1.7777777777777777";
              // // y.setAttribute('src', _description + "&amp;action=embedview&amp;wdAr=1.7777777777777777");
            }
          });
        }
        else {
          alert('Không tồn tại file đính kèm trên server.');
        }
      }
    }
    );
  }

  showDefaultFile() {
    if (this.gridArray[0].itemsSource.items) {
      // let key = grid.selectedItems[0]['Id'];
      let fileName = this.grid.itemsSource.items[0]['FilePath'] + '.pdf';
      let _description = this.grid.itemsSource.items[0]['Description'];

      var x = document.getElementById("viewfileattach");
      var y = document.getElementById("fileView");
      var z = document.getElementById('htmlShow');

      x.style.display = "block";
      y.style.display = "block";
      z.style.display = "none";

      let folder = "{EXPR=ProductCostId}\\" + this.folderName;

      folder = Global.translateAutoText(folder, this.parentData);

      if (folder && fileName) {
        let p = this._service.dowload(folder, this.parentData['IdBizDocParent'].toString(), fileName).toPromise();
        p.then(blob => {
          if (fileName.toUpperCase().endsWith('PDF') == true || fileName.toUpperCase().endsWith('JPG') == true || fileName.toUpperCase().endsWith('PNG') == true || fileName.toUpperCase().endsWith('JPEG') == true || fileName.toUpperCase().endsWith('GIF') == true) {
            let url = window.URL.createObjectURL(blob);
            y.setAttribute('data', url);

            // if (y instanceof HTMLIFrameElement)
            //   y.src = _description + "&amp;action=embedview&amp;wdAr=1.7777777777777777";
            // // y.setAttribute('src', _description + "&amp;action=embedview&amp;wdAr=1.7777777777777777");
          }
        });
      }
    }
  }

  showDocumentInNewTab(id: any) {
    //exportHtml(layoutPrint.WordName,layoutPrint.FileName, layoutPrint.FolderPath, parentData?.IdCCMBudget)
    let _command = this._layoutDeclare.layout.PrintDocument.Command;
    let _wordName = this._layoutDeclare.layout.PrintDocument.LayoutPrint[0].WordName;
    let _folderPath = this._layoutDeclare.layout.PrintDocument.LayoutPrint[0].FolderPath;
    let _fileName = this._layoutDeclare.layout.PrintDocument.LayoutPrint[0].FileName;

    let params = { 'command': _command, 'wordName': _wordName, 'folderPath': _folderPath, 'fileName': _fileName, 'id': id };
    let navigateUrl: any = ['#/main', 'documentview', 'detail', encodeURIComponent(CryptoExtension.encrypt(JSON.stringify(params)))];
    window.open(navigateUrl.join('/'));
  }
}
