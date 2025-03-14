// footer.component.ts
import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { faStopwatch } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  providers: [DatePipe]
})
export class FooterComponent {

  timer = faStopwatch
}
