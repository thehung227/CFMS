import * as wj from "wijmo/wijmo.input";

import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef, Inject, Injector } from '@angular/core';
import { Global } from '../../shared/global';
import { Subscription } from 'rxjs/Subscription';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { SystemConstants } from '../../core/common/system.constants';
import { ParameterContract } from '../../contracts/parameter.contract';
import { BravoCtorEnum } from '../../core/enum/type.enum';
import { WjDirectiveBehavior } from "wijmo/wijmo.angular2.directiveBase";
import { CryptoExtension } from "../../core/extensions/crypto.extension";
import { Expression } from "../../shared/expression";
import { CKEDITOR, CKEditorExtension } from '../../core/extensions/ckeditor.extension';

@Component({
   selector: 'app-mail-form',
   templateUrl: 'mail-form.html',
   styleUrls: ['mail-form.css']
})
export class MailForm extends wj.Popup implements OnInit {
   isLangVN: boolean;

   @ViewChild('inputEmail') inputEmail: string;
   //@ViewChild('inputPassword') inputPassword: string;
   @ViewChild('inputTo') inputTo: string;
   @ViewChild('inputCC') inputCC: string;
   @ViewChild('inputBCC') inputBCC: string;
   @ViewChild('inputSubject') inputSubject: string;
   @ViewChild('inputplainTextMessage') inputplainTextMessage: string;

   userDefault: string;

   private _titleHeader: string = "MAIL";
   public get titleHeader(): string {
      return this._titleHeader;
   }
   public set titleHeader(value: string) {
      this._titleHeader = value;
      if (value) {
         this.hostElement.getElementsByClassName('panel-title').item(0).textContent = value;
      }
   }

   richtextMail: CKEDITOR.editor;

   SendMailObject = {
      from: '',
      to: '',
      cc: '',
      bcc: '',
      nameSend: '',
      subject: '',
      plainTextMessage: '',
      htmlMessage: '',
      files: [],
      smtpOptions: { server: '', user: '', password: '', port: 25, useSsl: true },
      //replacement: null,
      exportOption: null,
      toConfirm: '',
      mailType: '',
      mailToken: '',
   }
   subscription: Subscription;

   fileAttach: any;

   constructor(@Inject(ElementRef) private elRef: ElementRef, @Inject(Injector) injector: Injector, private srv: BaseExplorerService) {
      super(WjDirectiveBehavior.getHostElement(elRef));
      this.isLangVN = true;//Global.isLangVN;
   }

   async ngOnInit() {
      this.subscription = new Subscription();
      // this._configMail = await this.srv.fetchDataSelect(Global.DataExplorerEndpoint, 'vB00HrmEmailProfile', "Code = 'BRAVO_CTC'", 1, 1, 'Id').toPromise().then();


      // if (this._configMail.length > 0) {
      //    this.inputEmail['nativeElement'].value = localStorage.getItem(SystemConstants.CURRENT_USERNAME).replace(/"/gi, '') + this._configMail[0]['Suffixes'];
      //    //this.inputPassword['nativeElement'].value =  this._configMail[0]['usc'] ;//CryptoExtension.decrypt( JSON.parse( localStorage.getItem(SystemConstants.CURRENT_USER)).usc);

      //    this.SendMailObject.smtpOptions.server = this._configMail[0]['EmailServerName'];
      //    this.SendMailObject.smtpOptions.useSsl = Boolean(this._configMail[0]['EmailServerEnable_SSL']);
      //    this.SendMailObject.smtpOptions.port = Number(this._configMail[0]['EmailServerPort']);
      //    this.SendMailObject.smtpOptions.user = this._configMail[0]['EmailAccountName']; //localStorage.getItem(SystemConstants.CURRENT_USERNAME).replace(/"/gi,'');
      //    this.SendMailObject.smtpOptions.password = this._configMail[0]['usc'];

      //    if (this.data != undefined) {
      //       let file = { source: '', des: '' };
      //       file.des = '/' + this.data['ProductCostId'] + '/10.Don_Dat_Hang_Mua/' + this.data['Id'] + '/' + this.data['DocNo'].replace(/\//gi, '-') + '.pdf';
      //       file.source = '/3.Mau_In/BienBan_QuyetToan_ThanhLy.docx';

      //       this.SendMailObject.files.push(file);

      //       if (this.data['Id']) {
      //          const params = new Array<ParameterContract>();
      //          const param1 = new ParameterContract();

      //          param1.ParameterName = Global.convertParameterName('Id');
      //          param1.ParameterValue = this.data['Id'];
      //          params.push(param1);

      //          let _data = await this.srv.getDataOutput(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_B30BizDoc_VoucherForm', params)
      //             .toPromise().then();

      //          this.SendMailObject.replacement = _data['output']
      //       }
      //    }
      // }
   }

