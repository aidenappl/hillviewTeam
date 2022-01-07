import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from 'src/services/auth/auth.interfaces';
import { RequestService } from 'src/services/http/request.service';

export interface ListDataArr {
  system: Array<User>,
  mobile: Array<User>
}
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  loaded = false;

  selectedDatabase = 'system';

  listData: ListDataArr = {
    system: [],
    mobile: [],
  }

  constructor(
    private request: RequestService
  ) { }

  ngOnInit(): void {
    this.initialize();
  }

  async initialize(): Promise<void> {
    try {
      this.listData.system = await this.getSystemUsers();
      this.loaded = true;
    } catch (error) {
      console.error(error)
    }
  }

  async getSystemUsers(): Promise<User[]> {
    try {
      const response = await this.request.get(`${environment.CORE_API_URL}/admin/list/adminUsers/15`)
      return (response.body as User[])
    } catch (error) {
      throw error
    }
  }

  changedDataSource(event: any): void {
    console.log(event.target.value);
    this.selectedDatabase = event.target.value;
  }

}
