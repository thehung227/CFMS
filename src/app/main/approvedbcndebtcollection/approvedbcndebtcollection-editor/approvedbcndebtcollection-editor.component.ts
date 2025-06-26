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
import { LayoutApprovedBcnDebtCollectionEditor } from "../Layout";
import { Global } from "../../../shared/global";
import { ParameterContract } from "../../../contracts/parameter.contract";
import { BravoCtorEnum } from "../../../core/enum/type.enum";
import { SystemConstants } from "../../../core/common/system.constants";

@Component({
  selector: 'app-approvedbcndebtcollection-editor-form',
  templateUrl: './approvedbcndebtcollection-editor.component.html',
  styleUrls: ['./approvedbcndebtcollection-editor.component.css']
})

export class ApprovedBcnDebtCollectionEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
 

  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;

  indexPage = ['/main', 'approvedbcndebtcollection', 'detail'];
  // ['/main', 'approvedbcndebtcollection', 'index'];
  indexPage_Editor = ['/main', 'approvedbcndebtcollection', 'detail'];
  folderName = 'Xac_Nhan_Hoan_Thanh_Du_An';

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title,
    private _location: Location) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutApprovedBcnDebtCollectionEditor(service, this.parentData);
  }
  private _isResized = false;
  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid,this.grid1,this.grid2];
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
    // this.grid.formatItem.addHandler((s, e: wjcGrid.FormatItemEventArgs) => {

    //   if (s.rows[e.row] != undefined && s.rows[e.row]._data != undefined) {
    //     let data = s.rows[e.row].dataItem;

    //     if (e.panel.cellType == wjcGrid.CellType.Cell) {
    //       if (data['IsTitleRow'] == true) {
    //         wjcCore.setCss(e.cell, {
    //           color: 'blue',
    //           fontWeight: 'bold',
    //           backgroundColor: '#f8f1e6'
    //         });
    //       } else {
    //         wjcCore.setCss(e.cell, {
    //           color: '',
    //           fontWeight: '',
    //           backgroundColor: ''
    //         });
    //       }
    //     }
    //   }
    // });

     this.grid.formatItem.addHandler((s, e: wjcGrid.FormatItemEventArgs) => {
    
          if (s.rows[e.row] != undefined && s.rows[e.row]._data != undefined) {
            let data = s.rows[e.row].dataItem;
    
            if (e.panel.cellType == wjcGrid.CellType.Cell) {
              if (data['IsTitleRow'] == true) {
                wjcCore.setCss(e.cell, {
                  color: '',
                  fontWeight: 'bold',
                   backgroundColor: '#CCF381'
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
    
        this.grid1.formatItem.addHandler((s, e: wjcGrid.FormatItemEventArgs) => {
    
          if (s.rows[e.row] != undefined && s.rows[e.row]._data != undefined) {
            let data = s.rows[e.row].dataItem;
    
            if (e.panel.cellType == wjcGrid.CellType.Cell) {
              if (data['IsTitleRow'] == true) {
                wjcCore.setCss(e.cell, {
                  color: '',
                  fontWeight: 'bold',
                   backgroundColor: '#CCF381'
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
    
        this.grid2.formatItem.addHandler((s, e: wjcGrid.FormatItemEventArgs) => {
    
          if (s.rows[e.row] != undefined && s.rows[e.row]._data != undefined) {
            let data = s.rows[e.row].dataItem;
    
            if (e.panel.cellType == wjcGrid.CellType.Cell) {
              if (data['IsTitleRow'] == true) {
                wjcCore.setCss(e.cell, {
                  color: '',
                  fontWeight: 'bold',
                  fontStyle: '',
                   backgroundColor: '#CCF381'
                });
              }
              else
              if (data['IsChild'] == true) {
                wjcCore.setCss(e.cell, {
                  color: 'blue',
                  fontWeight: '',
                  fontStyle: 'italic',
                   backgroundColor: ''
                });
              }
              else {
                wjcCore.setCss(e.cell, {
                  color: '',
                  fontWeight: '',
                  fontStyle: '',
                  backgroundColor: ''
                });
              }
            }
          }
        });
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
      // try {
      //   for (let row of this.grid.itemsSource.sourceCollection) {
      //     if (row['Data'] != undefined) {
      //       this.filesUpload2.push(row['Data']);
      //     }
      //   }
      // }
      // catch (e) { }

      // await this._service.upLoad(this.filesUpload2, this.editorFrm.controls['ProductCostId'].value.toString() + '\\' + this.folderName, this.parentData['IdBizDocVB']).toPromise().then();

      let params = new Array<ParameterContract>();
      const param1 = new ParameterContract();
      const param2 = new ParameterContract();
      const param3 = new ParameterContract();

      param1.ParameterName = Global.convertParameterName('Stt');
      param1.ParameterValue = this.editorFrm.controls['Stt'].value.toString();
      params.push(param1);

      param3.ParameterName = Global.convertParameterName('ParentKey');
      param3.ParameterValue = this.editorFrm.controls['ParentKey'].value.toString();
      params.push(param3);
  
      param2.ParameterName = Global.convertParameterName('State');
      param2.ParameterValue = state.toString();
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
        console.log(ds)
        let _data = await this._service.postXML(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_B20Debt_ApproveSaveData', params, ds)
          .toPromise().then();

        this.output = <Array<Object>>(_data['output']);
        this._err = this.output['@_Error'];
        this._errMess = this.output['@_ErrorMessage'];
        // this.output = <Array<Object>>(_data['output']);
        // this._errBCTC = this.output['@_Error'];
        // this._errMess = this.output['@_ErrorMessage'];
        // this.dataAdjust = new wjcCore.CollectionView(_data['data'][0]);
        // this.gridAdjust.itemsSource = new wjcCore.CollectionView(_data['data'][0]);
        // this.dataEffective = new wjcCore.CollectionView(_data['data'][1]);
      }
      catch (ex) {
        console.log(ex);
      };


      // this.parentData["ApproveStatus"] = state;
      // this.parentData["ApproveStatusWeb"] = state;

      // if (this._err == false) {
      //   this.dfpanel.runConstraintVer2('Evaluator_ServerUpdating_UpdateStatusByApproveStatus').then(() => {
      //     this.sendMail(this.editorFrm, 'O2', this.parentData['IdBizDocParent'], false, state).then(() => {
      //       this.router.navigate(['/main', 'notifications', 'index']);
      //     });
      //   });
      // }
      if (this._err) {
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
