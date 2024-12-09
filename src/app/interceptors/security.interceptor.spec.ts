import { TestBed } from '@angular/core/testing';

import { SecurityInterceptor } from './security.interceptor';

describe('SecurityInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      SecurityInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: SecurityInterceptor = TestBed.inject(SecurityInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
