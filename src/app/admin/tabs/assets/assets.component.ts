import { Component, OnInit } from '@angular/core';
import * as dayjs from 'dayjs';
import { environment } from 'src/environments/environment';
import { Asset, Checkout } from 'src/providers/asset.interface';
import { RequestService } from 'src/services/http/request.service';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss']
})
export class AssetsComponent implements OnInit {

  constructor(
    private request: RequestService
  ) { }

  assets: Asset[] = [];
  loaded: boolean = false;

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
      this.assets.forEach((asset: Asset) => {
        
      });
    } catch (error) {
      throw error
    }
  }

  async getAssets(): Promise<Asset[]> {
    try {
      const response = await this.request.get(`${environment.CORE_API_URL}/admin/list/assets/40`)
      return (response.body as Asset[]);
    } catch (error) {
      throw error
    }
  }

}
