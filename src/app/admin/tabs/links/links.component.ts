import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as dayjs from 'dayjs';
import { environment } from 'src/environments/environment';

import { Link } from 'src/providers/link.interface';
import { RequestService } from 'src/services/http/request.service';

@Component({
    selector: 'app-links',
    templateUrl: './links.component.html',
    styleUrls: ['./links.component.scss'],
})
export class LinksComponent implements OnInit {
    constructor(private request: RequestService) {}

    @ViewChild('link', { static: false }) linkInput!: ElementRef;
    @ViewChild('destination', { static: false }) destinationInput!: ElementRef;

    links: Link[] = [];

    bools = {
        showSplash: false,
        showLinkCreator: false,
        loaded: false,
        creatingLink: false,
    };

    ngOnInit(): void {
        this.initialize();
    }

    toggleCreateLinkModal(bool: boolean): void {
        this.bools.showLinkCreator = bool;
        this.toggleSplash(bool);
    }

    toggleSplash(bool: boolean): void {
        this.bools.showSplash = bool;
    }

    async initialize(): Promise<void> {
        try {
            let links = await this.getLinks();
            links = await this.formatLinks(links);
            console.log(links);
            this.links = links;
            this.bools.loaded = true;
        } catch (error) {
            console.error(error);
        }
    }

    async createLink(): Promise<void> {
        try {
            this.bools.creatingLink = true;
            const response = await this.request.post(
                `${environment.CORE_API_URL}/admin/create/link`,
                {
                    route: this.linkInput.nativeElement.value,
                    endpoint: this.destinationInput.nativeElement.value,
                }
            );
            setTimeout(() => {
              this.bools.creatingLink = false;
              this.toggleCreateLinkModal(false);
              this.initialize();
            }, 800)
        } catch (error) {
            console.error(error);
        }
    }

    async formatLinks(links: Link[]): Promise<Link[]> {
        try {
            links.forEach((link) => {
                link.route = '/' + link.route;
                link.display = {
                    inserted_at: dayjs(link.inserted_at).format(
                        'MMMM DD, YYYY [at] hh:mm A'
                    ),
                };
            });
            return links;
        } catch (error) {
            throw error;
        }
    }

    async getLinks(): Promise<Link[]> {
        try {
            const response = await this.request.get(
                `${environment.CORE_API_URL}/admin/list/links?limit=50`
            );
            let returner = response.body || [];
            return returner as Link[];
        } catch (error) {
            throw error;
        }
    }
}
