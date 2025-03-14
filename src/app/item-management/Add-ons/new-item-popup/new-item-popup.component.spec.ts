import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewItemPopupComponent } from './new-item-popup.component';

describe('NewItemPopupComponent', () => {
  let component: NewItemPopupComponent;
  let fixture: ComponentFixture<NewItemPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewItemPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewItemPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
