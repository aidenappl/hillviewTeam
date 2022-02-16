import { GeneralNSM } from "./user.interface";

export interface VideoDisplays {
    inserted_at?: string;
    full_inserted_at?: string;
}

export interface Video {
    id: number;
    title: string;
    description: string;
    thumbnail: string;
    url: string;
    status: GeneralNSM;
    inserted_at: Date;
    display: VideoDisplays;
}


