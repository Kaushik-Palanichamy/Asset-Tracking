import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FooterService {

  private logoutTimer: any;
  private interval: any;
  private remainingTimeSubject = new BehaviorSubject<number>(3600000); // 1 hour in milliseconds

  remainingTime$ = this.remainingTimeSubject.asObservable();

  constructor(private router: Router) {}

  startLogoutTimer(duration: number = 3600000): void {
    this.remainingTimeSubject.next(duration);

    this.logoutTimer = setTimeout(() => {
      this.logout();
    }, duration);

    const endTime = Date.now() + duration;

    this.interval = setInterval(() => {
      const remainingTime = endTime - Date.now();

      if (remainingTime <= 0) {
        clearInterval(this.interval);
        this.remainingTimeSubject.next(0);
      } else {
        this.remainingTimeSubject.next(remainingTime);
      }
    }, 1000);
  }

  resetLogoutTimer(): void {
    clearTimeout(this.logoutTimer);
    clearInterval(this.interval);
    this.startLogoutTimer();
  }

  logout(): void {
    console.log('Logging out due to inactivity');
    this.router.navigate(['/login']);
  }

  stopLogoutTimer(): void {
    clearTimeout(this.logoutTimer);
    clearInterval(this.interval);
  }
}
