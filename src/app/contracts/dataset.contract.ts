import { TableContract } from './table.contract';

export class DataSetContract {
    DataSetName: string = '';
    Tables: TableContract[];

    constructor() {
        this.DataSetName = '';
        this.Tables = new Array<TableContract>();
    }
}