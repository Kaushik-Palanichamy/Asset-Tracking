import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { urlComponent } from '../url';

interface TriggerResponse {
  status: string;
  emailType: string;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private notificationsSubject = new BehaviorSubject<any[]>(this.loadNotifications());
  notifications$ = this.notificationsSubject.asObservable();
  private lastStatus: string | null = null;
  url = new urlComponent().url;
  pl = sessionStorage.getItem('currentplant') || '';

  constructor(private http: HttpClient, private cookie: CookieService) {}

 /** 🔹 Fetch email logs from backend */
 getEmailLogs(): Observable<any> {
  return this.http.get<any>(`${this.url}${localStorage.getItem(this.pl)}/email-logs/`)
    .pipe(
      tap(response => console.log('Fetched email logs:', response)),
      catchError(error => {
        console.error('Error fetching email logs', error);
        return throwError(() => error);
      })
    );
}

/** 🔹 Get live email trigger status */
getTriggerStatus(endpoint: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.url}${localStorage.getItem(this.pl)}/${endpoint}`)
    .pipe(
      tap(response => {
        console.log('Received trigger status:', response);

        if (!Array.isArray(response)) {
          console.error('Invalid API response structure:', response);
          return;
        }

        response.forEach((log) => {
          if (log.status && log.email_type && log.timestamp) {
            this.addNotification(log.status, log.email_type, log.timestamp);
          } else {
            console.warn("Missing notification data:", log);
          }
        });
      }),
      catchError(error => {
        console.error('Error fetching trigger status', error);
        return throwError(() => error);
      })
    );
}



/** 🔹 Add notification & persist */
addNotification(status: string, emailType: string, timestamp: string) {
  const now = new Date(timestamp); // Use the timestamp from the API
  const newNotification = {
    emailType: emailType,
    status: status,
    date: now.toLocaleDateString(),
    time: now.toLocaleTimeString(),
    // unread: true
  };

  // Add the notification to the list and update localStorage
  const updatedNotifications = [newNotification, ...this.notificationsSubject.value];
  this.notificationsSubject.next(updatedNotifications);
  this.saveNotifications(updatedNotifications);
  console.log('Notification added:', newNotification);
}



/** 🔹 Clear notifications from localStorage */
clearNotifications() {
  localStorage.setItem('notifications', JSON.stringify([])); // Store empty array
  this.notificationsSubject.next([]); // Emit empty list for UI update
  console.log('Notifications cleared successfully.');
}




/** 🔹 Load notifications from localStorage */
loadNotifications(): any[] {
  const storedNotifications = localStorage.getItem('notifications');
  return storedNotifications ? JSON.parse(storedNotifications) : [];
}




/** 🔹 Save notifications to localStorage (Preserve read state) */
saveNotifications(notifications: any[]) {
  localStorage.setItem('notifications', JSON.stringify(notifications));
}



}



// const pl = sessionStorage.getItem('currentplant') || '';
// return this.http.get<TriggerResponse>(`${this.url}${localStorage.getItem(this.pl)}/${endpoint}`)