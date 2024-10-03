import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialize the reactive form
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService
        .login(email, password)
        .then(() => {
          alert('Logged in successfully!');
          this.router.navigate(['/blog']);
        })
        .catch((err) => alert('Login failed: ' + err.message));
    } else {
      alert('Please fix the errors in the form.');
    }
  }

  onGoogleSignIn() {
    this.authService
      .googleSignIn()
      .then(() => {
        alert('Logged in with Google!');
        this.router.navigate(['/blog']);
      })
      .catch((err) => alert('Google login failed: ' + err.message));
  }
}
