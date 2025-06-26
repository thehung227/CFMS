import { InputBase } from './InputBase';

export class TextBoxInput extends InputBase<string>{
    controlType = 'textbox';
    type = 'string';
    mask:string;
    constructor(options: {} = {}){
        super(options);
        this.type = options['type'] || '';
        this.mask = options['mask'] || '';
        
    }
}