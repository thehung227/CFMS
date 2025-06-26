export enum BravoCtorEnum{
    Table = 1,
    StoreProcedure = 2,
    View = 3,
    Function = 4
}

export enum DataRowState{
    Detached = 1,
    Unchanged = 2,
    Added = 4,
    Deleted = 8,
    Modified = 16
}