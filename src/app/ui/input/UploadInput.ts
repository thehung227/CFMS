import { InputBase } from './InputBase';
import { BaseService } from './../../base/base.service';
import 'rxjs/Rx'
import { saveAs as importedSaveAs } from "file-saver";
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { Subscription } from 'rxjs/Subscription';

export class UploadInput extends InputBase<string> implements OnDestroy {

    controlType = 'file';
    multiple: string = 'multiple';
    type = 'file';
    file: File;
    fileName: string = '';
    folderName: string = '';
    command: string = '';
    parentId: number = -1;
    subscription: Subscription;
    fileNameDownLoad: string = '';
    isOnlyDownload: boolean = false;
    folderId: any;
    constructor(options: {} = {},
        private service: BaseService) {
        super(options);
        this.multiple = options['multiple'];
        this.isOnlyDownload = options['isOnlyDownload'] || false;
        this.folderId = options['folderId'];
        this.subscription = new Subscription();
    }


    uploadFile(key: string, parentId: string) {
        let fileList: File[] = [];
        fileList.push(this.file);
        //Dương sửa 09/02/2018
        const sub = this.service.upLoad(fileList, key, parentId).subscribe();
        this.subscription.add(sub);
    }

    downloadFile(key: string, parentId: number, name: string) {
        let _div = document.createElement('div');
        _div.innerHTML = `<div style="height:25px;position: fixed;bottom: 0%;left: 20%;right: 20%;background-color:#efefef"><div class='childProgressBar' style="position: relative;text-align:center;    
            height:100%;    
        font-family: Arial, Helvetica, sans-serif;
            font-size: 14px;
            color: #ffffff;
            padding: 5px 10px;
            background: -moz-linear-gradient(
              top,
              #bbff7a 0%,
              #a8e56d 50%,
              #95cc61 92%,
              #82b255);
            background: -webkit-gradient(
              linear, left top, left bottom,
              from(#bbff7a),
              color-stop(0.50, #a8e56d),
              color-stop(0.92, #95cc61),
              to(#82b255));
            -moz-border-radius: 6px;
            -webkit-border-radius: 6px;
            border-radius: 6px;
            border: 1px solid #12190C;
            -moz-box-shadow:
              0px 1px 1px rgba(000,000,000,0.5),
              inset 1px 2px 0px rgba(255,255,255,0.4);
            -webkit-box-shadow:
              0px 1px 1px rgba(000,000,000,0.5),
              inset 1px 2px 0px rgba(255,255,255,0.4);
            box-shadow:
              0px 1px 1px rgba(000,000,000,0.5),
              inset 1px 2px 0px rgba(255,255,255,0.4);
            text-shadow:
              1px 1px 2px rgba(000,000,000,0.7),
              0px 1px 0px rgba(255,255,255,0.4);"><\/div><\/div>`
        document.getElementsByTagName('section').item(0).appendChild(_div);
        let _bar = <HTMLDivElement>document.getElementsByClassName('childProgressBar').item(0);

        let prosub = this.service.downloadProgress.subscribe(
            data => {
                let progress = (Math.round(data * 100) / 100).toString() + '%';
                _bar.style.width = progress;
                _bar.innerText = progress;
                if (data == 100) {
                    setTimeout(() => {
                        _div.remove();
                    }, 300);
                }
            }, error => {
                _div.remove();
            });
        this.subscription.add(prosub);
        if (key && parentId > 0 && name) {
            const sub = this.service.dowload(key, parentId.toString(), name).subscribe(blob => {
                if (name.toUpperCase().endsWith('PDF') == false)
                    importedSaveAs(blob, name);
                else {
                    let url = window.URL.createObjectURL(blob);
                    window.open(url);

                    // let a = document.createElement("a");
                    // document.body.appendChild(a);
                    // a.setAttribute("style", "display: none");

                    // let url = window.URL.createObjectURL(blob);
                    // a.href = url;
                    // a.download = name;
                    // a.click();
                    // a.remove();
                    // window.URL.revokeObjectURL(url);
                }
            });
            this.subscription.add(sub);
        }
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}