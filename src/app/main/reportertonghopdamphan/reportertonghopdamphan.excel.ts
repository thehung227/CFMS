import * as wjcXlsx from 'wijmo/wijmo.xlsx';

// Dữ liệu báo cáo đã chạy (ReporterTongHopDamPhanComponent)
export interface IBaoCaoTongHopDamPhan {
    tongHop: any[];
    hieuQua: any[];
    cots: { ItemGroupCode: string; ColName: string }[];
    dongs: any[];
    chiTiet: number;
    mucChenhLech: number;
    ngayBaoCao: string;
    dsTinhTrang: any[];
    dsChiTiet: any[];
    tinhTrang: number;
    o_(dong: any, cot: any): any;
}

// Kết xuất "Tổng hợp đàm phán mua hàng" ra .xlsx bằng wijmo.xlsx.
// Ô gốc (BD, BCTC, HĐ, %, ngày, tình trạng) ghi giá trị; các ô tính được ghi công thức:
//   - TỔNG CỘNG từng dòng      = SUM(các cột CC)
//   - Dòng 8  Hiệu quả (VNĐ)   = ROUND(BD * %, 0)            (khi có dòng 1 và 7)
//   - Dòng 10 Chênh lệch       = BCTC - BD                   (khi có dòng 1 và 9)
//   - Dòng 11 Cảnh báo         = so |chênh lệch| / BCTC với ô "Mức chênh lệch" ($D$3)
//   - Dòng miền                = SUMIF(cột TT của miền, 1 hoặc 9, cột số liệu)
//   - Dòng tổng cộng           = cộng các dòng miền
//   - Bảng tổng hợp: Cả nước = SUM(3 miền), % hiệu quả = Hiệu quả / Giá trị
// Không dùng SUBTOTAL cho dòng miền vì khối dự án xen dòng BD/BCTC/HQ/HĐ: SUBTOTAL sẽ cộng lẫn các loại số.
export class ExcelTongHopDamPhan {
    private static readonly C_STT = 0;
    private static readonly C_TEN = 1;
    private static readonly C_TT = 2;
    private static readonly C_ND = 3;
    private static readonly C_TONG = 4;
    private static readonly C_CC = 5;

    private sheet = new wjcXlsx.WorkSheet();
    private styles: { [key: string]: wjcXlsx.WorkbookStyle } = {};
    private nCot: number;

    constructor(private bc: IBaoCaoTongHopDamPhan) {
        this.nCot = bc.cots.length;
    }

    save(fileName: string) {
        const book = new wjcXlsx.Workbook();
        this.sheet.name = 'TongHop';
        book.sheets.push(this.sheet);

        this.dungCot();
        this.dungTieuDe();
        const r = this.dungTongHop(4);
        this.dungChiTiet(r + 1);

        book.save(fileName);
    }

    // ---------- Khung ----------
    private dungCot() {
        const w = (i: number, ch: number) => {
            this.sheet.columns[i] = new wjcXlsx.WorkbookColumn();
            this.sheet.columns[i].width = ch + 'ch';
        };
        w(0, 6); w(1, 16); w(2, 5); w(3, 34); w(4, 18);
        for (let i = 0; i < this.nCot; i++) w(ExcelTongHopDamPhan.C_CC + i, 17);
        const sau = ExcelTongHopDamPhan.C_CC + this.nCot;
        [20, 20, 20, 50, 16, 16].forEach((ch, i) => w(sau + i, ch));
    }

    private dungTieuDe() {
        const bc = this.bc;
        this.ghi(0, 0, 'TỔNG HỢP ĐÀM PHÁN MUA HÀNG TẬP TRUNG', 'title');
        this.ghi(1, 0, 'Ngày báo cáo: ' + bc.ngayBaoCao
            + '   |   Tình trạng đàm phán: ' + this.ten(bc.dsTinhTrang, bc.tinhTrang)
            + '   |   Chi tiết: ' + this.ten(bc.dsChiTiet, bc.chiTiet), 'italic');
        this.ghi(2, 0, 'Mức chênh lệch BCTC và kế hoạch muốn cảnh báo', 'bold');
        this.ghi(2, ExcelTongHopDamPhan.C_ND, bc.mucChenhLech, 'input-p');
    }

