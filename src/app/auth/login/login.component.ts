import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  forgotPassword(): void {
    window.alert("Forgot password - Unknown Error Occured");
  }

  focusInput(id: string): void {
    document.getElementById(id)!.focus();
  }

  login(): void {
    window.alert("Login Successful");
  }

  async loginWithGoogle(): Promise<void> {
    try {
      const response = await this.authService.google();
    } catch (error) {
      console.error(error)
    }
  }

}
