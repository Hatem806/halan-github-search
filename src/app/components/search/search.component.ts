import { Component, inject } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';
import { Store } from '@ngrx/store';
import { loadUsers } from '../../core/state/user/user.actions';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, InputTextModule, FloatLabel],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent {
  private store = inject(Store);

  searchTerm = '';
  private searchSubject = new Subject<string>();

  constructor() {
    this.searchSubject
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((term) => this.dispatchSearch(term));
  }

  onSearchInputChange(value: string) {
    this.searchSubject.next(value);
  }

  private dispatchSearch(query: string) {
    if (query.trim()) {
      this.store.dispatch(loadUsers({ query, page: 1, perPage: 10 }));
    }
  }
}
