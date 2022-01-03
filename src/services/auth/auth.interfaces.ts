export interface Response {
    token_type: string;
    access_token: string;
    scope: string;
    login_hint: string;
    expires_in: number;
    id_token: string;
    first_issued_at: number;
    expires_at: number;
    idpId: string;
}

export interface GoogleResponse {
    id: string;
    name: string;
    email: string;
    photoUrl: string;
    firstName: string;
    lastName: string;
    authToken: string;
    idToken: string;
    response: Response;
    provider: string;
}


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
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}
