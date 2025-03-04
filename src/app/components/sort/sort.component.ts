import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-sort',
  imports: [SelectModule, FormsModule, ButtonModule],
  templateUrl: './sort.component.html',
  styleUrl: './sort.component.css',
})
export class SortComponent {
  sortOptions: SelectItem[] = [
    { label: 'Followers', value: '!price' },
    { label: 'Repos', value: 'price' },
  ];

  sortOrder!: number;

  sortField!: string;
  sortKey!: string;

  onSortChange(event: any) {
    let value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }
}
