import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { UserProvider } from "src/providers/user.provider";
import { SessionService } from "src/services/session/session.service";

@Injectable()

export class UserGuard {
    constructor(
        private session: SessionService,
        private user: UserProvider,
        private router: Router
    ) {}

    async canActivate(): Promise<boolean> {
        const session = await this.session.active();
        if (session) {
            const lander = await this.session.findLander();
            if (lander === '/pending') {
                return true;
            } else {
                this.user.goHome();
                return false;
            }
        } else {
            this.router.navigate(['/login']);
            return false;
        }
    }

    async canLoad(): Promise<boolean> {
        const session = await this.session.active();
        if (session) {
            const lander = await this.session.findLander();
            if (lander === '/pending') {
                return true;
            } else {
                this.user.goHome();
                return false;
            }
        } else {
            this.router.navigate(['/login']);
            return false;
        }
    }
    
}