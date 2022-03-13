import { User } from "./user.interface";

export interface Link {
    id: number;
    route: string;
    destination: string;
    active: boolean;
    inserted_at: string;
    display?: DisplayMetadata;
    creator: User;
}

export interface DisplayMetadata {
    inserted_at?: string;
}


