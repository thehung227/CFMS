import { InputBase } from './../input/InputBase';

export class PanelBase {
    label: string;
    col: number;
    row: number;
    controls: InputBase<any>[];
    order: number;
    className: string;

    constructor(options: {
        label?: string,
        col?: number,
        row?: number,
        controls?: InputBase<any>[],
        order?: number,
        className?: string
    } = {}){
        this.label = options.label || '';
        this.col = options.col || 1;
        this.row = options.row || 1;
        this.controls = options.controls;
        this.order = options.order || 1;
        this.className = options.className || '';
        this.className +=' col-md-' + options.col || '' ;
    }
}