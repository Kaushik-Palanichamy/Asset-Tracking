import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import {
  MessageService,
} from 'primeng/api';
import {
  faEye,
  faEyeSlash,
  faRightToBracket,
  faDashboard,
  faAt,
  faLock,
  faMapMarkedAlt,
  faLightbulb,
  faSolarPanel,
  faIndustry,
} from '@fortawesome/free-solid-svg-icons';
import {
  LoginserviseService
} from './loginservise.service';
import {
  Router
} from '@angular/router';
import {
  CookieService
} from 'ngx-cookie-service';
import { urlComponent } from '../url';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  // @Output() locationEmitter = new EventEmitter<{ latitude: number; longitude: number }>();

  eye = faEye;
  eyeCls = faEyeSlash;
  log = faRightToBracket;

  light = faLightbulb;
  solar = faSolarPanel;
  industry = faIndustry
   SelectedPlant: string = ''

  AutencateData: any;

  form: FormGroup;

  showPassword: boolean = false;

  search = faDashboard;
  atsymbol = faAt;
  lock = faLock;
  hand = faMapMarkedAlt;

  plantsname : any;
  loadingMessages: string[] = [
    "Monitoring and Managing Assets throughout their lifecycle",
    "Increase your operational efficiency with real-time monitoring",
    "Asset Tracking helps to improve asset reliability and performance",
    "Enhance security & utilization of physical assets for logistic companies",
    "Get actionable insights in Inventory Management",
  ];
  messageIndex: number = 0;
  currentMessage: string = '';
  latitude: number = 12.86027; // Default latitude
  longitude: number = 80.07134; // Default longitude
  timeoutId: any;

  constructor(
    private loginAut: LoginserviseService,
    private messageService: MessageService,
    private router: Router,
    private Cookie: CookieService,
    private urlPort:urlComponent
  ) {
    this.plantsname =[
      {name: 'MATE U3',code: 'MATE U3', port: 8002},
      {name: 'MATE Manesar',code: 'MATE Manesar',port: 8006},
      {name: 'SMRC Chennai',code: 'SMRC Chennai', port: 8001},
      {name: 'MATE Pune',code: 'MATE Pune',port: 8004},
      {name: 'MATE B',code: 'MATE B',port: 8003},
    ]

    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      pl_name: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {

    this.getLocation(); // Get user's location on component initialization


    const loadingMessagesCopy = [...this.loadingMessages];
    this.shuffleLoadingMessages(loadingMessagesCopy);

    this.messageIndex = 0; // Start at the first message
    if (loadingMessagesCopy.length > 0) {
      setTimeout(() => {
        this.showSentence(loadingMessagesCopy);
      }, 200);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  shuffleLoadingMessages(messages: string[]) {
    for (let i = messages.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [messages[i], messages[j]] = [messages[j], messages[i]];
    }
  }

  showSentence(loadingMessagesCopy: string[]) {
    if (this.messageIndex < loadingMessagesCopy.length) {
      this.currentMessage = loadingMessagesCopy[this.messageIndex]; // Set current message
      this.messageIndex++;

      this.clearTimeout();
      this.timeoutId = setTimeout(() => {
        this.showSentence(loadingMessagesCopy);
      }, 3500); // Wait before showing the next sentence
    } else {
      this.messageIndex = 0; // Reset to the start
      this.showSentence(loadingMessagesCopy); // Repeat the messages
    }
  }

  clearTimeout() {
    clearTimeout(this.timeoutId);
  }

  getLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          // console.log('Location fetched:', this.latitude, this.longitude);
        },
        (error) => {
          console.error('Error fetching location:', error);
          switch (error.code) {
            case error.PERMISSION_DENIED:
              console.error('User denied the request for Geolocation.');
              break;
            case error.POSITION_UNAVAILABLE:
              console.error('Location information is unavailable.');
              break;
            case error.TIMEOUT:
              console.error('The request to get user location timed out.');
              break;
            default:
              console.error('An unknown error occurred.');
              break;
          }
        }
      );

    } else {
      console.error('Geolocation is not supported by this browser.');
      this.messageService.add({
        severity: 'warn',
        summary: 'Unsupported',
        detail: 'Geolocation is not supported by your browser.',
      });
    }
  }

  login(): void {

  if (this.form.valid) {
  
    let portName = this.plantsname.find((item:any)=> item.code === this.form.get('pl_name')?.value)
    sessionStorage.setItem('currentplant', portName.code)
    this.plantsname.forEach((element:any) => {
      localStorage.setItem(element.code, element.port)
    });
    sessionStorage.setItem('port',portName.port.toString())
    const loginData = {
      ...this.form.value,
      latitude: this.latitude,
      longitude: this.longitude,
    };
    const selectedPlantCode = this.form.value.pl_name;

    this.loginAut.getPort(selectedPlantCode).subscribe(
      (port) => {
        if (port === null) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Invalid plant selection. Please try again.',
          });
          return;
        }

        this.loginAut.getData(loginData).subscribe(
          (res) => {
            let valid = res.validationstring;
            if (valid === 'Email ID and Password matches') {
              this.Cookie.set('plantname', res.plantname);
              this.Cookie.set('username', res.username);
              this.Cookie.set('email', res.emailid);
              this.Cookie.set('firstname', res.firstname);
              this.Cookie.set('lastname', res.lastname);
              this.Cookie.set('address1', res.address1);
              this.Cookie.set('address2', res.address2);
              this.Cookie.set('language', res.language);
              this.Cookie.set('plant', res.plant);
              
              sessionStorage.setItem('session_id', res.session_id);
              sessionStorage.setItem('username', res.username);
              sessionStorage.setItem('email', res.emailid);
              sessionStorage.setItem('StopSendingToWebSocket', 'true');
              sessionStorage.setItem('StopRecivingToWebSocket', 'true');
              this.Cookie.set('type', res.type);
              this.messageService.add({
                severity: 'success',
                summary: `Welcome ${this.Cookie.get('username')}`,
                detail: 'Authentication Success',
                life: 4000,
              });
              this.router.navigate(['/dashboard']);
            } else {
              this.Cookie.deleteAll();
              this.messageService.add({
                severity: 'error',
                summary: 'Authentication Failed',
                detail: 'Invalid Username or Password',
                life: 4000,
              });
            }
          }
          // (error) => {
          //   this.messageService.add({
          //     severity: 'error',
          //     summary: 'Error',
          //     detail: 'Login failed. Please try again.',
          //   });
          //   console.error('Login error:', error);
          // }
        );
      },
      (error) => {
        console.error('Error fetching port:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Unable to retrieve plant port. Please try again.',
        });
      }
    );
  }
}

  // login(): void {
  //   if (this.form.valid) {
  //     const loginData = {
  //       ...this.form.value,
  //       latitude: this.latitude,
  //       longitude: this.longitude,
  //     };
      
  //     // console.log("location",loginData)
  //     this.getLocation();
  //     this.loginAut.getData(loginData).subscribe(
  //       (res) => {
  //         let valid = res.validationstring;
  //         if (valid === 'Email ID and Password matches') {
  //           this.Cookie.set('plantname', res.plantname);
  //           this.Cookie.set('username', res.username);
  //           this.Cookie.set('email', res.emailid);
  //           this.Cookie.set('firstname', res.firstname);
  //           this.Cookie.set('lastname', res.lastname);
  //           this.Cookie.set('address1', res.address1);
  //           this.Cookie.set('address2', res.address2);
  //           this.Cookie.set('language', res.language);
  //           this.Cookie.set('plant', res.plant);
  //           sessionStorage.setItem('session_id', res.session_id);
  //           sessionStorage.setItem('username', res.username);
  //           sessionStorage.setItem('email', res.emailid);
  //           sessionStorage.setItem('StopSendingToWebSocket', 'true');
  //           sessionStorage.setItem('StopRecivingToWebSocket', 'true');
  //           this.Cookie.set('type', res.type);
  //           // console.log(this.Cookie.getAll());
  //           this.messageService.add({
  //             severity: 'success',
  //             summary: `Welcome ${this.Cookie.get('username')}`,
  //             detail: 'Authentication Success',
  //             life: 4000,
  //           });
  //           this.router.navigate(['/dashboard']);
  //         } else {
  //           this.Cookie.deleteAll();
  //           this.messageService.add({
  //             severity: 'error',
  //             summary: 'Authentication Failed',
  //             detail: 'Invalid Username or Password',
  //             life: 4000,
  //           });
  //         }
  //       },
  //       (error) => {
  //         this.messageService.add({
  //           severity: 'error',
  //           summary: 'Error',
  //           detail: 'Login failed. Please try again.',
  //         });
  //         console.error('Login error:', error);
  //       }
  //     );
  //   }
  // }
 


  // handleBeforeUnload = (event: BeforeUnloadEvent) => {
  //   const navigationEntries = performance.getEntriesByType('navigation');
  //   if (navigationEntries.length > 0 &&(navigationEntries[0] as PerformanceNavigationTiming).type === 'reload') {
  //     sessionStorage.setItem('StopSendingToWebSocket', 'true');
  //     sessionStorage.setItem('StopRecivingToWebSocket', 'true');
  //   }
  // };



}
