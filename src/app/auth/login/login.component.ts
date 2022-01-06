import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserProvider } from 'src/providers/user.provider';
import { AuthService } from 'src/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @ViewChild('emailInput', {static: false}) emailInput!: ElementRef;
  @ViewChild('passwordInput', {static: false}) passwordInput!: ElementRef;

  constructor(
    private authService: AuthService,
    private router: Router,
    private user: UserProvider
  ) { }

  actionInProg = false;
  googleBtn = false;
  localBtn = false;

  ngOnInit(): void {
  }

  forgotPassword(): void {
    window.alert("Forgot password - Unknown Error Occured");
  }

  focusInput(id: string): void {
    document.getElementById(id)!.focus();
  }

  async login(): Promise<void> {
    try {
      if (this.actionInProg) {return}
      this.actionInProg = true;
      this.localBtn = true;
      const success = await this.authService.local({
        email: this.emailInput.nativeElement.value.trim(),
        password: this.passwordInput.nativeElement.value
      });
      if (success) {
        this.user.goHome();
      }
      this.actionInProg = false;
      this.localBtn = false;
    } catch (error) {
      this.actionInProg = false;
      this.localBtn = false;
      console.error(error)
    }
  }

  async loginWithGoogle(): Promise<void> {
    try {
      if (this.actionInProg) {return}
      this.actionInProg = true;
      this.googleBtn = true;
      const success = await this.authService.google();
      if (success) {
        this.user.goHome();
      }
      this.actionInProg = false;
      this.googleBtn = false;
    } catch (error) {
      this.actionInProg = false;
      this.googleBtn = false;
      console.error(error)
    }
  }

}
