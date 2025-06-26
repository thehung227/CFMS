import { Validators, ValidatorFn } from "@angular/forms";

export class InputBase<T>{
  value: T;
  key: string;
  label: string;
  validators: any[]
  controlType: string;
  class: string;
  col: number;
  row: number;
  order: number;
  className: string;
  isUsingLabel: boolean;
  isReadOnly: string;
  style: string;
  isDisabled: string;
  labelStyle: string;
  inputStyle: string;
  labelCol: number;
  visible: string;
  element: any;
  isNewRow = false;
  styleLabel: string;

  constructor(options: {
    value?: T,
    key?: string,
    label?: string,
    validators?: any[],
    controlType?: string,
    class?: string,
    order?: number,
    col?: number,
    row?: number,
    isUsingLabel?: true,
    visible?: string,
    isReadOnly?: string,
    style?: string,
    isDisabled?: string,
    labelCol?: number,
    isNewRow?: boolean;
    styleLabel?: string;

  } = {}) {
    this.value = options.value;
    this.key = options.key || '';
    this.label = options.label || '';
    this.validators = options.validators;
    this.order = options.order === undefined ? 1 : options.order;
    this.controlType = options.controlType || '';
    this.class = options.class || '';
    this.col = options.col || 1;
    this.row = options.row || 1;
    this.isReadOnly = options.isReadOnly || '';
    this.isDisabled = options.isDisabled || '';
    this.isUsingLabel = options.isUsingLabel || true;
    this.styleLabel = options.styleLabel || '';
    this.visible = options.visible || '';
    this.style = options.style || '';
    this.className = options.isUsingLabel ? 'form-group-custom' + ' col-md-' + options.col + ' col-xs-12' :
      'form-group-custom ' + ' col-md-' + options.col + ' col-xs-12 row' ;
    this.labelCol = options.labelCol || 4;
    this.isNewRow = options.isNewRow === undefined ? false : options.isNewRow;
    this.labelStyle = 'form-group-custom-label col-md-' + this.labelCol * (6 / this.col) + ' col-xs-' + this.labelCol;
    if (this.isUsingLabel)
      this.inputStyle = 'col-xs-' + (12 - this.labelCol) + ' col-md-' + (12 - (this.labelCol * (6 / this.col)));
    else
      this.inputStyle = 'col-xs-' + (12 - this.labelCol) + ' col-md-12'
  }
}
