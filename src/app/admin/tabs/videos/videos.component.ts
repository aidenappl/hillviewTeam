import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as dayjs from 'dayjs';
import { environment } from 'src/environments/environment';
import { Video } from 'src/providers/video.interface';
import { RequestService } from 'src/services/http/request.service';

@Component({
    selector: 'app-videos',
    templateUrl: './videos.component.html',
    styleUrls: ['./videos.component.scss'],
})
export class VideosComponent implements OnInit {
    constructor(private request: RequestService) {}

    @ViewChild('titleInput', { static: false }) titleInput!: ElementRef;
    @ViewChild('descriptionInput', { static: false }) descriptionInput!: ElementRef;
    @ViewChild('thumbnailInput' , { static: false }) thumbnailInput!: ElementRef;
    @ViewChild('sourceInput', { static: false }) sourceInput!: ElementRef;
    @ViewChild('thumbnailUploader', { static: false }) thumbnailUploader!: ElementRef;
    

    videos: Video[] = [];
    loaded: boolean = false;
    selectedVideo: Video = {} as Video;
    showVideoInspector: boolean = false;
    showSplash: boolean = false;

    ngOnInit(): void {
        this.initialize();
    }

    async initialize(): Promise<void> {
        try {
            this.videos = await this.getVideos();
            await this.formatVideos();
            this.loaded = true;
        } catch (error) {
            console.error(error);
        }
    }

    async deleteVideo(id: number): Promise<void> {
        try {
            const response = await this.request.post(
                `${environment.CORE_API_URL}/admin/delete/video`,
                {
                    id,
                }
            );
            console.log(response);
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    }

    handleThumbnailUpload(): void {
      this.thumbnailUploader.nativeElement.click()
    }

    async formatVideos(): Promise<void> {
        try {
            this.videos.forEach((video: Video) => {
                video.display = {
                    inserted_at: dayjs(video.inserted_at).format(
                        'MMMM DD, YYYY'
                    ),
                    full_inserted_at: dayjs(video.inserted_at).format(
                      'HH:MM A - MMMM DD, YYYY'
                  ),
                };
            });
        } catch (error) {
            throw error;
        }
    }

    async getVideos(): Promise<Video[]> {
        try {
            const response = await this.request.get(
                `${environment.CORE_API_URL}/admin/list/videos/40`
            );
            return response.body as Video[];
        } catch (error) {
            throw error;
        }
    }

    openVideo(id: number): void {
        window.open(`https://hillview.tv/videos/v/${id}`, '_blank');
    }

    inspectVideo(id: number): void {
        this.selectedVideo = this.videos.find((video: Video) => {
            return video.id === id;
        }) as Video;
        this.showVideoInspector = true;
        this.showSplash = true;
    }

    splashClick(): void {
        this.showSplash = false;
        this.showVideoInspector = false;
    }

    async submitChanges(): Promise<void> {
        try {
            const data = {
                id: this.selectedVideo.id,
                title: this.titleInput.nativeElement.value,
                description: this.descriptionInput.nativeElement.value,
                thumbnail: this.thumbnailInput.nativeElement.value,
                url: this.sourceInput.nativeElement.value,
            };
            const response = await this.request.post(
                `${environment.CORE_API_URL}/admin/edit/video`,
                data
            );
            console.log(response);
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    }
}
