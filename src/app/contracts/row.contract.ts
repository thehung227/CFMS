import { DataRowState } from './../core/enum/type.enum';

export class RowContract {
    RowState: DataRowState = DataRowState.Detached;
    CurrentItems: any[];
    OriginalItems: any[];

    constructor() {
        this.RowState = DataRowState.Detached;
        this.CurrentItems = new Array<any>();
        this.OriginalItems = new Array<any>();
    }
}