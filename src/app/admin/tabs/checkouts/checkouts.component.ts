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
  loaded: boolean = false;

  ngOnInit(): void {
    this.initialize();
  }

  async initialize(): Promise<void> {
    try {
      this.checkouts = await this.getCheckouts();
      await this.formatCheckouts();
      this.loaded = true;
    } catch (error) {
      console.error(error);
    }
  }

  async formatCheckouts(): Promise<void> {
    try {
      this.checkouts.forEach((checkout: Checkout) => {
        console.log(checkout)
        checkout.display = {
          time_out: dayjs(checkout.time_out).format("MM/DD/YY hh:mm A"),
          time_in: checkout.time_in ? dayjs(checkout.time_in).format("MM/DD/YY hh:mm A") : (checkout.expected_in ? `Expected : ${dayjs(checkout.expected_in).format("MM/DD/YY")}` : 'Not Returned')
        }
      });
    } catch (error) {
      throw error
    }
  }

  async getCheckouts(): Promise<Checkout[]> {
    try {
      const response = await this.request.get(`${environment.CORE_API_URL}/admin/list/checkouts/25`)
      return (response.body as Checkout[]);
    } catch (error) {
      throw error
    }
  }

}
