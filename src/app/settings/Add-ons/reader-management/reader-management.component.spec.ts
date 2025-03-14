import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReaderManagementComponent } from './reader-management.component';

describe('ReaderManagementComponent', () => {
  let component: ReaderManagementComponent;
  let fixture: ComponentFixture<ReaderManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReaderManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReaderManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
