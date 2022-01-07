import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  selectedDatabase = 'system';

  constructor() { }

  ngOnInit(): void {
  }

  changedDataSource(event: any): void {
    console.log(event.target.value);
    this.selectedDatabase = event.target.value;
  }

}