   public async loadConfigurationMail(configMail: any, options: any, data: any) {
      if (configMail) {
         //this.inputEmail['nativeElement'].value = configMail['EmailAddress'];// localStorage.getItem(SystemConstants.CURRENT_USERNAME).replace(/"/gi, '') + configMail['Suffixes'];
         // this.inputTo['nativeElement'].value = configMail[0]['EmailTo'];
         // this.inputCC['nativeElement'].value = configMail[0]['EmailCC'];
         // this.inputSubject['nativeElement'].value = configMail[0]['Subject'];

         // this.SendMailObject.smtpOptions.server = configMail['EmailServerName'];
         // this.SendMailObject.smtpOptions.useSsl = Boolean(configMail['EmailServerEnable_SSL']);
         // this.SendMailObject.smtpOptions.port = Number(configMail['EmailServerPort']);
         // this.SendMailObject.smtpOptions.user = configMail['EmailAccountName'];
         // this.SendMailObject.smtpOptions.password = configMail['usc'];
         this.SendMailObject.mailToken = localStorage.getItem(SystemConstants.MAIL_TOKEN).replace(/"/gi, '');

         if (options.FileAttach) {
            let file = { source: '', des: '' };
            file.des = Global.convertConfig(Expression.translateParameter(options.FileAttach['DestinationPath'], data)) + Expression.convertFileName(Expression.translateParameter(options.FileAttach['FileName'], data));
            file.source = Global.convertConfig(options.FileAttach['SourcePath']);

            this.SendMailObject.files.push(file);
            let params = new Array<ParameterContract>();
            if (options.FileAttach['Command'] && options.FileAttach['Parameters']) {
               for (let key in options.FileAttach['Parameters']) {
                  let param = new ParameterContract();
                  let _value = options.FileAttach['Parameters'][key];

                  param.ParameterName = Global.convertParameterName(key);

                  if (_value.includes('{VAR=')) {
                     let tmp = Global.VAR[_value];
                     _value = Global.convertConfig(tmp.Value);
                  }

                  if (_value.indexOf('SYSFUNC=') > -1) {
                     _value = Expression.runFunction(_value);
                  }

                  if (_value.includes('{EXPR=')) {
                     _value = Expression.translateParameter(_value, data);
                  }

                  param.ParameterValue = _value;

                  params.push(param);
               }

               // let _data = await this.srv.getDataOutput(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, options['Command'], params)
               //    .toPromise().then();
               let ctor1 = CryptoExtension.encrypt(options.FileAttach['Command']);
               let ctor2 = CryptoExtension.encrypt(JSON.stringify(params));

               let exportOption = {
                  "storeName": ctor1,
                  "params": ctor2
               }
               this.SendMailObject.exportOption = exportOption;
            }
         }

         if (options.Template) {

            let params = new Array<ParameterContract>();
            if (options.Template['Command'] && options.Template['Parameters']) {
               for (let key in options.Template['Parameters']) {
                  let param = new ParameterContract();
                  let _value = options.Template['Parameters'][key];

                  param.ParameterName = Global.convertParameterName(key);

                  if (_value.includes('{VAR=')) {
                     let tmp = Global.VAR[_value];

                     _value = Global.convertConfig(tmp.Value);
                  }

                  if (_value.indexOf('SYSFUNC=') > -1) {
                     _value = Expression.runFunction(_value);
                  }

                  if (_value.includes('{EXPR=')) {
                     _value = Expression.translateParameter(_value, data);
                  }

                  param.ParameterValue = _value;

                  params.push(param);
               }

               let ctor1 = CryptoExtension.encrypt(options.Template['Command']);
               let ctor2 = CryptoExtension.encrypt(JSON.stringify(params));

               let body = {
                  "storeName": ctor1,
                  "params": ctor2
               }

               let _html = await this.srv.exportHtml(Expression.translateParameter(options.Template['FolderPath'], data) + options.Template['FileName'], body).toPromise().then();

               this.SendMailObject.htmlMessage = _html['html'];

               // this.richtextMail = CKEditorExtension.create("Nội dung", "richtextmail", this.SendMailObject.htmlMessage, 200);

               let _data = await this.srv.getDataOutput(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, options.Template['Command'], params)
                  .toPromise().then();
               let _configMail = _data['data'];
               if (_configMail.length > 0) {
                  this.inputTo['nativeElement'].value = _configMail[0]['EmailTo'];
                  this.inputCC['nativeElement'].value = _configMail[0]['EmailCC'];
                  this.inputSubject['nativeElement'].value = _configMail[0]['Subject'];
               }
            }
         }
      }
   }

   async SendMail() {
      // this.SendMailObject.from = this.inputEmail['nativeElement'].value;
      this.SendMailObject.nameSend = localStorage.getItem(SystemConstants.CURRENT_USERFULLNAME).replace(/"/gi, '')
      //this.SendMailObject.smtpOptions.password = this.inputPassword['nativeElement'].value; 
      this.SendMailObject.to = this.inputTo['nativeElement'].value;
      this.SendMailObject.cc = this.inputCC['nativeElement'].value;
      // this.SendMailObject.bcc = this.inputBCC['nativeElement'].value;
      this.SendMailObject.subject = this.inputSubject['nativeElement'].value;
      // this.SendMailObject.plainTextMessage = this.inputplainTextMessage['nativeElement'].value;

      // // let data = {
      // //   to: 'khoannt@bravo.com.vn',
      // //   cc: 'quydv@bravo.com.vn',
      // //   bcc: 'duongnht@bravo.com.vn',
      // //   from: 'khoannt@bravo.com.vn',
      // //   subject: 'Test send mail',
      // //   plainTextMessage: 'test',
      // //   htmlMessage: `Ahihi`,
      // //   files: [
      // //     { source: '/3.Mau_In/BienBan_QuyetToan_ThanhLy.docx', des: '/PROD001864/10.Don_Dat_Hang_Mua/211/1.pdf' },
      // //   ],
      // //   smtpOptions: {
      // //     server: "mail.bravo.com.vn",
      // //     user: "khoannt",
      // //     password: "BravoKit@162",
      // //     port: 25,
      // //     useSsl: false
      // //   },
      // //   replacement: null}

      const sub = await this.srv.sendMailApi(Global.MailEndPoint, this.SendMailObject).subscribe((result) => {
         
         if(!result)
            alert('Đã xử lý thành công ');
         else 
            alert('Xử lý không thành công '+ result.message);

      });

      this.subscription.add(sub);

      this.hide();

      this.refresh();
   }

   closeForm() {
      this.hide()
      this.refresh()
   }

   ngOnDestroy() {
      this.subscription.unsubscribe();
   }
}
