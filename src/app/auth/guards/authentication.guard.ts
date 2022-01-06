import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { SessionService } from "src/services/session/session.service";

@Injectable()

export class AuthenticationGuard {
    constructor(
        private session: SessionService,
        private router: Router
    ) {}

    async canActivate(): Promise<boolean> {
        const session = await this.session.active();
        if (session) {
            return true;
        } else {
            this.router.navigate(['/login']);
            return false;
        }
    }

    async canLoad(): Promise<boolean> {
        const session = await this.session.active();
        if (session) {
            return true;
        } else {
            this.router.navigate(['/login']);
            return false;
        }
    }
    
}