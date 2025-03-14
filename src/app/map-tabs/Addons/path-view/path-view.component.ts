import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
// import {} from 'googlemaps';
import * as L from 'leaflet';
import { Calendar } from 'primeng/calendar';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PathService } from './path.service';

@Component({
  selector: 'app-path-view',
  templateUrl: './path-view.component.html',
  styleUrl: './path-view.component.scss'
})
export class PathViewComponent implements AfterViewInit  {


  // Access the p-calendar components
  @ViewChild('fromCalendar') fromCalendar!: Calendar;
  @ViewChild('toCalendar') toCalendar!: Calendar;
  maps!: L.Map;
  markers!: L.Marker;
  form: any;
  pathLayer: L.Polyline | undefined;
  pathCoordinates: L.LatLng[] = [];
  startMarker: L.Marker | undefined;
  endMarker: L.Marker | undefined;
  fromTime: Date | null = null;
  toTime: Date | null = null;
  displayTimeRange: string = '';
  displayDialog: boolean = false;
  isTrackingStarted = false;  // Flag to track if path tracking has started
  siteName : any = [];
  area : any=[];
  category: any=[];
  AssetDetails: any;
  areas:any=[]
  itemsname: any = []
  sites: any= []
  latitude: number = 12.86027;
  longitude: number = 80.07134;
  highlightZone: boolean = false;
  filteredItems: any[] = []; // Filtered items based on selected category
  selectedCategory: any; // Selected category ID
  selectedAsset: any; // Selected asset ID

  constructor(private fb: FormBuilder,private service: PathService){
    this.form = this.fb.group({
      siteid:['',Validators.required],
      areaid:['',Validators.required],
      categoryid:['',Validators.required],
      item_name:['',Validators.required],
      date:['',Validators.required],
      from_time: ['',Validators.required],
      to_time: ['',Validators.required],
      timing:['',Validators.required],
      highlight:['']
    })
  }

  ngAfterViewInit(): void {
    this.one();
    this.service.getData("businesslocations/site").subscribe(res => {
      this.siteName = res.map((site: any) => ({ label: site.sc_name, value: site.sc_id }));
    });

    this.service.getData("businesslocations/area").subscribe(res => {
      this.areas = res.map((area: any) => ({ label: area.ar_name, value: area.ar_id }));
    });

    this.service.getData("category/data").subscribe(res => {
      this.category = res;
      this.AssetDetails = res.cm_name
    });

    this.service.getData('item/pathtracker').subscribe( res=>{
      this.itemsname = res
      let name = this.itemsname
      // console.log("",res)
     });
  }

  // Filter assets when the category changes
  onCategoryChange(): void {
    if (this.selectedCategory) {
      this.filteredItems = this.itemsname.filter(
        (item: any) => item.im_categoryid === this.selectedCategory
      );
    } else {
      this.filteredItems = []; // Reset if no category is selected
    }
    // console.log('Filtered Items:', this.filteredItems); // Debugging filtered items
  }

     // Open the dialog for time selection
  openDialog() {
    this.displayDialog = true;
  }

  resetForm() {
    this.form.reset();
  }

  // Close the dialog
  onDialogHide() {
    this.displayDialog = false;
  }

  // Update display text for the input field after selecting times
  onTimeSelect(timeType: string) {
    if (timeType === 'from' && this.toTime) {
      this.displayTimeRange = `${this.formatTime(this.fromTime)} - ${this.formatTime(this.toTime)}`;
    } else if (timeType === 'to' && this.fromTime) {
      this.displayTimeRange = `${this.formatTime(this.fromTime)} - ${this.formatTime(this.toTime)}`;
    }
  }

  // Confirm selection and close the dialog
  confirmSelection() {
    if (this.fromTime && this.toTime) {
      this.displayTimeRange = `${this.formatTime(this.fromTime)} - ${this.formatTime(this.toTime)}`;
      this.displayDialog = false;
    }
  }

  // Format time as 'HH:mm' or customize as needed
  formatTime(date: Date | null): string {
    if (!date) return '';
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }
  // Format time as 'HH:mm:ss'
formatTimeWithSeconds(date: Date | null): string {
  if (!date) return '';
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
}


