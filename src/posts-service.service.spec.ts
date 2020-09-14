import { TestBed } from '@angular/core/testing';

import { PostsServiceService } from './posts-service.service';

describe('PostsServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PostsServiceService = TestBed.get(PostsServiceService);
    expect(service).toBeTruthy();
  });
});
