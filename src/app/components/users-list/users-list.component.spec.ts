import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersListComponent } from './users-list.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import {
  selectAllUsers,
  selectUserLoading,
  selectUserError,
  selectUserQuery,
} from '../../core/state/user/user.selectors';
import { loadUsers } from '../../core/state/user/user.actions';
import { PaginatorState } from 'primeng/paginator';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('UsersListComponent', () => {
  let component: UsersListComponent;
  let fixture: ComponentFixture<UsersListComponent>;
  let store: MockStore;
  let dispatchSpy: jasmine.Spy;

  // Mock state values
  const mockUsers = [
    { id: 1, login: 'user1', avatar_url: 'url1', score: 10, type: 'User' },
    { id: 2, login: 'user2', avatar_url: 'url2', score: 20, type: 'User' },
  ];
  const initialState = {
    users: {
      items: mockUsers,
      total_count: 100,
      loading: false,
      error: null,
      query: 'testQuery',
      sort: 'joined',
      order: 'desc',
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersListComponent],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(UsersListComponent);
    component = fixture.componentInstance;

    // Spy on dispatch calls
    dispatchSpy = spyOn(store, 'dispatch');

    // Mock store selectors
    store.overrideSelector(selectAllUsers, mockUsers);
    store.overrideSelector(selectUserLoading, false);
    store.overrideSelector(selectUserError, null);
    store.overrideSelector(selectUserQuery, 'testQuery');

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct observable values', () => {
    let users: any[] = [];
    component.users$.subscribe((value) => (users = value));
    expect(users).toEqual(mockUsers);

    let query = '';
    component.query$.subscribe((value) => (query = value));
    expect(query).toEqual('testQuery');
  });

  it('should dispatch loadUsers action when loadUsers() is called', () => {
    component.loadUsers();
    expect(dispatchSpy).toHaveBeenCalledWith(
      loadUsers({ query: 'testQuery', page: 1, perPage: 10 })
    );
  });

  it('should update pagination and dispatch action when onPageChange is triggered', () => {
    const mockEvent: PaginatorState = {
      page: 2,
      rows: 20,
      first: 40,
      pageCount: 5,
    };
    component.onPageChange(mockEvent);

    expect(component.currentPage).toBe(3);
    expect(component.perPage).toBe(20);
    expect(dispatchSpy).toHaveBeenCalledWith(
      loadUsers({ query: 'testQuery', page: 3, perPage: 20 })
    );
  });

  it('should display loading message when loading$', () => {
    store.overrideSelector(selectUserLoading, true);
    store.refreshState();
    fixture.detectChanges();

    const loadingElement = fixture.debugElement.query(By.css('.loading'));
    expect(loadingElement).toBeTruthy();
    expect(loadingElement.nativeElement.textContent).toContain(
      'Loading users...'
    );
  });

  it('should display error message when error$ is set', () => {
    store.overrideSelector(selectUserError, 'Network error');
    store.refreshState();
    fixture.detectChanges();

    const errorElement = fixture.debugElement.query(By.css('.error'));
    expect(errorElement).toBeTruthy();
    expect(errorElement.nativeElement.textContent).toContain('Network error');
  });

  it('should render users list correctly', () => {
    fixture.detectChanges();
    const userItems: DebugElement[] = fixture.debugElement.queryAll(
      By.css('.col-span-12')
    );
    expect(userItems.length).toBe(2);
    expect(userItems[0].nativeElement.textContent).toContain('user1');
    expect(userItems[1].nativeElement.textContent).toContain('user2');
  });

  it('should render the paginator with correct values', () => {
    const paginator = fixture.debugElement.query(By.css('p-paginator'));
    expect(paginator).toBeTruthy();
    expect(component.currentPage).toBe(1);
    expect(component.perPage).toBe(10);
  });
});
