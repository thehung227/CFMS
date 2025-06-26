import { InputBase } from './InputBase';

export class NumberBoxInput extends InputBase<number>{
    controlType = 'number';
    type = 'number';
    format:string;
    step: number;
    min: number;
    max: number;
    constructor(options: {} = {}){
        super(options);
        this.format = options['format'] || '';
        this.step = options['step'];
        this.min = options['min'];
        this.max = options['max'];
    }
}
