import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoggedIn: boolean = false;

  constructor(private Cookie: CookieService, private router: Router) { }

  isAuthenticated(): boolean {

    const cookies = this.Cookie.getAll()

    if (this.Cookie.check('username') &&  this.Cookie.check('email') && this.Cookie.check('plantname')){
      this.isLoggedIn = true;
      return this.isLoggedIn;
    }

    return this.isLoggedIn;

  }
  logout() {
    localStorage.removeItem('timerStartTime');
    localStorage.removeItem('lastSession');
    // console.log('Logging out...');
    this.router.navigate(['/']);
  }
}
