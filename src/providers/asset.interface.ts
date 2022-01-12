import { GeneralNSM, MobileUser } from "./user.interface";

export interface Asset {
    id: number;
    name: string;
    image_url: string;
    identifier: string;
    description: string;
    category?: any;
    status?: any;
    metadata?: any;
    active_tab?: any;
}

export interface Checkout {
    id: number;
    user: MobileUser;
    associated_user: number;
    asset: Asset;
    asset_id: number;
    offsite: number;
    checkout_status: GeneralNSM;
    checkout_notes: string;
    time_out: Date;
    time_in?: Date;
    expected_in: Date;
}

