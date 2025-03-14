import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginserviseService } from './login/loginservise.service';
import { Subscription, interval } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'R-Asset';
  private wsSubscription!: Subscription;
  displayLogoutDialog: boolean = false;  // To control the visibility of the dialog
  loggedInUser: string = '';
  remainingTime: number = 10; // Countdown time in seconds (start with 10 seconds)
  // wsSubscription: any;
 
  interval: any;
 
 
  constructor(private router: Router, private wsConnection: LoginserviseService,private cookie: CookieService) {}
 
  ngOnInit(): void {
    window.scroll(0,0);
    window.history.pushState(null, '', window.location.href);
    window.onpopstate = () => {
      window.history.go(1)
    };
    window.addEventListener('beforeunload', this.handleBeforeUnload);
    // console.log('App component ready')
  }
 
  public getRouter(): Router {
    return this.router;
  }
 
  ngOnDestroy() {
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
  }
 
  handleBeforeUnload = (event: BeforeUnloadEvent) => {
    const navigationEntries = performance.getEntriesByType('navigation');
    if (navigationEntries.length > 0 &&(navigationEntries[0] as PerformanceNavigationTiming).type === 'reload') {
      sessionStorage.setItem('StopSendingToWebSocket', 'true');
      sessionStorage.setItem('StopRecivingToWebSocket', 'true');
    }
  };
 
  ngAfterViewInit(): void {
    interval(5000).subscribe(() => {
      // console.log(sessionStorage.getItem('StopSendingToWebSocket'))
        if (sessionStorage.getItem('email') && this.cookie.check('plant') && sessionStorage.getItem('StopSendingToWebSocket') == 'true') {
          // console.log('Sending')
          const message = {
            mail: sessionStorage.getItem('email'),
            session: sessionStorage.getItem('session_id'),
            plantname: this.cookie.get('plant'),
            username: this.getFullName(sessionStorage.getItem('email')|| '')
          };
          let connectionStatus = this.wsConnection.send(message);
          if (!connectionStatus) {
            // console.log("Connecting to WebSocket...");
            this.WebSocketConnection();
          }
        }else{
 
        }
    });
  }
 
  getFullName(email: string): string {
    const emailParts = email.split('@')[0].split('.');
    let initials = '';
    for(let i = 0; i < emailParts.length; i++){
      initials += emailParts[i]
    }
    return initials;
  }
 
 // WebSocketConnection method
 WebSocketConnection() {
  this.wsSubscription = this.wsConnection.connect('ws/session', this.getFullName(sessionStorage.getItem('email') || '')).subscribe(
    message => {
      if (sessionStorage.getItem('StopRecivingToWebSocket') == 'true') {
        const Session = message.message;
        const currentSession = sessionStorage.getItem('session_id');
 
        if (Session !== currentSession) {
          sessionStorage.setItem('StopRecivingToWebSocket', 'false')
 
          // Show dialog with the logged-in user credentials
          this.loggedInUser = sessionStorage.getItem('email') || ''; // Assuming email is saved in sessionStorage
 
          // Open the logout dialog
          this.displayLogoutDialog = true;
 
          // Reset the countdown timer to 10 seconds or the desired value
          this.remainingTime = 10;  // You can set this to any value like 10, 5, etc.
 
          // Start the countdown interval
          this.startCountdown();
 
          // Perform logout actions after the countdown reaches 0
          setTimeout(() => {
            window.onbeforeunload = null;
            sessionStorage.setItem('StopSendingToWebSocket', 'false')
            sessionStorage.clear();
            localStorage.setItem('logouttost', 'Logout Successfully');
            this.router.navigateByUrl('/').then(() => {
              window.location.reload();
            });
          }, 10000);  // 10 seconds delay for logout after dialog is shown
          window.onbeforeunload = (event) => {
            event.preventDefault();
            return (event.returnValue = 'Changes you made may not be saved.');
          };
        } else {
          // console.log('Session token matches');
          sessionStorage.setItem('StopSendingToWebSocket', 'true')
        }
      }
    }
  );
}
 
  // Start the countdown interval
  startCountdown() {
    this.interval = setInterval(() => {
      this.remainingTime -= 1; // Decrease time by 1 every second
      if (this.remainingTime <= 0) {
        clearInterval(this.interval); // Clear the interval when the time reaches 0
      }
    }, 1000); // Update every 1 second
  }
 
  // To stop the countdown if needed
  stopCountdown() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
 
}