import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { updateSort } from '../../core/state/user/user.actions';
import {
  selectUserQuery,
  selectUserSort,
} from '../../core/state/user/user.selectors';

@Component({
  selector: 'app-sort',
  standalone: true,
  imports: [SelectModule, FormsModule, ButtonModule],
  templateUrl: './sort.component.html',
  styleUrl: './sort.component.css',
})
export class SortComponent {
  private store = inject(Store);
  sorting$ = this.store.select(selectUserSort);
  query$ = this.store.select(selectUserQuery);

  sortOptions: SelectItem[] = [
    { label: 'Followers', value: 'followers' },
    { label: 'Repos', value: 'repositories' },
    { label: 'Recently Created', value: 'created' },
  ];

  sortKey = 'joined'; // Default GitHub sorting value
  sortOrder = 'desc';
  query = '';

  constructor() {
    this.sorting$.subscribe(({ sort, order }) => {
      this.sortKey = sort ?? 'joined'; // Default value
      this.sortOrder = order ?? 'desc';
    });
    this.query$.subscribe((query) => {
      this.query = query; // Default value
    });
  }

  onSortChange(event: any) {
    this.sortKey = event.value;
    this.store.dispatch(
      updateSort({
        query: this.query,
        sort: this.sortKey,
        order: this.sortOrder,
      })
    );
  }

  toggleOrder() {
    this.sortOrder = this.sortOrder === 'desc' ? 'asc' : 'desc';
    this.store.dispatch(
      updateSort({
        query: this.query,
        sort: this.sortKey,
        order: this.sortOrder,
      })
    );
  }

  clearSort() {
    this.sortOrder = 'desc';
    this.store.dispatch(
      updateSort({
        query: this.query,
        sort: '',
        order: this.sortOrder,
      })
    );
  }
}
