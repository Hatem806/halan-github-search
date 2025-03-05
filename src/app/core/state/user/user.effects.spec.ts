import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { UserEffects } from './user.effects';
import { GithubService } from '../../services/github.service';
import {
  loadUsers,
  loadUsersSuccess,
  loadUsersFailure,
  updateSort,
} from './user.actions';
import { provideMockStore } from '@ngrx/store/testing';

describe('UserEffects', () => {
  let actions$: Observable<any>;
  let effects: UserEffects;
  let githubServiceSpy: jasmine.SpyObj<GithubService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('GithubService', ['searchUsers']);

    TestBed.configureTestingModule({
      providers: [
        UserEffects,
        provideMockActions(() => actions$),
        { provide: GithubService, useValue: spy },
        provideMockStore({}),
      ],
    });

    effects = TestBed.inject(UserEffects);
    githubServiceSpy = TestBed.inject(
      GithubService
    ) as jasmine.SpyObj<GithubService>;
  });

  it('should call API and dispatch loadUsersSuccess on success', (done) => {
    const mockUsers = [
      {
        id: 1,
        login: 'user1',
        avatar_url: 'https://example.com/avatar1.png',
        score: 100,
        type: 'User',
      },
    ];
    const mockResponse = { items: mockUsers, total_count: 1 };

    actions$ = of(
      loadUsers({
        query: 'angular',
        page: 1,
        perPage: 10,
        sort: 'followers',
        order: 'asc',
      })
    );
    githubServiceSpy.searchUsers.and.returnValue(of(mockResponse));

    effects.loadUsers$.subscribe((action) => {
      expect(action).toEqual(
        loadUsersSuccess({ items: mockUsers, total_count: 1 })
      );
      expect(githubServiceSpy.searchUsers).toHaveBeenCalledWith({
        query: 'angular',
        page: 1,
        perPage: 10,
        sort: 'followers',
        order: 'asc',
      });
      done();
    });
  });

  it('should dispatch loadUsersFailure on API failure', (done) => {
    const errorResponse = { message: 'API error' };

    actions$ = of(
      loadUsers({
        query: 'angular',
        page: 1,
        perPage: 10,
        sort: 'followers',
        order: 'asc',
      })
    );
    githubServiceSpy.searchUsers.and.returnValue(
      throwError(() => errorResponse)
    );

    effects.loadUsers$.subscribe((action) => {
      expect(action).toEqual(loadUsersFailure({ error: 'API error' }));
      done();
    });
  });

  it('should call API and dispatch loadUsersSuccess on updateSort success', (done) => {
    const mockUsers = [
      {
        id: 1,
        login: 'user1',
        avatar_url: 'https://example.com/avatar1.png',
        score: 100,
        type: 'User',
      },
    ];
    const mockResponse = { items: mockUsers, total_count: 1 };

    actions$ = of(
      updateSort({ query: 'angular', sort: 'repositories', order: 'desc' })
    );
    githubServiceSpy.searchUsers.and.returnValue(of(mockResponse));

    effects.updateSort$.subscribe((action) => {
      expect(action).toEqual(
        loadUsersSuccess({ items: mockUsers, total_count: 1 })
      );
      expect(githubServiceSpy.searchUsers).toHaveBeenCalledWith({
        query: 'angular',
        sort: 'repositories',
        order: 'desc',
      });
      done();
    });
  });

  it('should dispatch loadUsersFailure on updateSort API failure', (done) => {
    const errorResponse = { message: 'API error' };

    actions$ = of(
      updateSort({ query: 'angular', sort: 'repositories', order: 'desc' })
    );
    githubServiceSpy.searchUsers.and.returnValue(
      throwError(() => errorResponse)
    );

    effects.updateSort$.subscribe((action) => {
      expect(action).toEqual(loadUsersFailure({ error: 'API error' }));
      done();
    });
  });
});
