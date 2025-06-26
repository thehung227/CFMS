import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators, ValidatorFn } from '@angular/forms';

import { InputBase } from './InputBase';
import { TextBoxInput } from './TextBoxInput';
import { DateBoxInput } from './DateBoxInput';
import { MultiSelectInput } from './MultiSelectInput';
import { NumberBoxInput } from './NumberBoxInput';
import { UploadInput } from './UploadInput';
import { LookupBoxInput } from './LookupBoxInput';

@Injectable()
export class InputControlService {
    constructor() { }

    toFormGroup(inputs: InputBase<any>[], data?: {}) {
        let group: any = {};
        let today = new Date();
        let date = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
        let defaultValue: any;

        inputs.forEach(control => {

            if (!control.value) {
                switch (control.controlType) {
                    case 'date':
                        defaultValue = date;
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
            group[control.key] = control.validators != undefined ?
                new FormControl(defaultValue, control.validators)
                : new FormControl(defaultValue);
        });

        return new FormGroup(group);
    }

    buildValidator(list: any) {
        let result: ValidatorFn[] = [];
        for (let i in list) {
            if (i == 'required') {
                result.push(Validators.required);
                continue;
            }
            if (i == 'minlength') {
                result.push(Validators.minLength(list[i]))
            }
        }
        return result;
    }

    updateValueForm(controls: InputBase<any>[], form: FormGroup, data: {}) {
        for (let j in controls) {

            let control = controls[j];
            try {
                if (data[control.key] != undefined)
                    
                    if (control instanceof DateBoxInput) {

                        if (data[control.key]== (new Date(Date.UTC(1900, 0, 1))).toISOString())
                            continue;
                        else
                            form.controls[control.key].setValue(data[control.key]);

                    } else if (control instanceof MultiSelectInput) {
                        //200118: Dương fix filter F3
                        if (control.lookupfilter.indexOf('{EXPR=') > 0)
                            control.lookupfilterCurrent = '';
                        else
                            control.lookupfilterCurrent = control.translate_expr(control.lookupfilter, data);
                        control.getLookupData('^' + data[control.key], false).then(() => {
                            if (control instanceof MultiSelectInput) {
                                if (control.selectedItems.length > 0) {
                                    // this.form.get(control.key).reset();
                                    form.controls[control.key].setValue(control.selectedItems, { onlySeft: true, emitEvent: false });

                                }
                            }
                        });
                    } else if (control instanceof NumberBoxInput) {
                        form.controls[control.key].setValue(Number(data[control.key]));
                    } else if (control instanceof LookupBoxInput) {
                        if (control.lookupfilter.indexOf('{EXPR=') > 0)
                            control.lookupfilterCurrent = '';
                        else
                            control.lookupfilterCurrent = control.translate_expr(control.lookupfilter, data);
                        control.getLookupData(data[control.key], true).then(() => {

                        });
                    } else {
                        form.controls[control.key].setValue(data[control.key]);
                    }

            }
            catch (e) {
            }
        }
    }
}
