export class ColumnContract {
    ColumnName: string;
    DataType: string;
    MaxLength: number;
    DefaultValue: any;

    constructor(options?: any) {
      if (options) {
          for (let key in options) {
              this[key] = options[key];
          }
      }
  }
}
