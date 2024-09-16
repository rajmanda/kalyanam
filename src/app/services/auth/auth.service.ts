import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router: Router) {}

  getUserProfile() {
    const user = sessionStorage.getItem('loggedInUser');
    return JSON.parse(user || '{}'); // Returns an empty object if user is null
  }

  signOut() {
    sessionStorage.removeItem('loggedInUser');
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }
}
