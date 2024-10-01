import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { GoogleAuthProvider } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  // Email/Password Registration
  register(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  // Email/Password Login
  login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  // Google Login
  googleSignIn() {
    return this.afAuth.signInWithPopup(new GoogleAuthProvider());
  }

  // Logout
  logout() {
    return this.afAuth.signOut().then(() => {
      this.router.navigate(['/']);
    });
  }

  // Get User State
  getUser() {
    return this.afAuth.authState;
  }
}
