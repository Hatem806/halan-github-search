import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  loadUsers,
  loadUsersSuccess,
  loadUsersFailure,
  updateSort,
} from './user.actions';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { GithubService } from '../../services/github.service';

@Injectable({ providedIn: 'root' })
export class UserEffects {
  private actions$ = inject(Actions);
  private githubService = inject(GithubService);

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUsers),
      mergeMap(({ query, page, perPage, sort, order }) =>
        this.githubService.searchUsers({query, page, perPage, sort, order}).pipe(
          map((response: any) =>
            loadUsersSuccess({
              items: response.items,
              total_count: response.total_count,
            })
          ),
          catchError((error) => {
            console.log('error:', error);
            return of(loadUsersFailure({ error: error.message }));
          })
        )
      )
    )
  );

  updateSort$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateSort),
      mergeMap(({ query, sort, order }) =>
        this.githubService.searchUsers({ query, sort, order }).pipe(
          map((response: any) =>
            loadUsersSuccess({
              items: response.items,
              total_count: response.total_count,
            })
          ),
          catchError((error) => {
            console.log('error:', error);
            return of(loadUsersFailure({ error: error.message }));
          })
        )
      )
    )
  );
}
