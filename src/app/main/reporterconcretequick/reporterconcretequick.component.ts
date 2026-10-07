import { Component, ViewChild } from '@angular/core';

import * as wjcCore from 'wijmo/wijmo';
import * as wjcGrid from 'wijmo/wijmo.grid';
import * as wjcGridFilter from 'wijmo/wijmo.grid.filter';

import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { InputControlService } from './../../ui/input/InputControlService';
import { SystemConstants } from './../../core/common/system.constants';
import { BaseReporterService } from '../../base/base.service-reporter';
import { BaseReporterComponent } from '../_baseform/base-reporter.component';

import { LayoutData } from './reporterconcretequick.data';

@Component({
    selector: 'reporterconcretequick',
    templateUrl: './reporterconcretequick.component.html',
    styleUrls: ['./reporterconcretequick.component.css']
})

export class ReporterConcreteQuickComponent extends BaseReporterComponent {
    @ViewChild('filter') filter: wjcGridFilter.FlexGridFilter;

    _layoutDeclare: LayoutData = new LayoutData();

    productCostId: string = '';

    constructor(srv: BaseReporterService,
        ics: InputControlService,
        route: ActivatedRoute,
        router: Router, titleService: Title) {
        super(srv, ics, route, router, titleService);
        this.layoutData = this._layoutDeclare;
        this.commandKey = this._layoutDeclare.Layout[0].key;

        // Gói thầu lấy tự động, không cho chọn ở bộ lọc: ưu tiên tham số trên url (mở từ phiếu
        // kế hoạch bê tông), nếu không có thì lấy gói thầu đang chọn của phiên làm việc.
        this.productCostId = this.layGoiThau();
        this._layoutDeclare.Layout[0].ctorArg['ProductCostId'] = this.productCostId;
    }

    private layGoiThau(): string {
        if (this.paramsReport && this.paramsReport['ProductCostId'])
            return this.paramsReport['ProductCostId'];

        const luuTru = localStorage.getItem(SystemConstants.PRODUCTCOSTID);

        return luuTru ? luuTru.replace(/"/gi, '') : '';
    }

    get chuaCoGoiThau(): boolean {
        return !this.productCostId;
    }

    // Có gói thầu là chạy báo cáo luôn, không cần bấm "Chạy báo cáo".
    // Dòng nhóm / dòng tổng do SP đánh dấu bằng _FormatStyleKey (Subtotal0 / GrandTotal).
    ngAfterViewInit() {
        super.ngAfterViewInit();

        this.dinhDangLuoi();

        if (this.productCostId)
            this.chayBaoCaoKhiSanSang(0);
    }

    // 6 chỉ số tổng ở đầu báo cáo, lấy từ tham số OUTPUT của SP
    get chiSo(): any {
        return this.output ? this.output : {};
    }

    get daCoSoLieu(): boolean {
        return this.chiSo['@_TongKLBOQ'] != undefined;
    }

    // Định dạng lưới theo mẫu Excel: gộp tiêu đề cùng tên + gộp ô BOQ dọc, tô màu dòng nhóm / dòng tổng
    private dinhDangLuoi() {
        // All = gộp cả tiêu đề (BOQ, KL tính toán...) lẫn ô dữ liệu; chỉ Cells thì tiêu đề nhóm bị lặp
        this.grid.allowMerging = wjcGrid.AllowMerging.All;
        this.grid.mergeManager = new BoqMergeManager(this.grid);

        this.grid.formatItem.addHandler((s: wjcGrid.FlexGrid, e: wjcGrid.FormatItemEventArgs) => {
            if (e.panel.cellType != wjcGrid.CellType.Cell) return;
            if (s.rows[e.row] == undefined) return;

            const item = s.rows[e.row].dataItem;
            if (item == undefined) return;

            const rowLevel = item['RowLevel'];
            const binding = s.columns[e.col].binding;
            const laCotBOQ = (binding == 'QuantityBOQ' || binding == 'AmountBOQ');

            if (rowLevel == 2) {			// Dòng TỔNG
                wjcCore.setCss(e.cell, { fontWeight: 'bold', backgroundColor: '#1F4E79', color: '#ffffff' });
            }
            else if (rowLevel == 0 && !laCotBOQ) {		// Đã thực hiện / Chưa thực hiện (trừ ô BOQ đang gộp dọc)
                wjcCore.setCss(e.cell, { fontWeight: 'bold', backgroundColor: '#dbe9f5', color: '#1F4E79' });
            }
            else {
                wjcCore.setCss(e.cell, { fontWeight: '', backgroundColor: '', color: '' });
            }

            // Ô BOQ đã gộp dọc: đưa số ra giữa ô cho giống mẫu Excel
            if (laCotBOQ && rowLevel != 2)
                wjcCore.setCss(e.cell, { display: 'flex', alignItems: 'center', justifyContent: 'flex-end' });
        });
    }

    // Tiêu đề 2 tầng: cho xuống dòng và nới chiều cao để không bị cắt chữ
    itemsSourceChangedHandler(_grid: wjcGrid.FlexGrid) {
        super.itemsSourceChangedHandler(_grid);

        if (_grid != this.grid || this.grid.columnHeaders.rows.length == 0) return;

        this.grid.columnHeaders.rows.forEach(row => {
            row.wordWrap = true;
            row.height = 34;
        });
    }

    // Form (chỉ còn "Ngày báo cáo") được dựng bất đồng bộ sau khi nạp layout -> chờ form sẵn sàng
    // rồi mới chạy. ProductCostId đi theo ctorArg nên không cần gán vào form.
    private chayBaoCaoKhiSanSang(soLanThu: number) {
        const SO_LAN_TOI_DA = 20;		// 20 x 500ms = tối đa 10 giây

        setTimeout(() => {
            if (this.form) {
                if (this.form.valid)
                    this.onSubmit(this.form);
            }
            else if (soLanThu < SO_LAN_TOI_DA) {
                this.chayBaoCaoKhiSanSang(soLanThu + 1);
            }
        }, 500);
    }
}

// Cột BOQ là số của cả dự án nên gộp thành 1 ô dọc như mẫu Excel; dòng TỔNG (RowLevel = 2)
// đứng riêng, các cột khác không gộp.
class BoqMergeManager extends wjcGrid.MergeManager {
    getMergedRange(panel: wjcGrid.GridPanel, r: number, c: number, clip: boolean = true): wjcGrid.CellRange {
        if (panel.cellType != wjcGrid.CellType.Cell)
            return super.getMergedRange(panel, r, c, clip);

        const binding = panel.columns[c].binding;

        if (binding != 'QuantityBOQ' && binding != 'AmountBOQ')
            return null;

        const item = panel.rows[r].dataItem;

        if (item == undefined || item['RowLevel'] == 2)
            return null;

        let r1 = r, r2 = r;

        while (r1 > 0 && this.cungNhom(panel, r1 - 1, binding, item))
            r1--;

        while (r2 < panel.rows.length - 1 && this.cungNhom(panel, r2 + 1, binding, item))
            r2++;

        return new wjcGrid.CellRange(r1, c, r2, c);
    }

    private cungNhom(panel: wjcGrid.GridPanel, r: number, binding: string, item: any): boolean {
        const other = panel.rows[r].dataItem;

        return other != undefined && other['RowLevel'] != 2 && other[binding] == item[binding];
    }
}
