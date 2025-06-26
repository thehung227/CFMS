import { InputBase } from './InputBase';

export class DateBoxInput extends InputBase<Date>{
    controlType = 'date';
    type = 'date';
    format: string = 'dd/MM/yyyy';
    mask: string = '99/99/9999';

    constructor(options: {} = {}){
        super(options);
        this.type = options['type'] || '';
        this.format = options['format'] || '';
        this.mask = this.format ? this.format.replace(/d|M|y/g, '9'): '99/99/9999';
    }
}
