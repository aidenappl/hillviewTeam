import { Component, OnInit } from '@angular/core';
import { UserProvider } from 'src/providers/user.provider';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.scss']
})
export class RedirectComponent implements OnInit {

  constructor(
    private user: UserProvider
  ) { }

  ngOnInit(): void {

  }

}
