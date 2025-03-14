import { TestBed } from '@angular/core/testing';

import { AssetsViewService } from './assets-view.service';

describe('AssetsViewService', () => {
  let service: AssetsViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssetsViewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
