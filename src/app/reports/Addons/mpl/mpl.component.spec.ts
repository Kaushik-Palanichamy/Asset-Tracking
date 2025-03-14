import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MplComponent } from './mpl.component';

describe('MplComponent', () => {
  let component: MplComponent;
  let fixture: ComponentFixture<MplComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MplComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MplComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
