import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PathTrackingComponent } from './path-tracking.component';

describe('PathTrackingComponent', () => {
  let component: PathTrackingComponent;
  let fixture: ComponentFixture<PathTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PathTrackingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PathTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
