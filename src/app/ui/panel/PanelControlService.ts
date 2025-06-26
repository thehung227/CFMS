import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { PanelBase } from './PanelBase';
import { MultiSelect } from 'wijmo/wijmo.input';
import { MultiSelectInput } from '../input/MultiSelectInput';
import { Global } from '../../shared/global';

@Injectable()
export class PanelControlService {
    toFormGroup(panels: PanelBase[]) {
        let group: any = {};
        let today = new Date();
        let date = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
        let defaultValue: any;

        panels.forEach(panel => {
            if (panel && panel.controls.length > 0) {
                panel.controls.forEach(control => {
                    if (!control.value) {
                        switch (control.controlType) {
                            case 'date':
                                defaultValue = null;
                                break;
                            case 'textbox':
                                defaultValue = '';
                                break;
                            case 'multiselect':
                                defaultValue = [];
                                break;
                            case 'checkbox':
                                defaultValue = false;
                                break;
                            case 'number':
                                defaultValue = 0;
                                break;
                            default:
                                defaultValue = ''
                        }
                    }
                    else {
                        if (control.controlType == 'multiselect') {
                            defaultValue = [];
                        } else {
                            defaultValue = control.value;
                        }
                    }
                    if (control.validators != undefined) {
                        if (control.controlType == 'multiselect') {
                            group[control.key] = new FormControl(defaultValue, control.validators);
                        } else {
                            group[control.key] = new FormControl(defaultValue, control.validators);
                        }
                    } else {
                        group[control.key] = new FormControl(defaultValue);

                    }
                });
            }
        });
        return new FormGroup(group);
    }


}
