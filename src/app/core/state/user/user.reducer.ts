import { createReducer, on } from '@ngrx/store';
import { loadUsers, loadUsersSuccess, loadUsersFailure } from './user.actions';
import { UserState, initialState } from './user.state';

export const userReducer = createReducer(
  initialState,
  on(loadUsers, (state, { query }) => ({
    ...state,
    loading: true,
    error: null,
    query,
  })),
  on(loadUsersSuccess, (state, { items, total }) => ({
    ...state,
    items,
    total,
    loading: false,
    error: null,
  })),
  on(loadUsersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
