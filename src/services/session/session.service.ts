import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { SocialAuthService } from "angularx-social-login";
import { UserProvider } from "src/providers/user.provider";
import { User } from "../auth/auth.interfaces";

@Injectable()

export class SessionService {
    constructor(
        private user: UserProvider,
        private authService: SocialAuthService,
        private router: Router
    ) {}

    // Begin a new Session

    async begin(req: {
        accessToken: string;
        refreshToken: string;
        user: User;
    }): Promise<boolean> {
        try {
            if (req.accessToken && req.refreshToken && req.user) {
                localStorage.setItem('accessToken', req.accessToken);
                localStorage.setItem('refreshToken', req.refreshToken);

                this.user.set(req.user);

                return true;
            } else {
                throw new Error('Invalid Request');
            }
        } catch (error) {
            throw error;
        }
    }

    // Is there an Active and Valid Session

    async active(): Promise<boolean> {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const refreshToken = localStorage.getItem('refreshToken');

            if (accessToken && refreshToken) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error(error)
            return false;
        }
    }

    // Logout of an Active Session

    async logout(): Promise<void> {
        try {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');

            this.user.clear();

            this.authService.signOut()

            this.router.navigate(['/login']);
        } catch (error) {
            console.error(error)
        }
    }
}