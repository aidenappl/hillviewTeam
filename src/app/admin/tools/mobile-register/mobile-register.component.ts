import { Component, OnInit } from '@angular/core';

//import COCO-SSD model as cocoSSD
import * as cocoSSD from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-backend-cpu';
@Component({
  selector: 'app-mobile-register',
  templateUrl: './mobile-register.component.html',
  styleUrls: ['./mobile-register.component.scss'],
})
export class MobileRegisterComponent implements OnInit {
  title = 'TF-ObjectDetection';
  private video!: HTMLVideoElement;

  score: number = 0;
  fill: number = 0;
  countOver: number = 0;
  startRunning = false;
  loadedFired = false;
  showPhotoSys = false;
  showLoader = true;

  preview: string = '';

  grabbed: boolean = false;

  complete: boolean = false;

  ngOnInit() {}

  retakeProfilePhoto(): void {
    this.showLoader = true;
    this.startRunning = false;
    this.loadedFired = false;
    this.score = 0;
    this.fill = 0;
    this.countOver = 0;
    this.preview = '';
    this.complete = false;
    this.grabbed = false;

    this.takeProfilePhoto();
  }

  takeProfilePhoto(): void {
    this.showPhotoSys = true;
    setTimeout(() => {
      this.webcam_init();
      this.video.addEventListener(
        'loadeddata',
        () => {
          if (!this.loadedFired) {
            this.loadedFired = true;
            this.predictWithCocoModel();
            setTimeout(() => {
              this.showLoader = false;
            }, 500);
            setTimeout(() => {
              this.startRunning = true;
            }, 2000);
          }
        },
        false
      );
      setInterval(() => {
        if (this.score > 10) {
          this.score = this.score - 10;
          this.fill = this.fill - 10;
        }
        if (this.score <= 10) {
          this.fill = 0;
          this.score = 0;
        }
      }, 200);
      setInterval(() => {
        var circle: any = document.querySelector('circle');
        var radius = circle.r.baseVal.value;
        var circumference = radius * 2 * Math.PI;

        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = `${circumference}`;

        if (this.complete) {
          circle.style.strokeDashoffset =
            circumference - (100 / 100) * circumference;
        } else {
          circle.style.strokeDashoffset =
            circumference - (this.fill / 100) * circumference;
        }
      }, 10);
    });
  }

  public async predictWithCocoModel() {
    const model = await cocoSSD.load('lite_mobilenet_v2' as any);
    this.detectFrame(this.video, model);
  }

  webcam_init() {
    this.video = <HTMLVideoElement>document.getElementById('vid');

    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: {
          facingMode: 'user',
          width: { min: 1280 },
          height: { min: 720 },
        },
      })
      .then((stream) => {
        this.video.srcObject = stream;
        this.video.onloadedmetadata = () => {
          this.video.play();
        };
      });
  }

  goodScan(): void {
    if (!this.grabbed) {
      setTimeout(() => {
        this.showLoader = true;
      }, 500);
      this.video.removeEventListener('loadeddata', () => {});
      this.grabbed = true;
      console.log('goodscan');
      const canvas = <HTMLCanvasElement>document.getElementById('canvas');
      setTimeout(() => {
        canvas.toBlob(async (blob: any) => {
          this.showLoader = false;
          const base = await this.blobToBase64(blob);
          this.preview = base as string;
        });
      }, 1500);
    }
  }

  blobToBase64(blob: any) {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }

  detectFrame = (video: HTMLVideoElement, model: any) => {
    model.detect(video).then((predictions: any[]) => {
      predictions.filter((prediction: any) => {
        if (prediction.class == 'person') {
          const score = Math.round(prediction.score * 100);
          if (this.startRunning) {
            if (score > this.score) {
              if (this.score > 90) {
                this.countOver++;
                if (this.countOver > 5) {
                  this.fill = 100;
                  this.complete = true;
                  this.goodScan();
                }
              } else {
                if (this.score <= 50) {
                  this.fill = 30;
                } else if (this.score <= 70) {
                  this.fill = 50;
                } else {
                  this.fill = score;
                }
                this.score = score;
                this.countOver =
                  this.countOver == 0 ? this.countOver : this.countOver--;
              }
            } else {
              // this.fill = 10;
            }
          }
        }
      });
      this.renderPredictions(predictions);
      requestAnimationFrame(() => {
        if (!this.complete) {
          this.detectFrame(video, model);
        }
      });
    });
  };

  renderPredictions = (predictions: any[]) => {
    const canvas = <HTMLCanvasElement>document.getElementById('canvas');

    const ctx: any = canvas.getContext('2d');

    canvas.width = 1280;
    canvas.height = 720;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // Font options.
    const font = '16px sans-serif';
    ctx.font = font;
    ctx.textBaseline = 'top';
    ctx.scale(-1, 1);
    ctx.drawImage(this.video, -1280, 0, 1280, 720);
  };
}
