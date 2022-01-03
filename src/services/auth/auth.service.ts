import { Injectable } from "@angular/core";
import { GoogleLoginProvider, SocialAuthService } from "angularx-social-login";

@Injectable()

export class AuthService {
    constructor(
        private authService: SocialAuthService
    ) {}

    async google(): Promise<any> {
        try {
            const response = await this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
            console.log(response);
        } catch (error) {
            throw error;
        }
    }
}