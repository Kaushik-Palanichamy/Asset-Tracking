import { Component, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// import {} from 'googlemaps';
import * as L from 'leaflet';
import { MapService } from './map.service';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrl: './map-view.component.scss'
})
export class MapViewComponent implements AfterViewInit{

  latitude: number = 12.86027; // Default latitude
  longitude: number = 80.07134; // Default longitude
  date = new Date();
  pipe= new DatePipe("en-US")
  form: any;
  messageService: any;

  constructor(private router: Router, private fb: FormBuilder, private service: MapService)
  {
    this.form = this.fb.group({
      cat_id :   ['',Validators.required],
      area_id  :   ['',Validators.required],
      site_id  :   ['',Validators.required],
      lati  :  [''],
      longi  :  [''],
      highlight:  [''],
     })

     this.getLocation();
  }

  map!: L.Map;
  markers!: L.Marker;
  showTable = false;
  tableData: any;
  siteName : any = [];
  area : any=[];
  category: any=[];

  highlightZone: boolean = false;
  AssetDetails: any;

  getLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          // console.log('Location fetched:', this.latitude, this.longitude);
          // this.emitLocation();
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

  ngOnInit(){



  //   this.initializeMap();
  //   this.applyChanges();
  }

  ngAfterViewInit(): void {
    this.getLocation();
    this.initializeMap();
    this.service.getData("businesslocations/site").subscribe(res => {
      this.siteName = res.map((site: any) => ({ label: site.sc_name, value: site.sc_id }));
    });

    this.service.getData("businesslocations/area").subscribe(res => {
      this.area = res.map((area: any) => ({ label: area.ar_name, value: area.ar_id }));
    });

    this.service.getData("category/data").subscribe(res => {
      this.category = res;
      this.AssetDetails = res.cm_name
    });
  }

  onTabChange(event: any) {
    if (event.index === 1) {  // Assuming the second tab (Path Tracking) is at index 1
      this.router.navigate(['/map/path-view']);
    } else {
      this.router.navigate(['/map/map-view']);
    }
  }

  resetForm() {
    this.form.reset();
  }

  mapData: any

  initializeMap() {
    // console.log("map initialized before");

    // this.service.postData('zoneview').subscribe((res: any) =>{
    //    this.mapData = res.area_latilongi
    //    console.log('map',this.mapData)
    // })

    this.map = L.map('map').setView([this.latitude, this.longitude], 15);
    // console.log("map initialized after");

    this.markers = L.marker([this.latitude, this.longitude]).addTo(this.map).bindPopup('Current Location').openPopup();
    this.map.setView([this.latitude, this.longitude], 15);

    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 21,
      attribution: '© Motherson'
    }).addTo(this.map);

    // const satelliteLayer = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.jpg', {
    //   minZoom: 0,
    //   maxZoom: 21,
    //   attribution: '© Motherson'
    // });

    osmLayer.addTo(this.map);

    // Define a base layers object for switching between map layers
    const baseLayers = {
      'StreetMap': osmLayer,
      // 'Satellite': satelliteLayer
    };

    L.control.layers(baseLayers).addTo(this.map);

    // this.markers = L.marker([this.latitude, this.longitude]).addTo(this.map)
    //   .bindPopup('Selected Location')
    //   .openPopup();
  }

  areaview: any;
  zoneview: any;
  tablevalues: any;

  applyChanges() {
    if (this.markers) {
      this.map.removeLayer(this.markers);
    }

    this.service.postData('zoneview',this.form.value).subscribe((res: any) =>{
      this.mapData = res

      this.areaview = res.area_latilongi
      this.zoneview = res.zone
      this.tablevalues = res.table_data

      // console.log('maps', this.zoneview)

    this.form.patchValue({
      lati: this.areaview.latitude,
      longi: this.areaview.longitude
    })
    // this.markers = L.marker([this.areaview.latitude, this.areaview.longitude]).addTo(this.map);
    this.map.setView( [this.areaview.latitude,this.areaview.longitude], 18);

    const colorPalette = [
      '#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#33FFF6', '#FFD633'
  ];
  let colorIndex = 0;


  this.zoneview.forEach((zone: any) => {
      const lat = parseFloat(zone.latitude);
      const lon = parseFloat(zone.longitude);
      if (!isNaN(lat) && !isNaN(lon)) {

          const color = colorPalette[colorIndex % colorPalette.length];
          colorIndex++;

          const circle = L.circle([lat, lon], {
              color: color,
              fillColor: color,
              fillOpacity: 0.5,
              radius: 10
          }).addTo(this.map).bindPopup(`
              <b>${zone.zonename}</b><br>

          `);
          circle.on('click', () => {
            // console.log("clicked")

            let payload = {
              zonename: zone.zonename,
              ...this.form.value
            }

            this.service.postData('tablezone',payload).subscribe((res: any) =>{
              this.tablevalues = res
              this.showTable = true;

            });

            // this.tableData = this.tablevalues
            // {
            //   siteName: this.siteName,
            //   area: this.area,
            //   category: this.category
            // }
            })
      } else {
          console.error('Invalid coordinates for zone:', zone);
      }
  });


    // this.zoneview.forEach((zone:any) => {
    //   L.circle([parseFloat(zone.latitude), parseFloat(zone.longitude)], {
    //     color: zone.zonename.includes('IN') ? 'red' : 'blue', // Use red for IN, blue for OUT
    //     fillColor: zone.zonename.includes('IN') ? '#f03' : '#03f',
    //     fillOpacity: 0.5,
    //     radius: 10 // Radius in meters
    //   }).addTo(this.map).bindPopup(`<b>${zone.zonename}</b><br>Category: ${zone.category_details.join(', ') || 'None'}`);
    // });


      // Set up click event for the circle

      });
    }

  // })
  // }
  invalidateMapSize() {
    if (this.map) {
      this.map.invalidateSize();
    }
  }
}
