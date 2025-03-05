import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { updateSort } from '../../core/state/user/user.actions';
import { selectUserSort } from '../../core/state/user/user.selectors';

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

  sortOptions: SelectItem[] = [
    { label: 'Followers', value: 'followers' },
    { label: 'Repos', value: 'repositories' },
    { label: 'Recently Created', value: 'created' },
  ];

  sortKey = 'joined'; // Default GitHub sorting value
  sortOrder = 'desc';

  constructor() {
    this.sorting$.subscribe(({ sort, order }) => {
      this.sortKey = sort ?? 'joined'; // Default value
      this.sortOrder = order ?? 'desc';
    });
  }

  onSortChange(event: any) {
    this.sortKey = event.value;
    this.store.dispatch(
      updateSort({ sort: this.sortKey, order: this.sortOrder })
    );
  }

  toggleOrder() {
    this.sortOrder = this.sortOrder === 'desc' ? 'asc' : 'desc';
    this.store.dispatch(
      updateSort({ sort: this.sortKey, order: this.sortOrder })
    );
  }
}
