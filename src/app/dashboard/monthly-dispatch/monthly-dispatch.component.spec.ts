import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyDispatchComponent } from './monthly-dispatch.component';

describe('MonthlyDispatchComponent', () => {
  let component: MonthlyDispatchComponent;
  let fixture: ComponentFixture<MonthlyDispatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlyDispatchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyDispatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
