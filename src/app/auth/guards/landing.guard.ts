import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { SessionService } from "src/services/session/session.service";

@Injectable()

export class LandingGuard {
    constructor(
        private session: SessionService,
        private router: Router
    ) {}

    async canActivate(): Promise<boolean> {
        const session = await this.session.active();
        if (session) {
            this.router.navigate(['/redirect']);
            return false;
        } else {
            return true;
        }
    }

    async canLoad(): Promise<boolean> {
        const session = await this.session.active();
        if (session) {
            this.router.navigate(['/redirect']);
            return false;
        } else {
            return true;
        }
    }
    
}