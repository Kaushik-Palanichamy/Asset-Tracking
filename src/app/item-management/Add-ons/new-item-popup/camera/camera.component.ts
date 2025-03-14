import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {Subject} from 'rxjs';
import {Observable} from 'rxjs';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';
import { ItemManagementService } from '../../service/item-management.service';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
selector: 'app-camera',
templateUrl: './camera.component.html',
styleUrls: ['./camera.component.scss']
})
export class CameraComponent implements OnInit {

  private trigger: any = new Subject();
  public webcamImage!: any;
  private nextWebcam: any = new Subject();
  captureImage  = '';
  fileName = '';
  public showWebcam = true;
  url = '';
  imageData: any;

  form!: FormGroup;

  constructor(private service: ItemManagementService,private fb: FormBuilder) {}

ngOnInit(): void {
  this.form = this.fb.group({
    liveImage           : [''],
   
  });
}
public triggerSnapshot(): void {
  this. imageData = this.showWebcam
  this.showWebcam = !this.showWebcam;
  this.trigger.next();
  
}
public handleImage(webcamImage: any): void {
  this.webcamImage = webcamImage;
  this.imageData = webcamImage!.imageAsDataUrl;
  console.info('received webcam image', this.imageData);
}
public get triggerObservable(): Observable<any> {

  return this.trigger.asObservable();
}
public get nextWebcamObservable(): Observable<any> {

  return this.nextWebcam.asObservable();
}
// public toggleWebcam(): void {
//   this.showWebcam = !this.showWebcam;
// }

onSelectFile(event:any) {
  if (event.target.files && event.target.files[0]) {
    var reader = new FileReader();

    reader.readAsDataURL(event.target.files[0]); // read file as data url

    reader.onload = (event: any) => { // called once readAsDataURL is completed
      console.log(event);
      this.imageData = event.target.result;
    }
  }
}
deleteImage(){
this.imageData = null
}

upload(){
  this.form.controls['liveImage'].setValue(this.imageData);
    console.log(this.form.value)
}
}