import { Injectable } from "@angular/core";
import { User } from "src/services/auth/auth.interfaces";

@Injectable()

export class UserProvider {
    constructor() {}

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

}