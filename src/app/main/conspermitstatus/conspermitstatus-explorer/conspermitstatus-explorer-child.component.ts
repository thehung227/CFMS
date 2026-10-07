import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import * as wjcCore from 'wijmo/wijmo';
import * as wjcGrid from 'wijmo/wijmo.grid';
import { Popup } from 'wijmo/wijmo.input';

import { BaseExplorerService } from '../../../base/base.service-explorer';
import { InputControlService } from '../../../ui/input/InputControlService';
import { Global } from '../../../shared/global';
import { SystemConstants } from '../../../core/common/system.constants';

import { LayoutConsPermitStatusExplorer } from '../Layout';

/**
 * Lưới con bung ra dưới mỗi dòng của màn hình danh sách: tiến trình duyệt của
 * hồ sơ (khai báo ở layout.Structure.Child + childGrid trong Layout.ts).
 *
 * Bấm biểu tượng thư mục ở đầu dòng để mở màn hình duyệt tương ứng.
 */
@Component({
    selector: 'conspermitstatus-explorer-child',
    templateUrl: './conspermitstatus-explorer-child.html'
})
export class ConsPermitStatusExplorerChildComponent implements OnInit, OnDestroy {

    @ViewChild('gridChild') gridChild: wjcGrid.FlexGrid;
    @ViewChild('frmPopupTooltip') frmPopupTooltip: Popup;
    @ViewChild('contentPopupTooltip') contentPopupTooltip: string;

    pathPage = ['/main', 'approvedconspermitstatus', 'detail'];
    _layoutDeclare: LayoutConsPermitStatusExplorer = new LayoutConsPermitStatusExplorer();

    datachild: wjcCore.CollectionView;
    zChildTableName: string = '';

    constructor(private _service: BaseExplorerService,
        protected router: Router,
        protected ics: InputControlService) {
        this.zChildTableName = this._layoutDeclare.layout.Structure.Child.Name;
    }

    ngOnInit() {
        this.gridChild.autoGenerateColumns = false;
        this.gridChild.isReadOnly = true;
        this.gridChild.selectionMode = wjcGrid.SelectionMode.RowRange;
        this.gridChild.allowSorting = false;
        this.gridChild.rows.defaultSize = 25;

        this.createColumnGroups(this.gridChild, this._layoutDeclare.childGrid, 0);

        this.doubleClickGrid(this.gridChild, this.pathPage);
        this.dbClickCellContent(this.gridChild);
    }

    ngAfterViewInit() {
        this.fetchDataChild();
    }

    ngOnDestroy() {
    }

    /** Nạp bước duyệt của đúng hồ sơ vừa được bung ra. */
    fetchDataChild() {
        let filterChild = this._layoutDeclare.layout.Structure.Child.ChildKey +
            "='" + localStorage.getItem(SystemConstants.EXPLORER_PARRENTKEY_VALUE) + "'";

        this._service.fetchDataSelect(Global.DataExplorerEndpoint, this.zChildTableName, filterChild, 1, 50,
            this._layoutDeclare.layout.Structure.Child.OrderBy)
            .subscribe(data => {
                this.gridChild.itemsSource = new wjcCore.CollectionView(data);
                this.datachild = new wjcCore.CollectionView(data);
            });
    }

    createColumnGroups(flex: wjcGrid.FlexGrid, columnGroups: any, level: number) {
        var colHdrs = flex.columnHeaders;

        if (level >= colHdrs.rows.length) {
            colHdrs.rows.splice(colHdrs.rows.length, 0, new wjcGrid.Row());
        }

        for (var i = 0; i < columnGroups.length; i++) {
            var group = columnGroups[i];
            if (!group.columns) {
                var col = new wjcGrid.Column();

                for (var prop in group) {
                    if (prop in col) {
                        col[prop] = group[prop];
                    }
                }

                flex.columns.push(col);
                colHdrs.setCellData(level, colHdrs.columns.length - 1, group.header);
            }
            else {
                var colIndex = colHdrs.columns.length;
                this.createColumnGroups(flex, group.columns, level + 1);

                for (var j = colIndex; j < colHdrs.columns.length; j++) {
                    colHdrs.setCellData(level, j, group.header);
                }
            }
        }
    }

    /** Chặn double-click trên lưới con (chỉ mở hồ sơ qua biểu tượng đầu dòng). */
    doubleClickGrid(grid: wjcGrid.FlexGrid, navigateUrl: any[]) {
        localStorage.removeItem(SystemConstants.ALLOW_DBLCLICK);
        localStorage.setItem(SystemConstants.ALLOW_DBLCLICK, 'false');

        grid.hostElement.addEventListener('dblclick', function (e: Event) {
            e.preventDefault();
        });
    }

    /** Đọc giá trị localStorage, bỏ dấu nháy kép; trả về '' nếu chưa có. */
    private readStorage(key: string): string {
        let value = localStorage.getItem(key);
        return value ? value.replace(/"/gi, '') : '';
    }

    /** Mở màn hình duyệt của bước duyệt đang chọn, kèm kiểm tra thứ tự duyệt. */
    openGridChild(grid: wjcGrid.FlexGrid, navigateUrl: any[]) {
        let self = this;

        if (!grid.selectedRows || grid.selectedRows.length == 0) return;

        let row = grid.selectedRows[0];
        let item = row ? row.dataItem : null;
        if (item == null) return;

        let isAdmin = localStorage.getItem(SystemConstants.CURRENT_ISSYSADMIN) == 'true';
        let employeeCode = this.readStorage(SystemConstants.CURRENT_EMPLOYEE);
        let positionCode = this.readStorage(SystemConstants.POSITION_EMPLOYEE);

        if (isAdmin
            || (employeeCode != '' && item['EmployeeCode'] == employeeCode)
            || (positionCode != '' && item['PositionCode'] == positionCode)) {

            let i = row._idx;

            if (!isAdmin && grid.rows[i + 1] != undefined
                && grid.rows[i + 1].dataItem != null && grid.rows[i + 1].dataItem['ApproveStatus'] == 1) {
                alert('Hồ sơ đã được duyệt ở cấp bậc trên, không thể duyệt lại!');
            }
            else if (!isAdmin && grid.rows[i - 1] != undefined
                && grid.rows[i - 1].dataItem != null && grid.rows[i - 1].dataItem['ApproveStatus'] == 0) {
                alert('Hồ sơ chưa được duyệt ở cấp bậc dưới, không thể duyệt!');
            }
            else {
                // concat thay vì push: không làm thay đổi mảng được truyền vào,
                // tránh URL bị nối dồn nếu hàm được gọi nhiều lần.
                self.router.navigate(navigateUrl.concat([item['Id']]));
            }
        }
        else {
            alert('Người sử dụng hiện thời không có quyền truy cập.');
        }
    }

    /** Double-click một ô để xem toàn bộ nội dung (cột "Ý kiến"). */
    dbClickCellContent(flex: wjcGrid.FlexGrid) {
        let pop = this.frmPopupTooltip;

        if (!flex.isReadOnly) return;

        let host = flex.hostElement;

        host.addEventListener('dblclick', () => {
            var sel = flex.selection;
            let _content = flex.getCellData(sel.row, sel.col, true);

            this.contentPopupTooltip['nativeElement'].innerHTML = _content;
            pop.show();
        });
    }
}
