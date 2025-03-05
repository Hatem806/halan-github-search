import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

type searchParams = {
  query: string;
  page?: number;
  perPage?: number;
  sort?: string;
  order?: string;
};

@Injectable({
  providedIn: 'root',
})
export class GithubService {
  private http = inject(HttpClient);

  private API_URL = 'https://api.github.com';

  searchUsers({
    query,
    page,
    perPage,
    sort,
    order,
  }: searchParams): Observable<any> {
    let params = new HttpParams()
      .set('q', query)
      .set('page', (page || 1).toString())
      .set('per_page', (perPage || 10).toString());

    if (sort) {
      params = params.set('sort', sort);
    }
    if (order) {
      params = params.set('order', order);
    }

    return this.http.get<any>(`${this.API_URL}/search/users`, { params });
  }
}
