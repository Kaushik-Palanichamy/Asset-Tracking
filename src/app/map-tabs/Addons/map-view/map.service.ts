import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, of } from 'rxjs';
import { urlComponent } from 'src/app/url';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  get(url: string) {
    throw new Error('Method not implemented.');
  }

  constructor(private http: HttpClient, private cookie: CookieService) { }

  url = new urlComponent().url


  getData(endpoint:string):Observable <any> {
    let params = new HttpParams().set('plantname', this.cookie.get('plantname'));
    let headers = new HttpHeaders().set('Authorization', 'auth-token');
    return this.http.get(this.url+endpoint+'/',{params,headers})
  }

  postData(endpoint:string, Data:any):Observable <any> {
    let params = new HttpParams().set('plantname', this.cookie.get('plantname'));
    let headers = new HttpHeaders().set('Authorization', 'auth-token');
    return this.http.post(this.url + endpoint + '/', Data, {params,headers})
  }

  post(endpoint:string, Data:any){
    return of(
      {
        "area_latilongi": 
                        {      
                          "latitude" : 12.939035828687757,
                          "longitude": 79.93397042319565,
                        },
      
        "zone":[{
                "zonename":  "MATE_III_IN",
                "category_details": ["Asset 1", "Asset 2"],
                "latitude": "12.939211",
                "longitude": "79.933348"
                },
                {
                "zonename":"MATE_III_OUT",
                "category_details": [],
                "latitude": "12.939090637473585",
                "longitude": "79.93488189796487"
                },
                {
                  "zonename":"MATE_III_WIP",
                  "category_details": [],
                  "latitude": "12.938596658721936",
                  "longitude": "79.93295118428105"
                }],
      }
    )
  }

  putData(endpoint:string, Data:any){
    let params = new HttpParams().set('plantname', this.cookie.get('plantname'));
    let headers = new HttpHeaders().set('Authorization', 'auth-token');
    return this.http.put(this.url + endpoint + '/', Data,{params,headers})
  }

  deleteData(endpoint:string, code:any){
    let params = new HttpParams().set('plantname', this.cookie.get('plantname'));
    const body = JSON.stringify({code: code});
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const options = ({
      headers : headers,
      body : body,
      params
    });
    // console.log(options);
    return this.http.delete(this.url + endpoint + '/',options)
  }
}
