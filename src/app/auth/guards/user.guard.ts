import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { SessionService } from "src/services/session/session.service";

@Injectable()

export class UserGuard {
    constructor(
        private session: SessionService,
        private router: Router
    ) {}

    async canActivate(): Promise<boolean> {
        const session = await this.session.active();
        if (session) {
            const lander = await this.session.findLander();
            if (lander === '/pending') {
                return true;
            } else {
                this.router.navigate(['/redirect']);
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
                this.router.navigate(['/redirect']);
                return false;
            }
        } else {
            this.router.navigate(['/login']);
            return false;
        }
    }
    
}