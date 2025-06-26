import { InputBase } from './InputBase';

export class CheckBoxInput extends InputBase<string>{
    controlType = 'checkbox';
    type = 'boolean';

    constructor(options: {} = {}){
        super(options);
        this.type = options['type'] || '';
    }
}