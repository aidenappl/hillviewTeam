import { Component, OnInit } from '@angular/core';
import * as dayjs from 'dayjs';
import { environment } from 'src/environments/environment';
import { Checkout } from 'src/providers/asset.interface';
import { RequestService } from 'src/services/http/request.service';

@Component({
  selector: 'app-checkouts',
  templateUrl: './checkouts.component.html',
  styleUrls: ['./checkouts.component.scss']
})
export class CheckoutsComponent implements OnInit {

  constructor(
    private request: RequestService
  ) { }

  checkouts: Checkout[] = [];
  checkoutsSelfStore: Checkout[] = [];
  loaded: boolean = false;

  showFilter: boolean = false;

  filters: any = {
    missing: false
  }

  ngOnInit(): void {
    this.initialize();
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }

  async showMissingGear(): Promise<void> {
    try {
      this.filters.missing = true;
      this.checkoutsSelfStore = this.checkouts
      let checkouts = await this.getOpenCheckouts();
      checkouts = await this.formatCheckouts(checkouts);
      this.checkouts = checkouts
    } catch (error) {
      console.error(error)
    }
  }

  showAllGear(): void {
    this.filters.missing = false
    this.checkouts = this.checkoutsSelfStore
  }

  async initialize(): Promise<void> {
    try {
      let checkouts = await this.getCheckouts();
      checkouts = await this.formatCheckouts(checkouts);
      this.checkouts = checkouts
      this.loaded = true;
    } catch (error) {
      console.error(error);
    }
  }

  async formatCheckouts(checkouts: Checkout[]): Promise<Checkout[]> {
    try {
      checkouts.forEach((checkout: Checkout) => {
        checkout.display = {
          time_out: dayjs(checkout.time_out).format("MM/DD/YY hh:mm A"),
        time_in: checkout.time_in ? dayjs(checkout.time_in).format("MM/DD/YY hh:mm A") : (checkout.expected_in ? `Expected : ${dayjs(checkout.expected_in).format("MM/DD/YY")}` : 'Not Returned')
        }
      });
      return checkouts;
    } catch (error) {
      throw error
    }
  }

  async getCheckouts(): Promise<Checkout[]> {
    try {
      const response = await this.request.get(`${environment.CORE_API_URL}/admin/list/checkouts?limit=50`)
      return (response.body as Checkout[]);
    } catch (error) {
      throw error
    }
  }

  async getOpenCheckouts(): Promise<Checkout[]> {
    try {
      const response = await this.request.get(`${environment.CORE_API_URL}/admin/list/openCheckouts?limit=50`)
      return (response.body as Checkout[]);
    } catch (error) {
      throw error
    }
  }

}
