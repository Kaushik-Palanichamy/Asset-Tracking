import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapTabsComponent } from './map-tabs.component';

describe('MapTabsComponent', () => {
  let component: MapTabsComponent;
  let fixture: ComponentFixture<MapTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapTabsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MapTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
