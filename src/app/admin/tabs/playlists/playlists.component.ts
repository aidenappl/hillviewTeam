import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { RequestService } from 'src/services/http/request.service';

export interface Status {
    id: number;
    name: string;
    short_name: string;
}

export interface Video {
    id: number;
    title: string;
    description: string;
    thumbnail: string;
    url: string;
    status: Status;
    inserted_at: Date;
}

export interface Playlist {
    id: number;
    name: string;
    description: string;
    banner_image: string;
    route: string;
    inserted_at: Date;
    videos: Video[];
}

@Component({
    selector: 'app-playlists',
    templateUrl: './playlists.component.html',
    styleUrls: ['./playlists.component.scss'],
})
export class PlaylistsComponent implements OnInit {
    loaded: boolean = false;
    playlists: Playlist[] = [];

    constructor(private request: RequestService) {}

    ngOnInit(): void {
        this.initialize();
    }

    async getPlaylists(): Promise<Playlist[]> {
      try {
          const response = await this.request.get(
              `${environment.CORE_API_URL}/admin/list/playlists?limit=25&offset=0`
          );
          return response.body as Playlist[];
      } catch (error) {
          throw error;
      }
  }

    async initialize(): Promise<void> {
        try {
            this.playlists = await this.getPlaylists();
            this.loaded = true;
        } catch (error) {
            console.error(error);
        }
    }
}
