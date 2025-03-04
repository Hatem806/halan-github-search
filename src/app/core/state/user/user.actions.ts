import { createAction, props } from '@ngrx/store';
import { GitHubUser } from '../../models/user.mode';

export const loadUsers = createAction(
  '[User] Load Users',
  props<{ query: string; page: number; perPage: number }>()
);

export const loadUsersSuccess = createAction(
  '[User] Load Users Success',
  props<{ users: GitHubUser[]; total: number }>()
);

export const loadUsersFailure = createAction(
  '[User] Load Users Failure',
  props<{ error: string }>()
);
