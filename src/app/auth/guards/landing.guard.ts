import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { UserProvider } from "src/providers/user.provider";
import { SessionService } from "src/services/session/session.service";

@Injectable()

export class LandingGuard {
    constructor(
        private session: SessionService,
        private user: UserProvider,
        private router: Router
    ) {}

    async canActivate(): Promise<boolean> {
        const session = await this.session.active();
        if (session) {
            this.user.goHome();
            return false;
        } else {
            return true;
        }
    }

    async canLoad(): Promise<boolean> {
        const session = await this.session.active();
        if (session) {
            this.user.goHome();
            return false;
        } else {
            return true;
        }
    }
    
}