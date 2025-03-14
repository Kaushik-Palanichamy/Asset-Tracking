import { Injectable } from "@angular/core"



@Injectable({
  providedIn: 'root'
})

export class urlComponent {
  port = sessionStorage.getItem('port')

  constructor(){
    // console.log('Url Working', this.port)
  }

    // url="http://127.0.0.1:8000/"
    // url = "http://172.29.29.181:7500/"
    //  url = "http://13.126.132.166:7500/"
      url2 = "ws://3.109.103.151:"
    // url = "http://65.2.56.85:8002/"
    // url = "http://65.2.56.85:8006/"
    // url = "http:////127.0.0.1:8000/"

    // test server
    //  url = "http://13.202.26.179:8001/" //- Bangalore
     url = "http://3.109.103.151:" //- Pondur
    //  url = "http://13.202.26.179:8006/" //- Manesar
}
