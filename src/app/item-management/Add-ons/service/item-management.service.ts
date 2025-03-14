import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ElementRef, Injectable, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Observable, of } from 'rxjs';
import { urlComponent } from 'src/app/url';

@Injectable({
  providedIn: 'root'
})
export class ItemManagementService {


url =  new urlComponent().url

  constructor(private http: HttpClient, private Cookie: CookieService,private confirmation: ConfirmationService, private messageService: MessageService) { }


  getData(endpoint:string):Observable <any> {
    let params = new HttpParams().set('plantname', this.Cookie.get('plantname'));
    let headers = new HttpHeaders().set('Authorization', 'auth-token');
     const pl = sessionStorage.getItem('currentplant') || ''
    return this.http.get(this.url + localStorage.getItem(pl) + '/' + endpoint + '/', {params,headers})
  }

  
  get(endpoint: string, p0: { responseType: string; }):Observable <any> {
    let params = new HttpParams().set('plantname', this.Cookie.get('plantname'));
    let headers = new HttpHeaders().set('Authorization', 'auth-token');
     const pl = sessionStorage.getItem('currentplant') || ''
    return this.http.get(this.url + localStorage.getItem(pl) + '/' + endpoint + '/', {params,headers})
  }



  postData(endpoint:string, Data:any):Observable <any> {
    let params = new HttpParams().set('plantname', this.Cookie.get('plantname'));
    let headers = new HttpHeaders().set('Authorization', 'auth-token');
     const pl = sessionStorage.getItem('currentplant') || ''
    const postUrl = this.url + localStorage.getItem(pl) + '/' + endpoint + '/';
    return this.http.post(postUrl, Data,{params,headers});
  }

  putData(endpoint:string, Data:any):Observable <any>{
    let params = new HttpParams().set('plantname', this.Cookie.get('plantname'));
    let headers = new HttpHeaders().set('Authorization', 'auth-token');
     const pl = sessionStorage.getItem('currentplant') || ''
    return this.http.put(this.url + localStorage.getItem(pl) + '/' + endpoint + '/', Data,{params,headers})
  }

  deleteData(endpoint:string, code:any):Observable <any>{
    let params = new HttpParams().set('plantname', this.Cookie.get('plantname'));
    const body = JSON.stringify({im_code: code});
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

  // uploadImage(file: File): Observable<any>{
  //   let params = new HttpParams().set('plantname', this.Cookie.get('plantname'));
  //   let headers = new HttpHeaders().set('Authorization', 'auth-token');
  //   let formParams = new FormData();
  //    formParams.append('im_liveimage', file, file.name)
  //    console.log("one",formParams)
  //    return this.http.post(this.url + 'item/upload'+ '/' , formParams,{params,headers})
  //   }
}
