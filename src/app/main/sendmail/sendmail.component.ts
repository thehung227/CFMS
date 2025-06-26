import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import * as wjcInput from 'wijmo/wijmo.angular2.input';
import { BaseService } from '../../base/base.service';
import { Global } from '../../shared/global';
import { Subscription } from 'rxjs/Subscription';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { SystemConstants } from '../../core/common/system.constants';
import { LoginComponent } from '../../login/login.component';
import { ParameterContract } from '../../contracts/parameter.contract';
import { BravoCtorEnum } from '../../core/enum/type.enum';
import { ENGINE_METHOD_DIGESTS } from 'constants';
import { CryptoExtension } from '../../core/extensions/crypto.extension';

@Component({
  selector: 'app-sendmail',
  templateUrl: 'sendmail.component.html',
  styleUrls: ['sendmail.component.css']
})
export class SendMailComponent  implements OnInit, OnDestroy {
  @Input() popup: wjcInput.WjPopup;
  
  @ViewChild('inputEmail') inputEmail: string;
  //@ViewChild('inputPassword') inputPassword: string;
  @ViewChild('inputTo') inputTo: string;
  @ViewChild('inputCC') inputCC: string;
  @ViewChild('inputBCC') inputBCC: string;
  @ViewChild('inputSubject') inputSubject: string;
  @ViewChild('inputplainTextMessage') inputplainTextMessage: string;

  userDefault: string;

  SendMailObject = {
    from: '',
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    plainTextMessage: '',
    htmlMessage: '',
    files: [],
    smtpOptions: { server: '', user: '', password:'', port: 25, useSsl: true},
    replacement: null
  }
  subscription: Subscription;

  _configMail: any;
  
  data: any;
  constructor(private srv: BaseExplorerService) {
    
  }
  
  async ngOnInit(){
    this.subscription = new Subscription();
    this._configMail = await this.srv.fetchDataSelect(Global.DataExplorerEndpoint, 'vB00HrmEmailProfile', "Code = 'BRAVO_CTC'", 1,1, 'Id').toPromise().then();
    
    if (this._configMail.length > 0) {
    this.inputEmail['nativeElement'].value = localStorage.getItem(SystemConstants.CURRENT_USERNAME).replace(/"/gi,'') + this._configMail[0]['Suffixes'];
    //this.inputPassword['nativeElement'].value =  this._configMail[0]['usc'] ;//CryptoExtension.decrypt( JSON.parse( localStorage.getItem(SystemConstants.CURRENT_USER)).usc);
    
    this.SendMailObject.smtpOptions.server = this._configMail[0]['EmailServerName'];
    this.SendMailObject.smtpOptions.useSsl = Boolean(this._configMail[0]['EmailServerEnable_SSL']);
    this.SendMailObject.smtpOptions.port = Number(this._configMail[0]['EmailServerPort']);
    this.SendMailObject.smtpOptions.user = this._configMail[0]['EmailAccountName']; //localStorage.getItem(SystemConstants.CURRENT_USERNAME).replace(/"/gi,'');
    this.SendMailObject.smtpOptions.password = this._configMail[0]['usc'];

    if (this.data != undefined){
      let file = {source: '', des: ''};
      file.des = '/' + this.data['ProductCostId'] +'/10.Don_Dat_Hang_Mua/'+ this.data['Id'] + '/'+this.data['DocNo'].replace(/\//gi,'-') + '.pdf';
      file.source = '/3.Mau_In/BienBan_QuyetToan_ThanhLy.docx';

      this.SendMailObject.files.push(file);

      if (this.data['Id']){
        const params = new Array<ParameterContract>();
        const param1 = new ParameterContract();
    
        param1.ParameterName = Global.convertParameterName('Id');
        param1.ParameterValue = this.data['Id'];
        params.push(param1);
    
        let _data = await this.srv.getDataOutput(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_B30BizDoc_VoucherForm', params)
          .toPromise().then();
        
        this.SendMailObject.replacement = _data['output']
      }
    }
  }
  }

  async SendMail() {
    this.SendMailObject.from = this.inputEmail['nativeElement'].value;
    //this.SendMailObject.smtpOptions.password = this.inputPassword['nativeElement'].value; 
    this.SendMailObject.to = this.inputTo['nativeElement'].value;
    this.SendMailObject.cc = this.inputCC['nativeElement'].value; 
    this.SendMailObject.bcc = this.inputBCC['nativeElement'].value;
    this.SendMailObject.subject = this.inputSubject['nativeElement'].value; 
    this.SendMailObject.plainTextMessage = this.inputplainTextMessage['nativeElement'].value;
  
    // let data = {
    //   to: 'khoannt@bravo.com.vn',
    //   cc: 'quydv@bravo.com.vn',
    //   bcc: 'duongnht@bravo.com.vn',
    //   from: 'khoannt@bravo.com.vn',
    //   subject: 'Test send mail',
    //   plainTextMessage: 'test',
    //   htmlMessage: `Ahihi`,
    //   files: [
    //     { source: '/3.Mau_In/BienBan_QuyetToan_ThanhLy.docx', des: '/PROD001864/10.Don_Dat_Hang_Mua/211/1.pdf' },
    //   ],
    //   smtpOptions: {
    //     server: "mail.bravo.com.vn",
    //     user: "khoannt",
    //     password: "BravoKit@162",
    //     port: 25,
    //     useSsl: false
    //   },
    //   replacement: null}
   
    const sub = await this.srv.sendMail(Global.MailEndPoint,this.SendMailObject).subscribe();
    
    this.subscription.add(sub);

    this.popup.hide();    
  }

  closeForm()
  {
    this.popup.hide();
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
