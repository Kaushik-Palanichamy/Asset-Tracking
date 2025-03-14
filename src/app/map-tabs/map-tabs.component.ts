import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MapViewComponent } from './Addons/map-view/map-view.component';
import { PathViewComponent } from './Addons/path-view/path-view.component';

@Component({
  selector: 'app-map-tabs',
  templateUrl: './map-tabs.component.html',
  styleUrl: './map-tabs.component.css'
})
export class MapTabsComponent {
  @ViewChild(MapViewComponent) mapViewComponent!: MapViewComponent;
  @ViewChild(PathViewComponent) pathViewComponent!: PathViewComponent;
  // @Output() locationEmitter = new EventEmitter<{ latitude: number; longitude: number }>();
  messageService: any;


  constructor(private router: Router) {
  }

  ngOninit(){
    
  }



  navigateTo(path: string) {
    this.router.navigate(['/map', path]);
  }

  tabChange(event: any) {
    // Check which tab is active
    if (event.index === 0) {
      // Resize or re-render the map in Zone View
      setTimeout(() => this.mapViewComponent.invalidateMapSize(), 0);
    } else if (event.index === 1) {
      // Resize or re-render the map in Path Tracking
      setTimeout(() => this.pathViewComponent.invalidateMapSize(), 0);
    }
 
  }

}
