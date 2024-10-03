import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
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
          this.toastr.success('Logged in successfully!');
          this.router.navigate(['/blog']);
        })
        .catch((err) => this.toastr.error('Login failed: ' + err.message));
    } else {
      this.toastr.warning('Please fix the errors in the form.');
    }
  }

  onGoogleSignIn() {
    this.authService
      .googleSignIn()
      .then(() => {
        this.toastr.success('Logged in with Google!'); 
        this.router.navigate(['/blog']);
      })
      .catch((err) => this.toastr.error('Google login failed: ' + err.message));
  }
}
