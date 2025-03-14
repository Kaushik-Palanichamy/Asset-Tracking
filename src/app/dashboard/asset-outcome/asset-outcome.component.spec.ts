import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetOutcomeComponent } from './asset-outcome.component';

describe('AssetOutcomeComponent', () => {
  let component: AssetOutcomeComponent;
  let fixture: ComponentFixture<AssetOutcomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetOutcomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetOutcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
