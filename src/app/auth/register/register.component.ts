import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service'; 

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

  constructor(private authService: AuthService) {}

  // Function to handle user registration
  onRegister() {
    if (this.password === this.confirmPassword) {
      this.authService
        .register(this.email, this.password)
        .then(() => {
          console.log('Registration successful');
        })
        .catch((err: any) => {
          this.errorMessage = err.message;
        });
    } else {
      this.errorMessage = 'Passwords do not match!';
    }
  }
}
