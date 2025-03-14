import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InoutReportComponent } from './inout-report.component';

describe('InoutReportComponent', () => {
  let component: InoutReportComponent;
  let fixture: ComponentFixture<InoutReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InoutReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InoutReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
