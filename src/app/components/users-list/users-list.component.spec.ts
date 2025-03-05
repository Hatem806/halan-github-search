import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersListComponent } from './users-list.component';
import { provideStore } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { DataView } from 'primeng/dataview';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { Store } from '@ngrx/store';
import { loadUsers } from '../../core/state/user/user.actions';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import {
  selectAllUsers,
  selectUserLoading,
  selectUserError,
  selectUserQuery,
} from '../../core/state/user/user.selectors';

describe('UsersListComponent', () => {
  let component: UsersListComponent;
  let fixture: ComponentFixture<UsersListComponent>;
  let storeSpy: jasmine.SpyObj<Store>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('Store', ['dispatch', 'pipe']);

    await TestBed.configureTestingModule({
      imports: [ButtonModule, DataView, PaginatorModule, UsersListComponent],
      providers: [provideStore({}), { provide: Store, useValue: spy }],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersListComponent);
    component = fixture.componentInstance;
    storeSpy = TestBed.inject(Store) as jasmine.SpyObj<Store>;

    storeSpy.select.and.callFake((selector: any) => {
      if (selector === selectAllUsers)
        return of([
          {
            id: 1,
            login: 'testuser',
            avatar_url: 'https://example.com/avatar.png',
          },
        ]);
      if (selector === selectUserLoading) return of(false);
      if (selector === selectUserError) return of(null);
      if (selector === selectUserQuery) return of('angular');
      return of(null);
    });

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with store values', () => {
    expect(component.searchQuery).toBe('angular');
    expect(component.currentPage).toBe(1);
    expect(component.perPage).toBe(10);
  });

  it('should dispatch loadUsers action when loadUsers() is called', () => {
    component.loadUsers();
    expect(storeSpy.dispatch).toHaveBeenCalledWith(
      loadUsers({
        query: 'angular',
        page: 1,
        perPage: 10,
      })
    );
  });

  it('should update pagination and dispatch loadUsers on page change', () => {
    const event: PaginatorState = { page: 2, rows: 20 };
    component.onPageChange(event);

    expect(component.currentPage).toBe(3);
    expect(component.perPage).toBe(20);
    expect(storeSpy.dispatch).toHaveBeenCalledWith(
      loadUsers({
        query: 'angular',
        page: 3,
        perPage: 20,
      })
    );
  });

  it('should correctly display users from the store', () => {
    fixture.detectChanges();
    const userElements = fixture.debugElement.queryAll(By.css('.user-item')); // Assuming a `.user-item` class in your HTML
    expect(userElements.length).toBe(1);
    expect(userElements[0].nativeElement.textContent).toContain('testuser');
  });

  it('should show a loading indicator when loading is true', () => {
    storeSpy.select.and.callFake((selector: any) => {
      if (selector === selectUserLoading) return of(true);
      return of(null);
    });

    fixture.detectChanges();
    const loadingElement = fixture.debugElement.query(By.css('.loading'));
    expect(loadingElement).toBeTruthy();
  });

  it('should show an error message when there is an error', () => {
    storeSpy.select.and.callFake((selector: any) => {
      if (selector === selectUserError) return of('Something went wrong!');
      return of(null);
    });

    fixture.detectChanges();
    const errorElement = fixture.debugElement.query(By.css('.error'));
    expect(errorElement.nativeElement.textContent).toContain(
      'Something went wrong!'
    );
  });
});
