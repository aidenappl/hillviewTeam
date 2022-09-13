
export interface GeneralNSM {
    id: number;
    name: string;
    short_name: string;
}

export interface User {
    id: number;
    username: string;
    name: string;
    email: string;
    profile_image_url: string;
    authentication: GeneralNSM;
    inserted_at: Date;
    last_active: Date;
    display?: DisplayMetadata;
}

export interface DisplayMetadata {
    last_active?: string;
    date_created?: string;
}

export interface MobileUser {
    id: number;
    name: string;
    email: string;
    status: GeneralNSM;
    identifier: string;
    profile_image_url: string;
    inserted_at: Date;
    display: DisplayMetadata;
}
