import { Injectable } from "@angular/core";
import { User } from "src/services/auth/auth.interfaces";

@Injectable()

export class UserProvider {
    constructor() {}

    private user: User | null = null;

    get(): User {
        return Object.assign(this.user, {});
    }

    set(user: User): void {
        this.user = user;
    }

    clear(): void {
        this.user = null;
    }

    isNull(): boolean {
        return this.user === null;
    }

}