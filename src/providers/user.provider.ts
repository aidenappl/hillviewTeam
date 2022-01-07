import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "./user.interface";

@Injectable()

export class UserProvider {
    constructor(
        private router: Router
    ) {}

    private user: User | null = null;

    get(): User {
        if (this.user === null) {
            return {} as User;
        }
        return Object.assign(this.user, {});
    }

    set(user: User): void {
        this.user = user;
        console.log(this.user)
        return;
    }

    clear(): void {
        this.user = null;
        return;
    }

    isNull(): boolean {
        return this.user === null;
    }

    goHome(): void {
        if (this.user === null) {
            this.router.navigate(['/login']);
            return;
        }
        if (this.user.authentication.short_name === 'unauthorized') {
            this.router.navigate(['/pending']);
        }
        if (this.user.authentication.short_name === 'studnet') {
            this.router.navigate(['/student']);
        }
        if (this.user.authentication.short_name === 'admin') {
            this.router.navigate(['/admin']);
        }
    }

}