import { InputBase } from './InputBase';
import { BaseService } from './../../base/base.service';
import 'rxjs/Rx'
import { saveAs as importedSaveAs } from "file-saver";
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { Subscription } from 'rxjs/Subscription';

export class UploadImage extends InputBase<string> implements OnDestroy {

    controlType = 'image';
    multiple: string = 'multiple';
    type = 'file';
    file: File;
    fileName: string = '';
    folderName: string = '';
    command: string = '';
    parentId: number = -1;
    subscription: Subscription;
    folderId: any;
    src: string;
    constructor(options: {} = {},
        private service: BaseService) {
        super(options);
        this.multiple = options['multiple'];
        this.folderId = options['folderId'];
        this.subscription = new Subscription();
    }



    uploadImage(key: string) {
        let fileList: File[] = [];
        fileList.push(this.file);
        const sub = this.service.upLoadImage(fileList, key).subscribe();
        this.subscription.add(sub);
    }

    // downloadFile(key: string, parentId: number, name: string) {
    //     if (key && parentId > 0 && name) {
    //         const sub = this.service.dowload(key, parentId.toString(), name).subscribe(blob => {
    //             if (name.endsWith('pdf') == false)
    //                 importedSaveAs(blob, name);
    //             else {
    //                 let url = window.URL.createObjectURL(blob);
    //                 window.open(url);
    //             }
    //         });
    //         this.subscription.add(sub);
    //     }
    // }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}