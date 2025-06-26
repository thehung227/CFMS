import { InputBase } from './InputBase';

export class RichTextBoxInput extends InputBase<string>{
    controlType = 'richtextbox';
    type = 'string';
    isUsingLabel = true;
    
    constructor(options: {} = {}){
        super(options);
    }
}
