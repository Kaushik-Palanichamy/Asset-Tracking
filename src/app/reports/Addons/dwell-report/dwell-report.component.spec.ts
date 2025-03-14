import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DwellReportComponent } from './dwell-report.component';

describe('DwellReportComponent', () => {
  let component: DwellReportComponent;
  let fixture: ComponentFixture<DwellReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DwellReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DwellReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
