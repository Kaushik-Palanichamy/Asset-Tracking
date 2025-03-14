import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { urlComponent } from 'src/app/url';

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {


  constructor(private http: HttpClient, private cookie: CookieService) { }

  // url='http://127.0.0.1:8000/'
  // url = "http://172.29.29.181:8077/"
  url = new urlComponent().url

  getData(endpoint: string, endpoint2?: string):Observable <any> {
    let params = new HttpParams().set('plantname',this.cookie.get('plantname'));
    let headers = new HttpHeaders().set('Authorization', 'auth-token');
     const pl = sessionStorage.getItem('currentplant') || ''
    return this.http.get(this.url  + localStorage.getItem(pl) + '/'+ endpoint+'/',{params,headers})
  }

  postData(endpoint:string, Data:any):Observable <any> {
    let params = new HttpParams().set('plantname',this.cookie.get('plantname'));
    let headers = new HttpHeaders().set('Authorization', 'auth-token');
     const pl = sessionStorage.getItem('currentplant') || ''
    return this.http.post(this.url + localStorage.getItem(pl) + '/' + endpoint + '/', Data, {params,headers})
  }

  putData(endpoint:string, Data:any):Observable <any> {
    let params = new HttpParams().set('plantname',this.cookie.get('plantname'));
    let headers = new HttpHeaders().set('Authorization', 'auth-token');
     const pl = sessionStorage.getItem('currentplant') || ''
    return this.http.put(this.url + localStorage.getItem(pl) + '/' + endpoint + '/', Data,{params,headers})
  }

  deleteData(endpoint:string, code:any){
    let params = new HttpParams().set('plantname',this.cookie.get('plantname'));
    const body = JSON.stringify({tkt_ticketcode: code});
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const options = ({
      headers : headers,
      body : body,
      params
    });
     const pl = sessionStorage.getItem('currentplant') || ''
    return this.http.delete(this.url + localStorage.getItem(pl) + '/' + endpoint + '/',options)
  }
  deleteDatas(endpoint:string, code:any){
    let params = new HttpParams().set('plantname',this.cookie.get('plantname'));
    const body = JSON.stringify({code: code});
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const options = ({
      headers : headers,
      body : body,
      params
    });
     const pl = sessionStorage.getItem('currentplant') || ''
    // console.log(options);
    return this.http.delete(this.url + localStorage.getItem(pl) + '/' + endpoint + '/',options)
  }
}
