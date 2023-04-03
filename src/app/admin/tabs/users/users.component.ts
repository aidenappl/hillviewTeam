import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MobileUser, User } from 'src/providers/user.interface';
import { RequestService } from 'src/services/http/request.service';

import * as dayjs from 'dayjs';
import * as relativeTime from 'dayjs/plugin/relativeTime';
import * as updateLocale from 'dayjs/plugin/updateLocale';
import { ActivatedRoute, Router } from '@angular/router';

export interface ListDataArr {
    system: Array<User>;
    mobile: Array<MobileUser>;
}

export interface GeneralNSM {
    id: number;
    name: string;
    short_name: string;
}

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
})

export class UsersComponent implements OnInit {
    loaded = false;
    // User popup
    showUserPopup = false;
    selectedUser: any = null;

    // Admin popup
    showAdminPopup = false;
    selectedAdmin: any = null;

    @ViewChild('selectStatus', { static: false }) selectStatus: any;
    @ViewChild('nameInspectInput', { static: false }) nameInspectInput: any;
    @ViewChild('emailInspectInput', { static: false }) emailInspectInput: any;

    adminStatuses = [
        {
            id: 1,
            name: 'Unauthorized',
            short_name: 'unauthorized',
        },
        {
            id: 2,
            name: 'Student',
            short_name: 'student',
        },
        {
            id: 3,
            name: 'Admin',
            short_name: 'admin',
        },
    ];

    selectedDatabase = 'system';

    listData: ListDataArr = {
        system: [],
        mobile: [],
    };

    constructor(
        private request: RequestService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        dayjs.extend(relativeTime);
        dayjs.extend(updateLocale);
        dayjs.updateLocale('en', {
            relativeTime: {
                future: 'in %s',
                past: '%s',
                s: 'Just Now',
                m: 'Just Now',
                mm: '%d minutes ago',
                h: '1 hour ago',
                hh: '%d hours ago',
                d: '1 day ago',
                dd: '%d days ago',
                M: '1 month ago',
                MM: '%d months ago',
                y: '1 year ago',
                yy: '%d years ago',
            },
        });
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe((params: any) => {
            if (params.source) {
                this.selectedDatabase = params.source;
            }
        });
        this.initialize();
    }

    toggleUserPopup(force?: boolean): void {
        this.showUserPopup = force || !this.showUserPopup;
    }

    openUserPop(user: any): void {
        this.showUserPopup = true;
        this.selectedUser = user;
    }

    // Admin Popup

    toggleAdminPopup(force?: boolean): void {
        this.showAdminPopup = force || !this.showAdminPopup;
    }

    openAdminPop(admin: any): void {
        console.log(admin);
        this.showAdminPopup = true;
        this.selectedAdmin = admin;
    }

    async saveAdmin(): Promise<void> {
        let response = await this.updateSystemUser({
            id: this.selectedAdmin.id,
            authentication: parseInt(this.selectStatus.nativeElement.value),
            name: this.nameInspectInput.nativeElement.value,
            email: this.emailInspectInput.nativeElement.value,
        })
        console.log(response)
        this.showAdminPopup = false;
        this.selectedAdmin = null;
        this.initialize();
    }
    
    // Init

    async initialize(): Promise<void> {
        try {
            if (this.selectedDatabase === 'mobile') {
                this.listData.mobile = await this.getMobileUsers();
                this.formatMobileUsers();
                this.loaded = true;
            } else if (this.selectedDatabase === 'system') {
                this.listData.system = await this.getSystemUsers();
                this.formatSystemUsers();
                this.loaded = true;
            }
        } catch (error) {
            console.error(error);
        }
    }

    // Update System User Request

    async updateSystemUser(request: any): Promise<any> {
        try {
            const response = await this.request.post(
                `${environment.CORE_API_URL}/admin/edit/adminUser`,
                request
            );
            return response.body as any;
        } catch (error) {
            throw error;
        }
    }


    // System User Request

    async getSystemUsers(): Promise<User[]> {
        try {
            const response = await this.request.get(
                `${environment.CORE_API_URL}/admin/list/adminUsers/15`
            );
            return response.body as User[];
        } catch (error) {
            throw error;
        }
    }

    // Continued: Format System Users

    async formatSystemUsers(): Promise<void> {
        try {
            this.listData.system.forEach((user: User) => {
                user.display = {
                    last_active: user.last_active
                        ? dayjs(user.last_active).fromNow()
                        : 'Unavailable',
                };
            });
        } catch (error) {
            throw error;
        }
    }

    // Mobile User Request

    async getMobileUsers(): Promise<MobileUser[]> {
        try {
            const response = await this.request.get(
                `${environment.CORE_API_URL}/admin/list/mobileUsers?limit=50&offset=0`
            );
            return response.body as MobileUser[];
        } catch (error) {
            throw error;
        }
    }

    // Continued: Format Mobile User

    async formatMobileUsers(): Promise<void> {
        try {
            this.listData.mobile.forEach((user: MobileUser) => {
                // TODO implement displays
            });
        } catch (error) {
            throw error;
        }
    }

    async changedDataSource(event: any): Promise<void> {
        try {
            this.selectedDatabase = event.target.value;
            this.router.navigate([], {
                relativeTo: this.route,
                queryParams: { source: this.selectedDatabase },
                queryParamsHandling: 'merge',
            });
            this.loaded = false;
            if (this.selectedDatabase === 'mobile') {
                // Get mobile accts
                this.listData.mobile = await this.getMobileUsers();
                this.formatMobileUsers();
                this.loaded = true;
            }
            if (this.selectedDatabase === 'system') {
                // Get system accts
                this.listData.system = await this.getSystemUsers();
                this.formatSystemUsers();
                this.loaded = true;
            }
        } catch (error) {
            console.error(error);
        }
    }

    async claimUsername(user: User): Promise<void> {
        let person = prompt('Please enter a username', '');
        if (person == null || person == '') {
            console.error('No input into Prompt');
        } else {
            user.username = person;
            await this.updateSystemUser({
                id: user.id,
                authentication: user.authentication.id,
                name: user.name,
                email: user.email,
                username: user.username,
            })
        }
    }
}
