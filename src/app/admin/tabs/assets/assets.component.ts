import { Component, OnInit, ViewChild } from '@angular/core';
import * as dayjs from 'dayjs';
import { environment } from 'src/environments/environment';
import { Asset, Checkout } from 'src/providers/asset.interface';
import { RequestService } from 'src/services/http/request.service';

@Component({
    selector: 'app-assets',
    templateUrl: './assets.component.html',
    styleUrls: ['./assets.component.scss'],
})
export class AssetsComponent implements OnInit {
    constructor(private request: RequestService) {}

    @ViewChild('nameInspectInput', {static: false}) nameInspectInput: any;
    @ViewChild('identifierInspectInput', {static: false}) identifierInspectInput: any;
    @ViewChild('descriptionInspectInput', {static: false}) descriptionInspectInput: any;

    assets: Asset[] = [];
    loaded: boolean = false;
    selectedAsset: Asset = {} as Asset;
    showAssetInspector: boolean = false;

    ngOnInit(): void {
        this.initialize();
    }

    async initialize(): Promise<void> {
        try {
            this.assets = await this.getAssets();
            await this.formatAssets();
            this.loaded = true;
        } catch (error) {
            console.error(error);
        }
    }

    async formatAssets(): Promise<void> {
        try {
            this.assets.forEach((asset: Asset) => {});
        } catch (error) {
            throw error;
        }
    }

    async getAssets(): Promise<Asset[]> {
        try {
            const response = await this.request.get(
                `${environment.CORE_API_URL}/admin/list/assets/40`
            );
            return response.body as Asset[];
        } catch (error) {
            throw error;
        }
    }

    inspectAsset(id: number): void {
        this.selectedAsset = this.assets.find((asset: Asset) => {
            return asset.id === id;
        }) as Asset;
        this.showAssetInspector = true;
    }

    async submitChanges(): Promise<void> {
        try {
          const data = {
            id: this.selectedAsset.id,
            name: this.nameInspectInput.nativeElement.value,
            identifier: this.identifierInspectInput.nativeElement.value,
            description: this.descriptionInspectInput.nativeElement.value,
          }
          const response = await this.request.post(`${environment.CORE_API_URL}/admin/edit/asset`, data);
          console.log(response)
          if (response.body) {
            const body = response.body as Asset;
            this.assets.forEach((asset: Asset) => {
              if (asset.id === body.id) {
                asset = body;
              }
            })
          }
        } catch (error) {
          console.error(error)
        }
    }
}
