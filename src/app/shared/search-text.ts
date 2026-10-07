/**
 * Tìm kiếm tiếng Việt không phân biệt dấu / hoa thường / dấu câu.
 * Dùng cho ô "Tìm chức năng" trên sidebar và ô tìm nhanh màn "Hồ sơ cần xử lý".
 */

/** "Thanh toán NTP/NCC" -> "thanh toan ntp ncc" */
export function toSearchText(value: any): string {
    if (value === null || value === undefined) {
        return '';
    }
    return String(value)
        .toLowerCase()
        .replace(/đ/g, 'd')
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();
}

/**
 * Từ viết tắt hay dùng trong menu (đã chuẩn hoá). Áp dụng hai chiều:
 * - người dùng gõ "ntp" vẫn khớp menu "Thanh toán TPNCC";
 * - người dùng gõ "hop dong" vẫn khớp menu "Hợp đồng, PLHĐ - CĐT".
 */
const ABBREVIATIONS: { [abbr: string]: string[] } = {
    ntp: ['nha thau phu', 'tpncc', 'tp'],
    tp: ['nha thau phu', 'ntp', 'tpncc'],
    ncc: ['nha cung cap', 'tpncc'],
    tpncc: ['ntp', 'ncc', 'nha thau phu', 'nha cung cap'],
    hd: ['hop dong'],
    hdtc: ['hop dong'],
    pl: ['phu luc'],
    plhd: ['phu luc hop dong', 'phu luc', 'hop dong'],
    cdt: ['chu dau tu'],
    bch: ['ban chi huy'],
    pb: ['phong ban'],
    ct: ['cong truong'],
    tt: ['thanh toan'],
    qt: ['quyet toan'],
    kh: ['ke hoach'],
    cp: ['chi phi'],
    dt: ['doanh thu', 'dau tu'],
    vt: ['vat tu'],
    tb: ['thiet bi'],
    dx: ['de xuat'],
    bc: ['bao cao'],
    bds: ['bat dong san'],
    tckt: ['tai chinh ke toan']
};

/** Ghép thêm dạng đầy đủ của các từ viết tắt có trong chuỗi (đã chuẩn hoá). */
export function expandAbbreviations(normalized: string): string {
    const extra: string[] = [];
    normalized.split(' ').forEach(word => {
        const full = ABBREVIATIONS[word];
        if (full) {
            extra.push(full.join(' '));
        }
    });
    return extra.length ? normalized + ' ' + extra.join(' ') : normalized;
}

/**
 * Mọi từ trong câu tìm kiếm đều phải khớp: là đầu một từ trong haystack,
 * hoặc là từ viết tắt có dạng đầy đủ nằm trong haystack.
 * @param queryWords câu tìm kiếm đã chuẩn hoá và tách từ
 * @param haystack   chuỗi đã chuẩn hoá (nên qua expandAbbreviations)
 */
export function matchesAllWords(queryWords: string[], haystack: string): boolean {
    const padded = ' ' + haystack + ' ';
    return queryWords.every(word => {
        if (padded.indexOf(' ' + word) >= 0) {
            return true;
        }
        const full = ABBREVIATIONS[word];
        return !!full && full.some(phrase => padded.indexOf(' ' + phrase + ' ') >= 0);
    });
}
