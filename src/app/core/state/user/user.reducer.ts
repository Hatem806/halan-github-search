import { createReducer, on } from '@ngrx/store';
import {
  loadUsers,
  loadUsersSuccess,
  loadUsersFailure,
  updateSort,
} from './user.actions';
import { UserState, initialState } from './user.state';

export const userReducer = createReducer(
  initialState,
  on(loadUsers, (state, { query, sort, order }) => ({
    ...state,
    loading: true,
    error: null,
    query,
    sort,
    order,
  })),
  on(loadUsersSuccess, (state, { items, total_count }) => ({
    ...state,
    items,
    total_count,
    loading: false,
    error: null,
  })),
  on(updateSort, (state, { sort, order }) => ({
    ...state,
    sort,
    order,
  })),
  on(loadUsersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
