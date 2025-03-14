import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { NotificationsService } from './notifications.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent implements OnInit {
  notifications: any[] = [];
  isDialogOpen = false;
  onlyShowUnread = false;
  pollingInterval: any;
  lastStatus: string | null = null;

  constructor(private service: NotificationsService, private eRef: ElementRef) {}

  ngOnInit() {
    // 🔹 Load notifications from localStorage (including read/unread state)
    this.notifications = this.service.loadNotifications();
  
    // 🔹 Declare a Set to track existing notification IDs (prevents duplicates)
    const existingIds = new Set(this.notifications.map(n => n.id));
  
    // 🔹 Fetch previous email logs from the backend
    this.service.getEmailLogs().subscribe({
      next: (response) => {
        console.log('Fetched email logs:', response);
  
        response.forEach((log: { id: number; timestamp: string; status: string; email_type: string }) => {
          if (!existingIds.has(log.id)) { 
            this.notifications.unshift({
              id: log.id, // Track notification by ID
              date: log.timestamp.split(" ")[0],
              time: log.timestamp.split(" ")[1],
              status: log.status,
              emailType: log.email_type,
              timestamp: log.timestamp,
              unread: true // Default as unread for new entries
            });
            existingIds.add(log.id); // Add to Set
          }
        });
  
        this.service.saveNotifications(this.notifications); // 🔹 Save to localStorage
      },
      error: (error) => console.error('Error fetching email logs:', error)
    });
  
    // 🔹 Poll for new email status updates every 5 seconds
    this.pollingInterval = setInterval(() => {
      this.service.getTriggerStatus('email-logs/').subscribe({
        next: (responseArray) => {
          console.log('New email status received:', responseArray);
  
          if (Array.isArray(responseArray)) {
            responseArray.forEach((response) => {
              if (!existingIds.has(response.id)) {
                this.addNotification(response.id, response.status, response.emailType, response.timestamp);
                existingIds.add(response.id);
              }
            });
  
            this.service.saveNotifications(this.notifications); // 🔹 Save new updates
          }
        },
        error: (error) => console.error('Error fetching email trigger status:', error)
      });
    }, 5000);
  }
  
  /** 🔹 Add new notification while avoiding duplicates */
  addNotification(id: number, status: string, emailType: string, timestamp: string) {
    if (!id || !status || !emailType || !timestamp) {
      console.error("Missing notification data:", { id, status, emailType, timestamp });
      return;  // Prevent adding undefined data
    }
  
    const [date, time] = timestamp.split(" ");
    if (!date || !time) {
      console.error("Invalid timestamp format:", timestamp);
      return;
    }
  
    const newNotification = {
      id,
      date,
      time,
      status,
      emailType,
      timestamp,
      unread: true
    };
  
    this.notifications.unshift(newNotification);
    this.service.saveNotifications(this.notifications); // Persist in localStorage
    console.log("Notification added:", newNotification);
  }
  
  
  

  /** 🔹 Get unread notification count */
  get unreadCount() {
    return this.notifications.filter(n => n.unread).length;
  }

  /** 🔹 Toggle notification dropdown */
  toggleNotifications() {
    if (this.notifications.length > 0) {
      // this.isDialogOpen = !this.isDialogOpen;
    }
  }

  /** 🔹 Filter notifications based on unread state */
  filteredNotifications() {
    return this.onlyShowUnread
      ? this.notifications.filter(n => n.unread)
      : this.notifications;
  }

  /** 🔹 Mark notification as read on hover */
/** 🔹 Mark notification as read and persist state */
/** 🔹 Mark notification as read and persist */
markAsRead(notification: any) {
  if (!notification || !notification.unread) return;

  notification.unread = false; // Mark as read
  this.service.saveNotifications(this.notifications); // Save updated state
}


  

  /** 🔹 Clear all notifications */
 /** 🔹 Clear all notifications and persist state */
/** 🔹 Clear all notifications and persist */
clearNotifications() {
  this.notifications = []; // Reset notifications array
  this.service.clearNotifications(); // Call service to clear localStorage
  console.log('All notifications cleared.');
}



  /** 🔹 Close dialog when clicking outside */
  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (this.isDialogOpen && !this.eRef.nativeElement.contains(event.target)) {
      this.isDialogOpen = false;
    }
  }

  /** 🔹 Stop polling on component unload */
  ngOnDestroy() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  }
}
