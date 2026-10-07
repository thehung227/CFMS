import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import * as wjcCore from 'wijmo/wijmo';

import { BaseReporterService } from '../../base/base.service-reporter';
import { ParameterContract } from '../../contracts/parameter.contract';
import { BravoCtorEnum } from '../../core/enum/type.enum';
import { Global } from '../../shared/global';
import { ExcelTongHopDamPhan } from './reportertonghopdamphan.excel';

// Tổng hợp đàm phán mua hàng tập trung (mẫu "TONG HOP_Rev10").
// Không dùng BaseReporterComponent: báo cáo gồm 3 bảng HTML tự dựng (2 bảng tổng hợp + bảng chi tiết
// cột động theo mã gói thầu CC). SP: dbo.usp_Kct_TongHopDamPhanMuaHang (database/tonghopdamphanmuahang/)
// trả 5 recordset: [0] BD theo tình trạng x miền, [1] hiệu quả đàm phán, [2] cột động, [3] dòng, [4] ô.
const COMMAND = 'usp_Kct_TongHopDamPhanMuaHang';

interface ICot { ColOrder: number; ItemGroupCode: string; ColName: string; }

@Component({
    selector: 'reportertonghopdamphan',
    templateUrl: './reportertonghopdamphan.component.html',
    styleUrls: ['./reportertonghopdamphan.component.css']
})
export class ReporterTongHopDamPhanComponent implements OnInit {
    // Điều kiện lọc
    docDate: string = this.toInputDate(new Date());
    tinhTrang: number = 1;
    chiTiet: number = 1;
    mucChenhLech: number = 0.2;

    readonly dsTinhTrang = [
        { value: 1, text: 'Toàn bộ', note: 'Gồm đã/đang/chưa đàm phán' },
        { value: 2, text: 'Còn lại', note: 'Chỉ các gói đang/chưa đàm phán (loại gói "Đã chốt")' }
    ];
    readonly dsChiTiet = [
        { value: 1, text: 'Đầy đủ thông tin', note: 'Ra tất cả các dòng' },
        { value: 2, text: 'Rút gọn - Gói thầu', note: 'Dòng 1, 2, 4, 5' },
        { value: 3, text: 'Rút gọn - Giá trị', note: 'Dòng 1, 4, 7, 8' },
        { value: 4, text: 'Rút gọn - Chỉ BD', note: 'Chỉ lấy dòng 1' },
        { value: 5, text: 'Rút gọn - Kế hoạch và BCTC', note: 'Dòng 1, 9, 10, 11' }
    ];
    readonly dsMucChenhLech = [0.2, 0.3, 0.5];

    // Kết quả
    showLoading = false;
    daChay = false;
    loi = '';
    ngayBaoCao = '';
    tongHop: any[] = [];
    hieuQua: any[] = [];
    cots: ICot[] = [];
    dongs: any[] = [];
    private o: { [rowNo: number]: { [code: string]: any } } = {};

    constructor(private srv: BaseReporterService, titleService: Title) {
        titleService.setTitle('Tổng hợp đàm phán mua hàng tập trung');
    }

    ngOnInit() {
        this.chayBaoCao();
    }

    async chayBaoCao() {
        if (!this.docDate) {
            alert('Chọn Ngày báo cáo');
            return;
        }

        const params = new Array<ParameterContract>();
        const them = (name: string, value: any) => {
            const p = new ParameterContract();
            p.ParameterName = Global.convertParameterName(name);
            p.ParameterValue = value;
            params.push(p);
        };
        them('DocDate', this.docDate);
        them('TinhTrang', this.tinhTrang);
        them('ChiTiet', this.chiTiet);
        them('MucChenhLech', this.mucChenhLech);

        this.showLoading = true;
        this.loi = '';
        try {
            const res = await this.srv.getMultiDataOutput(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, COMMAND, params)
                .toPromise();
            const data = res['data'] || [];

            this.tongHop = data[0] || [];
            this.hieuQua = data[1] || [];
            this.cots = data[2] || [];
            this.dongs = this.danhDauGopDong(data[3] || []);

            this.o = {};
            for (const c of (data[4] || [])) {
                (this.o[c.RowNo] = this.o[c.RowNo] || {})[c.ItemGroupCode] = c;
            }

            this.ngayBaoCao = (res['output'] && res['output']['@_DocDateStr']) || this.docDate;
            this.daChay = true;
        } catch (ex) {
            this.loi = 'Không chạy được báo cáo: ' + ((ex && ex.message) || ex);
        } finally {
            this.showLoading = false;
        }
    }

    // Dòng đầu mỗi gói thầu mang rowspan cho các cột STT / Tên ngắn dự án
    private danhDauGopDong(dongs: any[]): any[] {
        for (let i = 0; i < dongs.length; i++) {
            const d = dongs[i];
            d._span = 0;
            if (d.RowType != 'CHITIET') continue;
            if (i > 0 && dongs[i - 1].RowType == 'CHITIET' && dongs[i - 1].STT == d.STT && dongs[i - 1].Mien == d.Mien) continue;

            let n = 1;
            while (i + n < dongs.length && dongs[i + n].RowType == 'CHITIET' && dongs[i + n].STT == d.STT && dongs[i + n].Mien == d.Mien) n++;
            d._span = n;
        }
        return dongs;
    }

    o_(dong: any, cot: ICot): any {
        const r = this.o[dong.RowNo];
        return r ? r[cot.ItemGroupCode] : null;
    }

    hienThi(kind: string, value: any, dash?: boolean): string {
        if (value === null || value === undefined || value === '') return '';
        if (kind == 'P') return wjcCore.Globalize.format(+value, 'p1');
        if (kind == 'N') return (+value == 0 && dash) ? '–' : wjcCore.Globalize.format(+value, 'n0');
        return value;
    }

    hienThiO(dong: any, cot: ICot): string {
        const c = this.o_(dong, cot);
        if (!c) return '';
        if (c.Txt) return c.Txt;
        return this.hienThi(dong.Kind, c.Num, dong.RowType != 'CHITIET');
    }

    lopO(dong: any, cot: ICot): string {
        const c = this.o_(dong, cot);
        return c && c._Style ? 'st-' + c._Style : '';
    }

    lopDong(dong: any): string {
        switch (dong.RowType) {
            case 'TONG_KH': case 'TONG_BCTC': return 'r-tong';
            case 'MIEN_KH': case 'MIEN_BCTC': return 'r-mien';
        }
        let s = dong.ItemNo == 1 ? 'r-bd' : '';
        if (dong.IsTre) s += ' r-tre';
        if (dong._span) s += ' r-dau';
        return s;
    }

    textOf(list: any[], value: any): string {
        const x = list.find(i => i.value == value);
        return x ? x.text : '';
    }

    // Kết xuất file .xlsx: giữ màu và dùng công thức Excel thay cho số chết ở các ô tính được
    ketXuat() {
        new ExcelTongHopDamPhan(this).save('Tong_hop_dam_phan_mua_hang_' + this.docDate.replace(/-/g, '') + '.xlsx');
    }

    private toInputDate(d: Date): string {
        const p = (n: number) => (n < 10 ? '0' : '') + n;
        return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
    }
}

