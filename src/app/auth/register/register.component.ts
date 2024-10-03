import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService 
  ) {}

  ngOnInit(): void {
    // Initialize the reactive form
    this.registerForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  // Function to handle user registration
  onRegister() {
    if (this.registerForm.valid) {
      const { email, password } = this.registerForm.value;
      this.authService
        .register(email, password)
        .then(() => {
          this.toastr.success('Registration successful!');
          this.router.navigate(['/login']);
        })
        .catch((err: any) => {
          this.errorMessage = err.message;
          this.toastr.error('Registration failed: ' + this.errorMessage); 
        });
    } else {
      this.errorMessage = 'Please fix the errors in the form.';
      this.toastr.warning(this.errorMessage);
    }
  }
}
