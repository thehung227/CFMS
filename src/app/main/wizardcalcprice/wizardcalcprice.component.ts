import { ActivatedRoute, Router } from "@angular/router";
import { PanelControlService } from "../../ui/panel/PanelControlService";
import { ElementRef, Component } from "@angular/core";
import { Title } from "@angular/platform-browser";
// import { BaseWizardComponent } from "../_baseform/base-wizzard.component";
import { LayoutData } from "./wizardcalcprice.data";
import { BaseService } from "../../base/base.service";
import { BaseWizardComponent } from "../_baseform/base-wizard.component";
import { BaseWizardService } from "../../base/base.service-wizard";



@Component({
    selector: 'wizardcalcprice',
    templateUrl: './wizardcalcprice.component.html',
    styleUrls: ['./wizardcalcprice.component.css']
})
export class WizardCalcPriceComponent extends BaseWizardComponent {
    
    constructor( _service: BaseWizardService,
         route: ActivatedRoute,
         pcs: PanelControlService,
         elRef: ElementRef,
         router: Router,
         titleService: Title
    ) {
        super(_service,route,pcs,elRef,router,titleService);
        this._layoutDeclare = LayoutData.Layout;
        this._columnChangeChild = LayoutData.ColumnChangedChild;
        this._evaluator = LayoutData.Evaluators;
        this._serverConstraint = LayoutData.ServerConstraint;
        this.zCommandKey = LayoutData.Layout[0].key;
    }
}
