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

export interface CheckoutDisplays {
    time_out?: string;
    time_in?: string;
    expected_in?: string;
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
    display: CheckoutDisplays;
    time_in?: Date;
    expected_in: Date;
}

