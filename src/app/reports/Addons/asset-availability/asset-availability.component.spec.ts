import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetAvailabilityComponent } from './asset-availability.component';

describe('AssetAvailabilityComponent', () => {
  let component: AssetAvailabilityComponent;
  let fixture: ComponentFixture<AssetAvailabilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetAvailabilityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
