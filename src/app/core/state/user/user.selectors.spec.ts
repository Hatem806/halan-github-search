import { GitHubUser } from '../../models/user.mode';
import {
  selectAllUsers,
  selectUserLoading,
  selectUserError,
  selectUserQuery,
  selectUserSort,
  selectUserState,
} from './user.selectors';
import { UserState } from './user.state';

describe('User Selectors', () => {
  const mockUsers: GitHubUser[] = [
    {
      login: 'user1',
      id: 1,
      avatar_url: 'https://example.com/avatar1.png',
      score: 1,
      type: 'User',
    },
    {
      login: 'user2',
      id: 2,
      avatar_url: 'https://example.com/avatar2.png',
      score: 1,
      type: 'User',
    },
  ];

  const mockState: UserState = {
    items: mockUsers,
    total_count: 2,
    loading: true,
    error: 'Something went wrong!',
    query: 'angular',
    sort: 'followers',
    order: 'desc',
  };

  it('should select user state', () => {
    expect(selectUserState.projector(mockState)).toEqual(mockState);
  });

  it('should select all users', () => {
    expect(selectAllUsers.projector(mockState)).toEqual(mockUsers);
  });

  it('should select the loading state', () => {
    expect(selectUserLoading.projector(mockState)).toBe(true);
  });

  it('should select the error message', () => {
    expect(selectUserError.projector(mockState)).toBe('Something went wrong!');
  });

  it('should select the search query', () => {
    expect(selectUserQuery.projector(mockState)).toBe('angular');
  });

  it('should select sorting parameters', () => {
    expect(selectUserSort.projector(mockState)).toEqual({
      sort: 'followers',
      order: 'desc',
    });
  });
});