    // Bảng 1 (BD theo tình trạng) và bảng 2 (hiệu quả đàm phán) xếp dọc; trả về dòng trống kế tiếp
    private dungTongHop(r: number): number {
        const C = ExcelTongHopDamPhan;
        const bang = (tieuDe: string, rows: any[], kieu: (x: any) => string, laBang1: boolean) => {
            this.ghi(r, 0, tieuDe, 'th', 4);
            ['Cả nước', 'Miền Bắc', 'Miền Nam', 'Miền Trung'].forEach((t, i) => this.ghi(r, C.C_TONG + i, t, 'th'));
            const dau = r + 1;
            rows.forEach((x, i) => {
                const rr = dau + i;
                const k = 'td-' + kieu(x);
                this.ghi(rr, 0, x.NoiDung, laBang1 ? 'lb-' + x._Style : 'td', 4);
                if (k == 'td-p') {
                    // % hiệu quả = Hiệu quả (dòng Excel rr) / Giá trị gói thầu (dòng Excel rr - 1), cho cả 4 cột
                    for (let j = 0; j < 4; j++) {
                        const col = this.col(C.C_TONG + j);
                        this.cong(rr, C.C_TONG + j, `IF(N(${col}${rr - 1})=0,"",${col}${rr}/${col}${rr - 1})`, k);
                    }
                } else {
                    [x.MienBac, x.MienNam, x.MienTrung].forEach((v, j) => this.ghi(rr, C.C_TONG + 1 + j, this.so(v), k));
                    this.cong(rr, C.C_TONG, `SUM(${this.col(C.C_TONG + 1)}${rr + 1}:${this.col(C.C_TONG + 3)}${rr + 1})`, k, this.so(x.CaNuoc));
                }
            });
            r = dau + rows.length + 1;
        };

        bang('Tổng giá trị BD', this.bc.tongHop, () => 'n', true);
        bang('Hiệu quả đàm phán (Gói đã chốt)', this.bc.hieuQua, x => (x.Kind == 'P' ? 'p' : 'n'), false);
        return r;
    }