  one(){
    // console.log('path view map')
    this.maps = L.map('pathMap').setView([this.latitude, this.longitude], 15);
    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 21,
      attribution: '© Motherson',
      opacity: 0.9,
    }).addTo(this.maps);

     // Initialize a customized path layer
    this.pathLayer = L.polyline(this.pathCoordinates, {
        color: '#4285F4',     // Line color (e.g., 'blue', '#FF0000')
        weight: 10,         // Line thickness in pixels
        opacity: 0.7,      // Line opacity (0.0 to 1.0)
        // dashArray: '5, 10' // Optional: dashed line pattern (e.g., '5, 10' for 5px dash, 10px gap)
        lineCap: 'round',    // Rounded edges
        lineJoin: 'round'    // Smooth corners
      }).addTo(this.maps);

    const satelliteLayer = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.jpg', {
      minZoom: 0,
      maxZoom: 21,
    });

    osmLayer.addTo(this.maps);

    // Define a base layers object for switching between map layers
    const baseLayers = {
      'OpenStreetMap': osmLayer,
      // 'Satellite': satelliteLayer
    };

    L.control.layers(baseLayers).addTo(this.maps);

  }


  applyChanges() {
    if (this.markers) {
      this.maps.removeLayer(this.markers);
    }

    this.markers = L.marker([this.latitude, this.longitude]).addTo(this.maps);
    this.maps.setView([this.latitude, this.longitude], 15);

    if (this.highlightZone) {
      L.circle([this.latitude, this.longitude], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 200
      }).addTo(this.maps);
    }
  }

  invalidateMapSize() {
    if (this.maps) {
      this.maps.invalidateSize();
    }
  }

  addCoordinate(lat: number, lng: number): void {
    const newPoint = L.latLng(lat, lng);
    this.pathCoordinates.push(newPoint);

    // Update the path line
    if (this.pathLayer) {
      this.pathLayer.setLatLngs(this.pathCoordinates);
    }

    // Zoom to level 20 only when tracking starts
    if (!this.isTrackingStarted) {
      this.isTrackingStarted = true;
      this.maps?.setView(newPoint, 15);  // Zoom to level 20 at the start
    }

    // Update or place the start marker
    if (this.pathCoordinates.length === 1) {
      this.startMarker = L.marker(newPoint, { icon: this.getIcon('start') }).addTo(this.maps!);
    }

    // Update or move the end marker
    if (this.endMarker) {
      this.endMarker.setLatLng(newPoint);
    } else {
      this.endMarker = L.marker(newPoint, { icon: this.getIcon('end') }).addTo(this.maps!);
    }

    // Center map on the new point
    this.maps?.panTo(newPoint);
  }

  // Method to define custom icons for start and end markers
  getIcon(type: 'start' | 'end'): L.Icon {
    return L.icon({
      iconUrl: type === 'start' ? 'assets/start-icon.png' : 'assets/end-icon.png',
      iconSize: [25, 41],      // Adjust size as needed
      iconAnchor: [12, 41],     // Anchor so the point is at the bottom center
      popupAnchor: [1, -34]     // Position of the popup anchor
    });
  }

  apiData: any;

  simulatePath(): void {
    this.service.getData("businesslocations/site").subscribe(res => {
      this.siteName = res.map((site: any) => ({ label: site.sc_name, value: site.sc_id }));
    });

    let payload =
    {
      // siteid: this.sites,
      // areaid: this.area,
      // categoryid: this.selectedCategory,
      // item_name: this.selectedAsset,
      // date: new Date().toISOString().split('T')[0],
      // from_time: this.formatTimeWithSeconds(this.fromTime),
      // to_time: this.formatTimeWithSeconds(this.toTime),
      "siteid":1,
      "areaid":1,
      "categoryid":1,
      "date":"2024-11-20",
      "from_time":"12:00:00",
      "to_time":"12:20:00",
      "item_name":"Ai3 Transverse 01A"

    }

    this.service.postData('pathtracker',payload).subscribe(res =>{
      this.apiData = res
      // console.log(this.apiData)
    // const sampleCoordinates = [
    //   [12.86027, 80.07134],
    //   [12.859896190058533, 80.0722424296722],
    //   [12.858578261021599, 80.0712661055908],
    //   [12.85767341142504, 80.07056645169077],
    //   [12.856068623597388, 80.06928883328995],
    //   [12.851591752350982, 80.06602726712785],
    //   [12.848039418060589, 80.06339629562059],
    //   [12.84467540260782, 80.06054598237851],
    //   [12.838989382817122, 80.05456407498221],
    //   [12.834381966991558, 80.04989481184214],
    // ];



    let i = 0;
    const interval = setInterval(() => {
      if (i < res.coordinates.length) {
        const [lat, lng] = res.coordinates[i];
        this.addCoordinate(lat, lng);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 3000);
  })
  }
}
