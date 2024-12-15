import { TestBed } from '@angular/core/testing';

import { NoAuthenticatedGuard } from './no-authenticated.guard';

describe('NoAuthenticatedGuard', () => {
  let guard: NoAuthenticatedGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(NoAuthenticatedGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
