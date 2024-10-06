import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { GoogleAuthProvider, User } from 'firebase/auth';
import { map, Observable } from 'rxjs';
import { User as FirebaseUser } from '@angular/fire/auth';



@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<FirebaseUser | null>;

  constructor(private afAuth: AngularFireAuth, private router: Router) {
    this.user$ = this.afAuth.authState as Observable<FirebaseUser | null>; // Type assertion here
  }
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
  getUser(): Observable<User | null> {
    return this.user$; // Return the user$ observable directly
  }
}
