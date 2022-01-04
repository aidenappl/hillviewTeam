import { Component, OnInit } from '@angular/core';
import { UserProvider } from 'src/providers/user.provider';

@Component({
  selector: 'app-pending',
  templateUrl: './pending.component.html',
  styleUrls: ['./pending.component.scss']
})
export class PendingComponent implements OnInit {

  constructor(
    public user: UserProvider
  ) { }

  ngOnInit(): void {
  }

}
