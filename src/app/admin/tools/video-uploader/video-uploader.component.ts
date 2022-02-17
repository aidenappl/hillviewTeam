import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { RequestService } from 'src/services/http/request.service';

import * as captureVideoFrame from "capture-video-frame";

@Component({
  selector: 'app-video-uploader',
  templateUrl: './video-uploader.component.html',
  styleUrls: ['./video-uploader.component.scss']
})
export class VideoUploaderComponent implements OnInit {

  @ViewChild('uploadVideoInput', {static: false}) uploadVideoInput!: ElementRef;
  @ViewChild('titleInput', {static: false}) titleInput!: ElementRef;
  @ViewChild('descriptionInput', {static: false}) descriptionInput!: ElementRef;

  showFileLoader: boolean = false;
  showLoader: boolean = false;
  fileNameTag: string = '';
  videoSubmitButtonVal: string = 'Submit';
  fileLink: string = '';

  constructor(
    private http: HttpClient,
    private request: RequestService
  ) { }

  ngOnInit(): void {
  }

  fileUploadChange(event: any): void {
    var files = event.target.files
    var filename = files[0].name
    var extension = files[0].type
    
    if (files.length === 0) {
      window.alert("No file selected.");
      this.showFileLoader = false;
      return;
    }

    if (files.length > 1) {
      window.alert("Can't select more than one file");
      this.showFileLoader = false;
      return;
    }

    console.log(files, filename, extension)

    this.fileNameTag = "Uploading... " + filename

    this.videoSubmitButtonVal = 'Uploading...'


    const formData = new FormData();
    formData.append('upload', files[0]);

    this.http.post<any>(`${environment.VIDEO_API_URL}/upload/video`, formData).subscribe(
      (res) => {
        console.log(res)
        if (res.url) {
          this.fileLink = res.url
          this.showFileLoader = false;
          this.videoSubmitButtonVal = 'Submit'
          this.fileNameTag = "Uploaded! " + filename
        }
      },
      (err) => console.log(err)
    );
  }

  async submit(): Promise<void> {
    try {
      if (this.showFileLoader || this.showLoader) {return}
      const data = {
        url: this.fileLink,
        title: this.titleInput.nativeElement.value,
        description: this.descriptionInput.nativeElement.value,
        thumbnail: "https://content.hillview.tv/thumbnails/default.jpg"
      }

      this.showLoader = true;
      this.videoSubmitButtonVal = ' '

      const response = await this.request.post(`${environment.VIDEO_API_URL}/create/video`, data)
      console.log(response)
      if (response.status === 200) {
        window.alert("Successfully uploaded video!")
        window.location.reload()
      } else {
        window.alert("Something went wrong!" + (response.body as any).toString())
        window.location.reload()
      }
    } catch (error) {
      console.error(error);
    }
  }

  uploadFilePress(): void {
    if (this.showFileLoader) {return}
    this.showFileLoader = true;
    this.uploadVideoInput.nativeElement.click();
  }

  getVideoFrame(): void {
    try {
      const frame = this.captureVideoFrame("preview-video", "jpeg", 0.92);
      console.log(frame)
    } catch (error) {
      console.log(error)
    }
  }

  captureVideoFrame(video: any, format: any, quality: any) {
    if (typeof video === 'string') {
        video = document.getElementById(video);
    }

    format = format || 'jpeg';
    quality = quality || 0.92;

    if (!video || (format !== 'png' && format !== 'jpeg')) {
      console
        return false;
    }

    var canvas: any = document.createElement("CANVAS");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    canvas.getContext('2d').drawImage(video, 0, 0);

    var dataUri = canvas.toDataURL('image/' + format, quality);
    var data = dataUri.split(',')[1];
    var mimeType = dataUri.split(';')[0].slice(5)

    var bytes = window.atob(data);
    var buf = new ArrayBuffer(bytes.length);
    var arr = new Uint8Array(buf);

    for (var i = 0; i < bytes.length; i++) {
        arr[i] = bytes.charCodeAt(i);
    }

    var blob = new Blob([ arr ], { type: mimeType });
    return { blob: blob, dataUri: dataUri, format: format };
};

}
