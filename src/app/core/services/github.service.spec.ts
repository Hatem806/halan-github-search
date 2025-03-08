import { TestBed } from '@angular/core/testing';
import { GithubService } from './github.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

describe('GithubService', () => {
  let service: GithubService;
  let httpMock: HttpTestingController;
  const API_URL = 'https://api.github.com/search/users';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GithubService],
    });

    service = TestBed.inject(GithubService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensures there are no outstanding requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call API with correct parameters', () => {
    service
      .searchUsers({
        query: 'angular',
        page: 2,
        perPage: 5,
        sort: 'followers',
        order: 'desc',
      })
      .subscribe();

    const req = httpMock.expectOne(
      `${API_URL}?q=angular&page=2&per_page=5&sort=followers&order=desc`
    );
    expect(req.request.method).toBe('GET');
  });

  it('should use default values when optional params are not provided', () => {
    service.searchUsers({ query: 'angular' }).subscribe();

    const req = httpMock.expectOne(`${API_URL}?q=angular&page=1&per_page=10`);
    expect(req.request.method).toBe('GET');
  });

  it('should return expected response data', () => {
    const mockResponse = {
      total_count: 100,
      items: [{ id: 1, login: 'testuser' }],
    };

    service.searchUsers({ query: 'angular' }).subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${API_URL}?q=angular&page=1&per_page=10`);
    req.flush(mockResponse);
  });

  it('should handle API errors gracefully', () => {
    service.searchUsers({ query: 'angular' }).subscribe({
      error: (err) => {
        expect(err.status).toBe(500);
      },
    });

    const req = httpMock.expectOne(`${API_URL}?q=angular&page=1&per_page=10`);
    req.flush('Internal Server Error', {
      status: 500,
      statusText: 'Server Error',
    });
  });
});
