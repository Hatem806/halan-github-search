import { Component, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { GithubService } from '../../core/services/github.service';
import { ButtonModule } from 'primeng/button';
import { DataView } from 'primeng/dataview';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-users-list',
  imports: [ButtonModule, DataView, NgClass, PaginatorModule],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css',
})
export class UsersListComponent {
  items = [];
  users = signal<any>([]);

  protected httpParams = signal<HttpParams>(new HttpParams().set("page", 1).set("limit", 15));


  constructor(private githubService: GithubService) {}

  ngOnInit() {
    // this.githubService.getUsers().then((data) => {
    //   this.users.set(data);
    // });
    this.users.set([
      {
        login: 'john',
        id: 1668,
        node_id: 'MDQ6VXNlcjE2Njg=',
        avatar_url: 'https://avatars.githubusercontent.com/u/1668?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/john',
        html_url: 'https://github.com/john',
        followers_url: 'https://api.github.com/users/john/followers',
        following_url:
          'https://api.github.com/users/john/following{/other_user}',
        gists_url: 'https://api.github.com/users/john/gists{/gist_id}',
        starred_url: 'https://api.github.com/users/john/starred{/owner}{/repo}',
        subscriptions_url: 'https://api.github.com/users/john/subscriptions',
        organizations_url: 'https://api.github.com/users/john/orgs',
        repos_url: 'https://api.github.com/users/john/repos',
        events_url: 'https://api.github.com/users/john/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/john/received_events',
        type: 'User',
        user_view_type: 'public',
        site_admin: false,
        score: 1.0,
      },
    ]);
  }

  onPageChange(event: PaginatorState) {
    this.httpParams.update(params =>
        params.set("page", (event.page ?? 1) + 1).set("limit", event.rows ?? 15),
    );
}
}
