import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { urlComponent } from 'src/app/url';

@Injectable({
  providedIn: 'root'
})
export class AssetsViewService {

  constructor(private http: HttpClient, private cookie: CookieService) { }

  private selectedSiteSource = new BehaviorSubject<string>('');
  selectedSite = this.selectedSiteSource.asObservable();

  url = new urlComponent().url

getData(endpoint:any):Observable <any>  {
  let params = new HttpParams().set('plantname', this.cookie.get('plantname'));
  let headers = new HttpHeaders().set('Authorization', 'auth-token');
  const pl = sessionStorage.getItem('currentplant') || ''
  return this.http.get(this.url + localStorage.getItem(pl) + '/' + endpoint+'/',{params,headers})
}



}
