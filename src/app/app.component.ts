import { Component } from '@angular/core';
import { UsersListComponent } from './components/users-list/users-list.component';
import { SearchComponent } from './components/search/search.component';
import { SortComponent } from './components/sort/sort.component';
@Component({
  selector: 'app-root',
  imports: [UsersListComponent, SearchComponent, SortComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'halan-github-search';
}