    // ---------- Bảng chi tiết ----------
    private dungChiTiet(hr: number) {
        const C = ExcelTongHopDamPhan;
        const bc = this.bc;
        const sau = C.C_CC + this.nCot;
        const lastCol = this.col(sau - 1);

        // Tiêu đề
        ['STT', 'TÊN NGẮN DỰ ÁN', 'TT', 'NỘI DUNG', 'TỔNG CỘNG'].forEach((t, i) => this.ghi(hr, i, t, 'th'));
        bc.cots.forEach((c, i) => this.ghi(hr, C.C_CC + i, c.ColName, 'th'));
        ['PTDA', 'GĐĐH', 'GĐDA', 'TÊN DỰ ÁN', 'TÊN NGẮN DA', 'TÊN NGẮN PKT'].forEach((t, i) => this.ghi(hr, sau + i, t, 'th'));
        this.sheet.rows[hr].height = 45;

        const fr = new wjcXlsx.WorkbookFrozenPane();
        fr.rows = hr + 1;
        fr.columns = C.C_TONG + 1;
        this.sheet.frozenPane = fr;

        // Vị trí dòng Excel (0-based) của từng dòng báo cáo, và khoảng dòng chi tiết của từng miền
        const viTri: { [rowNo: number]: number } = {};
        const mien: { [m: string]: { a: number; b: number } } = {};
        bc.dongs.forEach((d, i) => {
            const rr = hr + 1 + i;
            viTri[d.RowNo] = rr;
            if (d.RowType == 'CHITIET') {
                const m = mien[d.Mien] = mien[d.Mien] || { a: rr, b: rr };
                m.a = Math.min(m.a, rr);
                m.b = Math.max(m.b, rr);
            }
        });
        const coDong = (n: number) => bc.dongs.some(d => d.RowType == 'CHITIET' && d.ItemNo == n);
        const dongMien: { [type: string]: number[] } = { MIEN_KH: [], MIEN_BCTC: [] };

        bc.dongs.forEach((d, i) => {
            const rr = hr + 1 + i;
            const x = rr + 1;  // số dòng trong Excel (1-based)

            if (d.RowType != 'CHITIET') {
                const kieu = d.RowType.indexOf('TONG') == 0 ? 'tong' : 'mien';
                this.ghi(rr, 0, d.NoiDung, kieu, 4);
                for (let j = 0; j <= this.nCot; j++) {
                    const ci = C.C_TONG + j;
                    const col = this.col(ci);
                    const cell = j == 0 ? null : bc.o_(d, bc.cots[j - 1]);
                    const tinh = j == 0 ? d.TongCong : (cell ? cell.Num : null);
                    let f: string = null;

                    if (j == 0) {
                        f = `SUM(${this.col(C.C_CC)}${x}:${lastCol}${x})`;
                    } else if (d.RowType.indexOf('MIEN') == 0 && mien[d.Mien] && (d.ItemNo == 1 || coDong(9))) {
                        const m = mien[d.Mien];
                        const tt = this.col(C.C_TT);
                        f = `SUMIF($${tt}$${m.a + 1}:$${tt}$${m.b + 1},${d.ItemNo},${col}${m.a + 1}:${col}${m.b + 1})`;
                    }
                    // Dòng tổng cộng đứng trước các dòng miền -> công thức gán ở lượt cuối (khi đã biết vị trí dòng miền)
                    this.cong(rr, ci, f, kieu + '-n', this.so(tinh));
                }
                for (let j = 0; j < 6; j++) this.ghi(rr, sau + j, '', kieu);
                if (d.RowType in dongMien) dongMien[d.RowType].push(x);
                return;
            }

            // Dòng chi tiết
            const nen = d.ItemNo == 1 ? 'bd' : (d.IsTre ? 'tre' : 'td');
            if (d._span) {
                this.ghi(rr, C.C_STT, d.STT, nen + '-c').rowSpan = d._span;
                this.ghi(rr, C.C_TEN, d.TenNganDA, nen).rowSpan = d._span;
            }
            this.ghi(rr, C.C_TT, d.ItemNo, nen + '-c');
            this.ghi(rr, C.C_ND, d.NoiDung, nen);

            const kieuSo = d.Kind == 'P' ? 'p' : (d.Kind == 'N' ? 'n' : 't');
            // Dòng khác trong cùng khối dự án (để lập công thức)
            const cungKhoi = (itemNo: number) => {
                const k = bc.dongs.find(t => t.RowType == 'CHITIET' && t.Mien == d.Mien && t.STT == d.STT && t.ItemNo == itemNo);
                return k ? viTri[k.RowNo] + 1 : null;
            };
            const rBD = cungKhoi(1), rPct = cungKhoi(7), rBCTC = cungKhoi(9);

            if (d.Kind == 'N') {
                this.cong(rr, C.C_TONG, `SUM(${this.col(C.C_CC)}${x}:${lastCol}${x})`, nen + '-n', this.so(d.TongCong));
            } else {
                this.ghi(rr, C.C_TONG, '', nen);
            }

            bc.cots.forEach((c, j) => {
                const ci = C.C_CC + j;
                const col = this.col(ci);
                const cell = bc.o_(d, c);
                const lop = cell && cell._Style ? 'st-' + cell._Style : nen + '-' + kieuSo;
                let f: string = null;

                if (d.ItemNo == 8 && rBD && rPct) {
                    f = `IF(AND(ISNUMBER(${col}${rBD}),ISNUMBER(${col}${rPct})),ROUND(${col}${rBD}*${col}${rPct},0),"")`;
                } else if (d.ItemNo == 10 && rBD && rBCTC) {
                    f = `IF(AND(${col}${rBD}="",${col}${rBCTC}=""),"",N(${col}${rBCTC})-N(${col}${rBD}))`;
                } else if (d.ItemNo == 11 && rBD && rBCTC) {
                    f = `IF(${col}${rBD}="","",IF(N(${col}${rBCTC})=0,"Check lại",IF(ABS(N(${col}${rBCTC})-N(${col}${rBD}))/N(${col}${rBCTC})>$D$3,"Check lại","")))`;
                    this.cong(rr, ci, f, 'st-CHECK');
                    return;
                }

                const v = !cell ? null : (cell.Txt != null && cell.Txt !== '' ? cell.Txt : this.so(cell.Num));
                if (f) this.cong(rr, ci, f, lop, typeof v == 'number' ? v : null);
                else this.ghi(rr, ci, v, lop);
            });

            [d.PTDA, d.GDDH, d.GDDA, d.TenDuAn, d.TenNganDA, d.TenNganPKT].forEach((v, j) => this.ghi(rr, sau + j, v, nen));
        });

        // Dòng tổng cộng = cộng các dòng miền
        bc.dongs.filter(d => d.RowType.indexOf('TONG') == 0).forEach(d => {
            const rr = viTri[d.RowNo];
            const ds = dongMien[d.RowType == 'TONG_KH' ? 'MIEN_KH' : 'MIEN_BCTC'];
            for (let j = 1; j <= this.nCot; j++) {
                const ci = C.C_TONG + j;
                const cell = this.sheet.rows[rr].cells[ci];
                cell.formula = ds.length ? 'SUM(' + ds.map(x => this.col(ci) + x).join(',') + ')' : null;
            }
        });

        // Dòng khoá
        const rk = hr + 1 + bc.dongs.length;
        this.ghi(rk, 0, 'DÒNG KHÓA – DỮ LIỆU DỰ ÁN KẾT THÚC TẠI ĐÂY', 'khoa', sau + 6);
    }

    // ---------- Tiện ích ----------
    private ghi(r: number, c: number, value: any, style: string, colSpan?: number): wjcXlsx.WorkbookCell {
        const row = this.sheet.rows[r] = this.sheet.rows[r] || new wjcXlsx.WorkbookRow();
        const cell = row.cells[c] = new wjcXlsx.WorkbookCell();
        cell.value = value === undefined ? null : value;
        cell.style = this.style(style);
        if (colSpan > 1) cell.colSpan = colSpan;
        return cell;
    }

