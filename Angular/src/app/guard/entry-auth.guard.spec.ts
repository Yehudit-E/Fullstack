import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { entryAuthGuard } from './entry-auth.guard';

describe('entryAuthGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => entryAuthGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
