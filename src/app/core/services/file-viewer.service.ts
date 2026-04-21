import { Injectable } from '@angular/core';

// Angular 2: không providedIn
@Injectable()
export class FileViewerService {

  // Bóc URL gốc nếu link bị SafeLinks của Outlook bọc
  private unwrapSafeLinks(u: string): string {
    try {
      if (u.indexOf('safelinks.protection.outlook.com') !== -1) {
        var m = /[?&]url=([^&]+)/i.exec(u);
        if (m && m[1]) { u = decodeURIComponent(m[1]); }
      }
    } catch (e) {}
    return u;
  }

  private getExt(u: string): string {
    var q = u.split('?')[0];             // bỏ query
    var i = q.lastIndexOf('.');
    return i >= 0 ? q.substring(i + 1).toLowerCase() : '';
  }

  private isOfficeExt(ext: string): boolean {
    var list = ['doc','docx','xls','xlsx','ppt','pptx','vsd','vsdx'];
    return list.indexOf(ext) >= 0;
  }

  private isGoogleExt(ext: string): boolean {
    // Google gview mở được pdf/txt/csv/images… (nhưng office → nên dùng Office viewer)
    var list = ['pdf','txt','csv','png','jpg','jpeg','gif','bmp'];
    return list.indexOf(ext) >= 0;
  }

  private buildViewerUrl(originalUrl: string): string {
    var url = this.unwrapSafeLinks(originalUrl);
    // bắt buộc encode cho viewer
    var enc = encodeURIComponent(url);
    var ext = this.getExt(url);

    if (this.isOfficeExt(ext)) {
      // Office Web Viewer
      return 'https://view.officeapps.live.com/op/view.aspx?src=' + enc;
    }
    if (this.isGoogleExt(ext)) {
      // Google Docs Viewer
      return 'https://docs.google.com/gview?embedded=true&url=' + enc;
    }
    // Không thuộc 2 nhóm trên: thử mở trực tiếp
    return url;
  }

  /** Mở file bằng viewer phù hợp trong tab mới */
  public openOnline(originalUrl: string): void {
    if (!originalUrl) { return; }
    var viewer = this.buildViewerUrl(originalUrl);
    window.open(viewer, '_blank');
  }
}
