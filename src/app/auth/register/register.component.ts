import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  // Function to handle user registration
  onRegister() {
    if (this.password === this.confirmPassword) {
      this.authService
        .register(this.email, this.password)
        .then(() => {
          alert('Registration successful!');
          this.router.navigate(['/login']); 
        })
        .catch((err: any) => {
          this.errorMessage = err.message; 
        });
    } else {
      this.errorMessage = 'Passwords do not match!'; 
    }
  }
}
