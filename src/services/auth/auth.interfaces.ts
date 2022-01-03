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



