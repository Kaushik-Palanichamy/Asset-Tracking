import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import * as L from 'leaflet';

interface CircleData {
  attribute: string;
  value: string;
  color: string;
}
@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrl: './maps.component.css'
})
export class MapsComponent implements AfterViewInit {
  map: L.Map | undefined;
  mapPath: L.Map | undefined;
  pathLayer: L.Polyline | undefined;
  pathCoordinates: L.LatLng[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    // Initialize both maps
    this.initializeMapZone();
    this.initializeMapPath();

    // Add window resize listener
    window.addEventListener('resize', this.onResize);
  }

  ngOnDestroy() {
    // Remove window resize listener when the component is destroyed
    window.removeEventListener('resize', this.onResize);
  }

  initializeMapZone() {
    this.map = L.map('map').setView([40.7128, -74.0060], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18
    }).addTo(this.map);
        // Initialize an empty path layer
    this.pathLayer = L.polyline(this.pathCoordinates, { color: 'blue' }).addTo(this.map);
  }

  initializeMapPath() {
    this.mapPath = L.map('mapPath').setView([40.7128, -74.0060], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18
    }).addTo(this.mapPath);
  }

  onTabChange(event: any) {
    console.log("changed")
    this.cdr.detectChanges(); // Ensure Angular re-renders the view

    setTimeout(() => {
      if (event.index === 0 && this.map) {
        this.map.invalidateSize(); // Zone View
        console.log("Rendered fast 289374")
      } else if (event.index === 1 && this.mapPath) {
        this.mapPath.invalidateSize(); // Path Tracking
        console.log("Rendered fast oadshoif")
      }
    }, 100); // Add a delay to give the map container time to render
  }

  // Window resize handler to refresh the maps on resize
  onResize = () => {
    if (this.map) {
      this.map.invalidateSize();
      console.log("Rendered fast")
    }
    if (this.mapPath) {
      this.mapPath.invalidateSize();
      console.log("rendered")
    }
  };

  addCoordinate(lat: number, lng: number): void {
    if (this.pathLayer) {
      const newPoint = L.latLng(lat, lng);
      this.pathCoordinates.push(newPoint);
      this.pathLayer.setLatLngs(this.pathCoordinates); // Update the path
      this.map?.panTo(newPoint); // Center map on the new point
    }
  }

  simulatePath(): void {
    const sampleCoordinates = [
      [51.505, -0.09],
      [51.51, -0.1],
      [51.52, -0.12],
      [51.515, -0.09],
      [51.52, -0.08]
    ];
  
    let i = 0;
    const interval = setInterval(() => {
      if (i < sampleCoordinates.length) {
        const [lat, lng] = sampleCoordinates[i];
        this.addCoordinate(lat, lng);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 1000);
  }
  
}
