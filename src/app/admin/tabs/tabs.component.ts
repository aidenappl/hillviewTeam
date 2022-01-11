import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserProvider } from 'src/providers/user.provider';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {

  selectedTab = '';

  constructor(
    public user: UserProvider,
    private router: Router
  ) { }

  ngOnInit() {
    this.selectedTab = this.router.url.split('/')[3].split("?")[0];
  }

  tabPress(val: string): void {
    this.selectedTab = val;
  }

}
