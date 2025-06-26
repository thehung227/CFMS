import { ColumnContract } from './column.contract'
import { RowContract } from './row.contract'

export class TableContract {
    TableName: string;
    Columns: ColumnContract[];
    Rows: RowContract[];

    constructor(name: string) {
        this.TableName = name;
        this.Columns = new Array<ColumnContract>();
        this.Rows = new Array<RowContract>();
    }
}