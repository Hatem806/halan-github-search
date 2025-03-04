import { HttpClient } from '@angular/common/http';
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
    perPage: number = 10
  ): Observable<any> {
    return this.http.get<any>(
      `${this.API_URL}/search/users?q=${query}&page=${page}&per_page=${perPage}`
    );
  }
}
