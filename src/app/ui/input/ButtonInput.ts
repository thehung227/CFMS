import { InputBase } from './InputBase';

export class ButtonInput extends InputBase<string>{
    controlType = 'button';
    isUsingLabel = false;

    constructor(options: {} = {}){
        super(options);
    }
}