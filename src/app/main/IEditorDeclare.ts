import { PanelBase } from "../ui/panel/PanelBase";

export interface IEditorFormulaDeclaration {
  evaluators: any;
  buttonCommand: string[];
  buttonLoadChild: string[];
  serverConstraint: string[];
  serverUpdated:string[];
  serverUpdating: string[];
  columnChanged: any;
  columnsReadOnly: string[];
  layout: any;
  panels: PanelBase[];
//   childColumns: { 
//     header?: string,
//     binding?: string,
//     dataType?: string,
//     format?: string,
//     width?: number
// }[];
  linkReporter: any;
}
