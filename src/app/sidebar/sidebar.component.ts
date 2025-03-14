import { Component } from '@angular/core';
import { faSignOut } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {

  signout = faSignOut

  constructor(private router: Router, private authService: AuthService) { }

  logout(): void {
    this.router.navigate(['/']);
    this.authService.logout(); 
    // console.log("logout");
  }
}
