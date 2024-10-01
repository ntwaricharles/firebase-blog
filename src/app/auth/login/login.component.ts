import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private authService: AuthService) {}

  onLogin() {
    this.authService
      .login(this.email, this.password)
      .then(() => alert('Logged in successfully!'))
      .catch((err) => alert('Login failed: ' + err.message));
  }

  onGoogleSignIn() {
    this.authService
      .googleSignIn()
      .then(() => alert('Logged in with Google!'))
      .catch((err) => alert('Google login failed: ' + err.message));
  }
}
