import { Component, inject } from '@angular/core';
import { AsyncPipe, NgClass } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DataView } from 'primeng/dataview';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { GitHubUser } from '../../core/models/user.mode';
import { loadUsers } from '../../core/state/user/user.actions';
import {
  selectAllUsers,
  selectUserLoading,
  selectUserError,
  selectUserQuery,
} from '../../core/state/user/user.selectors';

@Component({
  selector: 'app-users-list',
  imports: [ButtonModule, DataView, NgClass, PaginatorModule, AsyncPipe],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css',
})
export class UsersListComponent {
  private store = inject(Store);

  users$: Observable<GitHubUser[]> = this.store.pipe(select(selectAllUsers));
  loading$: Observable<boolean> = this.store.pipe(select(selectUserLoading));
  error$: Observable<string | null> = this.store.pipe(select(selectUserError));
  query$: Observable<string> = this.store.pipe(select(selectUserQuery));

  currentPage = 1;
  perPage = 10;
  searchQuery = '';

  constructor() {
    this.query$.subscribe((query) => {
      this.searchQuery = query;
    });
  }

  loadUsers() {
    this.store.dispatch(
      loadUsers({
        query: this.searchQuery,
        page: this.currentPage,
        perPage: this.perPage,
      })
    );
  }

  onPageChange(event: PaginatorState) {
    this.currentPage = (event.page ?? 1) + 1;
    this.perPage = event.rows ?? 10;
    this.loadUsers();
  }
}
