import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GithubService {
  private http = inject(HttpClient);

  private API_URL = 'https://api.github.com';

  searchUsers(
    query: string,
    page: number = 1,
    perPage: number = 10,
    sort?: string,
    order?: string
  ): Observable<any> {
    let params = new HttpParams()
      .set('q', query)
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    // ✅ Add sorting params only if they exist
    if (sort) {
      params = params.set('sort', sort);
    }
    if (order) {
      params = params.set('order', order);
    }

    return this.http.get<any>(`${this.API_URL}/search/users`, { params });
  }
}
