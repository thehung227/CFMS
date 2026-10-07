import * as wjcGrid from 'wijmo/wijmo.grid';

/**
 * Tiện ích phân giải dòng lưới (FlexGrid) -> record dữ liệu.
 *
 * Bối cảnh: rất nhiều chỗ trong framework dùng CHỈ SỐ DÒNG CỦA LƯỚI (e.row / args.row)
 * làm CHỈ SỐ VÀO MẢNG itemsSource.sourceCollection. Đẳng thức này chỉ đúng khi
 * CollectionView không group / không sort / không filter.
 *
 * Khi bật group, Wijmo chèn GroupRow vào flex.rows nhưng những dòng đó không tồn tại
 * trong sourceCollection => lệch chỉ số => đọc/ghi nhầm record, hoặc undefined -> TypeError.
 *
 * Quy ước: MỌI tham số rowIndex trong file này là CHỈ SỐ DÒNG CỦA LƯỚI (grid row index),
 * cùng không gian chỉ số với flex.setCellData / flex.rows.
 */
export class GridRowUtil {

  /** Row object an toàn; null nếu grid chưa render hoặc index ngoài phạm vi. */
  static rowOf(flex: wjcGrid.FlexGrid, rowIndex: number): wjcGrid.Row {
    if (!flex || !flex.rows) return null;
    if (rowIndex == null || rowIndex < 0 || rowIndex >= flex.rows.length) return null;
    return flex.rows[rowIndex];
  }

  /** true nếu dòng là GroupRow (dòng tiêu đề nhóm, không có record dữ liệu). */
  static isGroupRow(flex: wjcGrid.FlexGrid, rowIndex: number): boolean {
    return GridRowUtil.rowOf(flex, rowIndex) instanceof wjcGrid.GroupRow;
  }

  /**
   * Record thật của một dòng lưới.
   * Trả về null khi: index sai, dòng nhóm (GroupRow), hoặc dòng "thêm mới" chưa addNew.
   */
  static itemOf(flex: wjcGrid.FlexGrid, rowIndex: number): any {
    let row = GridRowUtil.rowOf(flex, rowIndex);
    if (row == null || row instanceof wjcGrid.GroupRow) return null;
    return row.dataItem != null ? row.dataItem : null;
  }

  /**
   * Bản dùng trong handler formatItem / cellEditEnding: lấy rows từ chính panel của event
   * thay vì từ flex (an toàn hơn khi event đến từ panel phụ).
   */
  static itemOfArgs(args: any): any {
    if (!args || !args.panel || !args.panel.rows) return null;
    let rows = args.panel.rows;
    let rowIndex = args.row;
    if (rowIndex == null || rowIndex < 0 || rowIndex >= rows.length) return null;
    let row = rows[rowIndex];
    if (row == null || row instanceof wjcGrid.GroupRow) return null;
    return row.dataItem != null ? row.dataItem : null;
  }

  /** record -> CHỈ SỐ DÒNG CỦA LƯỚI; -1 nếu không tìm thấy. */
  static rowIndexOf(flex: wjcGrid.FlexGrid, item: any): number {
    if (!flex || !flex.rows || item == null) return -1;
    for (let i = 0; i < flex.rows.length; i++) {
      let row = flex.rows[i];
      if (!(row instanceof wjcGrid.GroupRow) && row.dataItem === item) return i;
    }
    return -1;
  }

  /** CHỈ SỐ DÒNG CỦA LƯỚI -> chỉ số trong sourceCollection; -1 nếu không map được. */
  static toSourceIndex(flex: wjcGrid.FlexGrid, rowIndex: number): number {
    let item = GridRowUtil.itemOf(flex, rowIndex);
    if (item == null) return -1;
    let cv: any = flex.itemsSource;
    let src = (cv && cv.sourceCollection) ? cv.sourceCollection : cv;
    return (src && src.indexOf) ? src.indexOf(item) : -1;
  }

  /**
   * setCellData theo record thay vì theo chỉ số.
   * Dùng khi giữa lúc đọc và lúc ghi có await/refresh xen vào (dòng có thể đã dịch chuyển).
   */
  static setCellDataByItem(flex: wjcGrid.FlexGrid, item: any, colIndex: number, value: any): boolean {
    if (!flex || item == null) return false;
    let rowIndex = GridRowUtil.rowIndexOf(flex, item);
    if (rowIndex >= 0) return flex.setCellData(rowIndex, colIndex, value);

    // Dòng không còn trên lưới (bị group/sort đẩy đi): ghi thẳng vào record.
    let col = flex.columns ? flex.columns[colIndex] : null;
    if (col && col.binding) {
      item[col.binding] = value;
      flex.invalidate();
      return true;
    }
    return false;
  }

  /** true nếu một trong các cột đang là khoá group của CollectionView. */
  static affectsGrouping(flex: wjcGrid.FlexGrid, bindings: string[]): boolean {
    let cv: any = flex ? flex.collectionView : null;
    if (!cv || !cv.groupDescriptions || !cv.groupDescriptions.length) return false;
    if (!bindings || !bindings.length) return false;
    for (let i = 0; i < cv.groupDescriptions.length; i++) {
      let gd: any = cv.groupDescriptions[i];
      if (gd && bindings.indexOf(gd.propertyName) > -1) return true;
    }
    return false;
  }

  /** true nếu CollectionView của lưới đang bật group. */
  static hasGrouping(flex: wjcGrid.FlexGrid): boolean {
    let cv: any = flex ? flex.collectionView : null;
    return !!(cv && cv.groupDescriptions && cv.groupDescriptions.length > 0);
  }
}
