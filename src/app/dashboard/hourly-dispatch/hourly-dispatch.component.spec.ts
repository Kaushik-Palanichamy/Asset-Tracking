import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HourlyDispatchComponent } from './hourly-dispatch.component';

describe('HourlyDispatchComponent', () => {
  let component: HourlyDispatchComponent;
  let fixture: ComponentFixture<HourlyDispatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HourlyDispatchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HourlyDispatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