    // Ô công thức (không có dấu "=" đầu: wijmo ghi thẳng vào thẻ <f>); value là số đệm hiển thị trước khi Excel tính lại
    private cong(r: number, c: number, formula: string, style: string, value?: any) {
        const cell = this.ghi(r, c, value == null ? null : value, style);
        cell.formula = formula;
        return cell;
    }

    private so(v: any): number {
        return v === null || v === undefined || v === '' ? null : +v;
    }

    private col(i: number): string {
        let s = '';
        i++;
        while (i > 0) {
            const m = (i - 1) % 26;
            s = String.fromCharCode(65 + m) + s;
            i = Math.floor((i - 1) / 26);
        }
        return s;
    }

    private ten(list: any[], value: any): string {
        const x = list.find(i => i.value == value);
        return x ? x.text : '';
    }

    // Style theo tên: <nền>[-<kiểu số>]  nền: th, td, bd, tre, mien, tong, lb-*, st-*;  kiểu số: n, p, t, c
    private style(key: string): wjcXlsx.WorkbookStyle {
        if (this.styles[key]) return this.styles[key];

        const s = new wjcXlsx.WorkbookStyle();
        const font = s.font = new wjcXlsx.WorkbookFont();
        font.family = 'Arial';
        font.size = 9;
        s.vAlign = wjcXlsx.VAlign.Center;
        s.wordWrap = true;

        const fill = (color: string) => { s.fill = new wjcXlsx.WorkbookFill(); s.fill.color = color; };
        const [nen, so] = key.split('-').length > 1 && ['lb', 'st'].indexOf(key.split('-')[0]) < 0
            ? [key.split('-')[0], key.split('-')[1]]
            : [key, ''];

        const coVien = ['title', 'italic', 'bold', 'input'].indexOf(nen) < 0;
        if (coVien) {
            s.borders = new wjcXlsx.WorkbookBorder();
            ['top', 'bottom', 'left', 'right'].forEach(k => {
                const b = s.borders[k] = new wjcXlsx.WorkbookBorderSetting();
                b.style = wjcXlsx.BorderStyle.Thin;
                b.color = '#9BB0C9';
            });
        }

        switch (nen) {
            case 'title': font.size = 14; font.bold = true; font.color = '#1F4E78'; s.wordWrap = false; break;
            case 'italic': font.italic = true; s.wordWrap = false; break;
            case 'bold': font.bold = true; s.wordWrap = false; break;
            case 'input': fill('#FFFF99'); font.bold = true; break;
            case 'th': fill('#1F4E78'); font.color = '#FFFFFF'; font.bold = true; s.hAlign = wjcXlsx.HAlign.Center; break;
            case 'tong': fill('#A9D08E'); font.bold = true; break;
            case 'mien': fill('#E2EFDA'); font.bold = true; break;
            case 'bd': fill('#DDEBF7'); font.bold = true; break;
            case 'tre': font.color = '#C00000'; font.bold = true; break;
            case 'khoa': fill('#F2F2F2'); font.italic = true; font.color = '#7F7F7F'; s.hAlign = wjcXlsx.HAlign.Center; break;
            case 'lb-CHOT': fill('#C6EFCE'); font.bold = true; break;
            case 'lb-DANGDP': fill('#FFF2CC'); font.bold = true; break;
            case 'lb-CHUADP': fill('#DDEBF7'); font.bold = true; break;
            case 'lb-TRE': font.color = '#C00000'; font.bold = true; s.indent = 2; break;
            case 'st-CHOT': fill('#FCE4D6'); font.color = '#C65911'; s.hAlign = wjcXlsx.HAlign.Center; break;
            case 'st-DANGDP': fill('#C6EFCE'); font.color = '#006100'; s.hAlign = wjcXlsx.HAlign.Center; break;
            case 'st-CHUADP': font.color = '#595959'; s.hAlign = wjcXlsx.HAlign.Center; break;
            case 'st-TRE': case 'st-CHECK': font.color = '#C00000'; font.bold = true; s.hAlign = wjcXlsx.HAlign.Center; break;
        }

        switch (so) {
            case 'n': s.format = wjcXlsx.Workbook.toXlsxNumberFormat('n0'); s.hAlign = wjcXlsx.HAlign.Right; break;
            case 'p': s.format = wjcXlsx.Workbook.toXlsxNumberFormat('p1'); s.hAlign = wjcXlsx.HAlign.Right; break;
            case 't': case 'c': s.hAlign = wjcXlsx.HAlign.Center; break;
        }
        if (key == 'input-p') { s.format = wjcXlsx.Workbook.toXlsxNumberFormat('p0'); s.hAlign = wjcXlsx.HAlign.Center; }

        return this.styles[key] = s;
    }
}
