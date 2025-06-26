import { InputBase } from './InputBase';

export class DropDownInput extends InputBase<string>{
    controlType = 'dropdown';
    options: {key: string, value: string}[]= [];

    constructor(options: {} = {}){
        super(options);
        this.options = options['options'] || [];
    }
}