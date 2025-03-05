import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { GithubService } from './github.service';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('GithubService', () => {
  let service: GithubService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GithubService, provideHttpClientTesting(), HttpClient, HttpHandler],
    });

    service = TestBed.inject(GithubService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call API with default parameters when optional ones are missing', () => {
    service.searchUsers({ query: 'angular' }).subscribe();

    const req = httpMock.expectOne((request) => {
      return (
        request.url === 'https://api.github.com/search/users' &&
        request.params.get('q') === 'angular' &&
        request.params.get('page') === '1' &&
        request.params.get('per_page') === '10' &&
        request.params.has('sort') === false &&
        request.params.has('order') === false
      );
    });

    expect(req.request.method).toBe('GET');
    req.flush({ items: [], total_count: 0 });
  });

  it('should include pagination when provided', () => {
    service.searchUsers({ query: 'react', page: 2, perPage: 20 }).subscribe();

    const req = httpMock.expectOne((request) => {
      return (
        request.url === 'https://api.github.com/search/users' &&
        request.params.get('q') === 'react' &&
        request.params.get('page') === '2' &&
        request.params.get('per_page') === '20'
      );
    });

    expect(req.request.method).toBe('GET');
    req.flush({ items: [], total_count: 0 });
  });

  it('should include sort parameter when provided', () => {
    service.searchUsers({ query: 'vue', sort: 'followers' }).subscribe();

    const req = httpMock.expectOne((request) => {
      return (
        request.url === 'https://api.github.com/search/users' &&
        request.params.get('q') === 'vue' &&
        request.params.get('sort') === 'followers' &&
        request.params.has('order') === false // Order should not exist if not provided
      );
    });

    expect(req.request.method).toBe('GET');
    req.flush({ items: [], total_count: 0 });
  });

  it('should include both sort and order when provided', () => {
    service
      .searchUsers({ query: 'svelte', sort: 'repositories', order: 'asc' })
      .subscribe();

    const req = httpMock.expectOne((request) => {
      return (
        request.url === 'https://api.github.com/search/users' &&
        request.params.get('q') === 'svelte' &&
        request.params.get('sort') === 'repositories' &&
        request.params.get('order') === 'asc'
      );
    });

    expect(req.request.method).toBe('GET');
    req.flush({ items: [], total_count: 0 });
  });

  it('should handle API errors gracefully', () => {
    service.searchUsers({ query: 'angular' }).subscribe({
      next: () => fail('Expected an error, but got a success response'),
      error: (error) => {
        expect(error.status).toBe(500);
      },
    });

    const req = httpMock.expectOne(
      'https://api.github.com/search/users?q=angular&page=1&per_page=10'
    );
    req.flush('Error occurred', { status: 500, statusText: 'Server Error' });
  });
});
