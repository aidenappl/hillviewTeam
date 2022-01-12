import { Component, OnInit } from '@angular/core';
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

  ngOnInit(): void {
    this.initialize();
  }

  async initialize(): Promise<void> {
    try {
      this.checkouts = await this.getCheckouts();
    } catch (error) {
      console.error(error);
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
