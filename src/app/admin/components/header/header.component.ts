import { Component, Input, OnInit } from '@angular/core';

import * as dayjs from 'dayjs'

@Component({
  selector: 'app-admin-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {

  @Input() title?: string;
  @Input() subtitle?: string;

  constructor() { }

  ngOnInit(): void {
    this.setDefaultSubtitle();
  }

  setDefaultSubtitle(): void {
    this.subtitle = dayjs(Date.now()).format('dddd MMMM DD, YYYY');
  }

}
