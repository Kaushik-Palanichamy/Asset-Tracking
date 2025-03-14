import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, of } from 'rxjs';
import { urlComponent } from '../url';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class LoginserviseService {

  constructor(private http: HttpClient, private cookie:CookieService, private newUrl:urlComponent) { }

  url = new urlComponent().url
  wsurl = new urlComponent().url2
  private webSocketSubject: WebSocketSubject<any> | null = null;
  private readonly webSoketUrl = this.wsurl;

  private plants =[
    {name: 'MATE U3', port: 8002},
    {name: 'MATE Manesar', port: 8006},
    {name: 'SMRC Chennai', port: 8001},
    {name: 'MATE Pune',port: 8004},
    {name: 'MATE B',port: 8003},
  ]

  getPort(plantCode: string): Observable<number | null> {
    const plant = this.plants.find((p) => p.name === plantCode);
    // console.log(plant)
    return of(plant ? plant.port : null);
  }

  // DynamicUrl(url: string, UserData: any): Observable<any> {
  //   const Headers = { 'content-type': 'application/json' };
  //   const body = JSON.stringify(UserData);
  //   return this.http.post(url, body, { headers: Headers });
  // }
  
  

  getData(UserData:any):Observable <any>{
    const Headers = {'content-type': 'application/json'}
    const body = JSON.stringify(UserData)
    const pl = sessionStorage.getItem('currentplant') || ''
    return this.http.post(this.url + localStorage.getItem(pl) + '/'+'loginvalidation'+'/',body,{'headers':Headers})
  }

  public connect(endpoint: string, user: string, plantname?:any): Observable<any> {
     const pl = sessionStorage.getItem('currentplant') || ''
     plantname = localStorage.getItem(pl) + '/'
    const wsUrl = `${this.webSoketUrl}${plantname}${endpoint}/${user}/`;
    // console.log('Connecting to WebSocket URL:', wsUrl);
    this.webSocketSubject = webSocket(wsUrl);  // Establishing WebSocket connection
    return this.webSocketSubject.asObservable();  // Return observable to subscribe
  }

  public send(data: any) {
    if (this.webSocketSubject) {
        this.webSocketSubject.next(data);
        return true;
    } else {
        // console.error('WebSocket is not connected!');
        return false;
    }
}

  public closeConnection(): void {
    if (this.webSocketSubject) {
      this.webSocketSubject.complete();  // Close the connection
    }
  }


}
