import { createAction, props } from '@ngrx/store';
import { GitHubUser } from '../../models/user.mode';

export const loadUsers = createAction(
  '[User] Load Users',
  props<{
    query: string;
    page: number;
    perPage: number;
    sort?: string;
    order?: string;
  }>()
);

export const loadUsersSuccess = createAction(
  '[User] Load Users Success',
  props<{ items: GitHubUser[]; total_count: number }>()
);

export const loadUsersFailure = createAction(
  '[User] Load Users Failure',
  props<{ error: string }>()
);

export const updateSort = createAction(
  '[Sort] Update Sort',
  props<{ query:string; sort: string; order: string }>()
);
