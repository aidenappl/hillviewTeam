import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { RequestService } from 'src/services/http/request.service';

import * as captureVideoFrame from 'capture-video-frame';
import { Router } from '@angular/router';

@Component({
    selector: 'app-video-uploader',
    templateUrl: './video-uploader.component.html',
    styleUrls: ['./video-uploader.component.scss'],
})
export class VideoUploaderComponent implements OnInit {
    @ViewChild('uploadVideoInput', { static: false })
    uploadVideoInput!: ElementRef;
    @ViewChild('titleInput', { static: false }) titleInput!: ElementRef;
    @ViewChild('descriptionInput', { static: false })
    descriptionInput!: ElementRef;
    @ViewChild('thumbnailInput', { static: false }) thumbnailInput!: ElementRef;

    showThumbnailer: boolean = false;
    uploadInProgress: boolean = false;

    videoSubmitButtonVal: string = 'Submit';

    thumbnailSubmitBtn: string = 'Select Frame As Thumbnail';

    data: any = {
        title: '',
        description: '',
        url: '',
        thumbnail: '',
        localBlob: '',
        uploadedFileName: '',
        progress: 0,
        bkgImg: '',
    };

    bools: any = {
        hasUpload: false,
        uploadFinished: false,
        showProgress: false,
        showfs: false,
    };

    constructor(
        private http: HttpClient,
        private router: Router,
        private request: RequestService
    ) {}

    ngOnInit(): void {}

    back(): void {
        this.router.navigateByUrl('/admin/r/videos');
    }

    toggleThumbnailer(state: boolean): void {
        this.showThumbnailer = state;
    }

    valueChange(target: string, event: any): void {
        this.data[target] = event.target.value;
    }

    async fileUploadChange(event: any): Promise<void> {
        try {
            this.bools.hasUpload = true;

            var files = event.target.files;
            var filename = files[0].name;
            var extension = files[0].type;

            if (files.length === 0) {
                window.alert('No file selected.');
                this.bools.hasUpload = false;
                return;
            }

            if (files.length > 1) {
                window.alert("Can't select more than one file");
                this.bools.hasUpload = false;
                return;
            }

            this.titleInput.nativeElement.value = filename;

            console.log(files, filename, extension);

            this.data.uploadedFileName = 'Uploading... ' + filename;

            this.videoSubmitButtonVal = 'Uploading...';

            this.bools.showProgress = true;
            this.bools.showfs = true;

            const formData = new FormData();
            formData.append('upload', files[0]);

            const b64 = await this.getFileURL(files[0]);

            var video: any = document.getElementById('preview-video');
            video.src = b64;
            var thvideo: any = document.getElementById('thumbnailer-video');
            thvideo.src = b64;

            this.http
                .post<any>(
                    `${environment.VIDEO_API_URL}/upload/video`,
                    formData,
                    {
                        reportProgress: true,
                        observe: 'events',
                    }
                )
                .subscribe((resp) => {
                    if (resp.type === HttpEventType.Response) {
                        this.bools.uploadFinished = true;
                        this.bools.showProgress = false;
                        this.bools.showfs = false;
                        if (resp.body.url) {
                            this.data.url = resp.body.url;
                            this.videoSubmitButtonVal = 'Submit';
                            this.data.uploadedFileName =
                                'Uploaded! ' + filename;
                        }
                    } else if (resp.type === HttpEventType.UploadProgress) {
                        const percentDone = Math.round(
                            (100 * resp.loaded) / resp.total!
                        );
                        this.data.progress = percentDone;
                    } else {
                        console.log('ext resp', resp)
                    }
                })
        } catch (error) {
            console.error('upload err', error);
        }
    }

    async getFileURL(file: any): Promise<any> {
        try {
            return URL.createObjectURL(file);
        } catch (error) {
            throw error;
        }
    }

    getBase64(file: any): Promise<any> {
        const reader = new FileReader();
        return new Promise((resolve) => {
            reader.onload = (ev: any) => {
                resolve(ev.target.result);
            };
            reader.readAsDataURL(file);
        });
    }

    async submit(): Promise<void> {
        try {
            const data = {
                url: this.data.url,
                title: this.titleInput.nativeElement.value,
                description: this.descriptionInput.nativeElement.value,
                thumbnail:
                    this.data.thumbnail.length > 0
                        ? this.data.thumbnail
                        : 'https://content.hillview.tv/thumbnails/default.jpg',
            };

            const response = await this.request.post(
                `${environment.VIDEO_API_URL}/create/video`,
                data
            );
            console.log(response);
            if (response.status === 200) {
                window.alert('Successfully uploaded video!');
                window.location.reload();
            } else {
                window.alert(
                    'Something went wrong!' + (response.body as any).toString()
                );
                window.location.reload();
            }
        } catch (error) {
            console.error(error);
        }
    }

    uploadFilePress(): void {
        if (this.bools.hasUpload) {
            return;
        }
        this.uploadVideoInput.nativeElement.click();
    }

    async getBkgFrame(): Promise<void> {
        try {
            const frame: any = captureVideoFrame('preview-video', 'jpeg', 0.5);
            let bl = await this.getBase64(frame.blob)
            this.data.bkgImg = bl
        } catch (error) {
            console.log(error);
        }
    }

    async getVideoFrame(): Promise<void> {
        try {
            this.thumbnailSubmitBtn = 'Generating...';
            const frame: any = captureVideoFrame(
                'thumbnailer-video',
                'jpeg',
                0.5
            );
            this.thumbnailSubmitBtn = 'Uploading...';

            const formData = new FormData();
            formData.append('upload', frame.blob);

            this.http
                .post<any>(
                    `${environment.VIDEO_API_URL}/upload/thumbnail`,
                    formData,
                    {
                        reportProgress: true,
                        observe: 'events',
                    }
                )
                .subscribe((resp) => {
                    if (resp.type === HttpEventType.Response) {
                        this.thumbnailSubmitBtn = 'Done!';
                        this.toggleThumbnailer(false);
                        this.data.thumbnail = resp.body.url;
                        this.thumbnailInput.nativeElement.value = resp.body.url;
                        window.alert('Successfully uploaded thumbnail!');
                    }
                    if (resp.type === HttpEventType.UploadProgress) {
                        const percentDone = Math.round(
                            (100 * resp.loaded) / resp.total!
                        );
                        console.log('Progress ' + percentDone + '%');
                    }
                });
        } catch (error) {
            console.log(error);
        }
    }
}
