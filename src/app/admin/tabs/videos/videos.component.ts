import { Component, OnInit } from '@angular/core';
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

    async formatVideos(): Promise<void> {
        try {
            this.videos.forEach((video: Video) => {
                video.display = {
                    inserted_at: dayjs(video.inserted_at).format(
                        'MMMM DD, YYYY'
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
            // const data = {
            //     id: this.selectedVideo.id,
            //     name: this.selectedVideo.nativeElement.value,
            //     identifier: this.selectedVideo.nativeElement.value,
            //     description: this.descriptionInspectInput.nativeElement.value,
            // };
            // const response = await this.request.post(
            //     `${environment.CORE_API_URL}/admin/edit/video`,
            //     data
            // );
            // console.log(response);
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    }
}
