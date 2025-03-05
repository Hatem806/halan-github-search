import { userReducer } from './user.reducer';
import {
  loadUsers,
  loadUsersSuccess,
  loadUsersFailure,
  updateSort,
} from './user.actions';
import { initialState } from './user.state';

describe('User Reducer', () => {
  it('should return the initial state when an unknown action is dispatched', () => {
    const action = { type: 'UNKNOWN_ACTION' } as any;
    const newState = userReducer(initialState, action);
    expect(newState).toEqual(initialState);
  });

  it('should set loading to true and update query when loadUsers is dispatched', () => {
    const action = loadUsers({
      query: 'angular',
      page: 1,
      perPage: 10,
      sort: 'followers',
      order: 'asc',
    });
    const newState = userReducer(initialState, action);

    expect(newState.loading).toBeTrue();
    expect(newState.error).toBeNull();
    expect(newState.query).toBe('angular');
    expect(newState.sort).toBe('followers');
    expect(newState.order).toBe('asc');
  });

  it('should update items and set loading to false when loadUsersSuccess is dispatched', () => {
    const mockUsers = [
      {
        id: 1,
        login: 'testuser1',
        avatar_url: 'https://example.com/avatar1.png',
        score: 1,
        type: 'user',
      },
      {
        id: 2,
        login: 'testuser2',
        avatar_url: 'https://example.com/avatar2.png',
        score: 1,
        type: 'user',
      },
    ];

    const action = loadUsersSuccess({ items: mockUsers, total_count: 2 });
    const newState = userReducer(initialState, action);

    expect(newState.loading).toBeFalse();
    expect(newState.error).toBeNull();
    expect(newState.items).toEqual(mockUsers);
    expect(newState.total_count).toBe(2);
  });

  it('should update the error state and set loading to false when loadUsersFailure is dispatched', () => {
    const action = loadUsersFailure({ error: 'API request failed' });
    const newState = userReducer(initialState, action);

    expect(newState.loading).toBeFalse();
    expect(newState.error).toBe('API request failed');
  });

  it('should update sorting when updateSort is dispatched', () => {
    const action = updateSort({
      query: 'angular',
      sort: 'repositories',
      order: 'desc',
    });
    const newState = userReducer(initialState, action);

    expect(newState.sort).toBe('repositories');
    expect(newState.order).toBe('desc');
  });
});
