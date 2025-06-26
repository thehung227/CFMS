import { Component } from '@angular/core';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Global } from '../../shared/global';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { Subscription } from 'rxjs/Subscription';
@Component({
    selector: 'app-upload',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnDestroy {
    
    private isUploadBtn = true;
    subscription: Subscription;

    constructor(private http: Http) {
        this.subscription = new Subscription();

    }
    // file upload event
    fileChange(event) {
        const fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            const file: File = fileList[0];
            const formData: FormData = new FormData();
            formData.append('uploadFile', file, file.name);
            const headers = new Headers();
            // headers.append('Content-Type', 'json');
            // headers.append('Accept', 'application/json');
            const options = new RequestOptions({ headers: headers });
            const apiUrl1 = Global.UploadEndpoint;
            console.log(apiUrl1);
            this.http.post(apiUrl1, formData, options)
                .map(res => res.json())
                .catch(error => Observable.throw(error))
                .subscribe(
                data => console.log('success'),
                error => console.log(error)
                );
        }
        // window.location.reload();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
