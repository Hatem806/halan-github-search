import { GitHubUser } from '../../models/user.mode';

export interface UserState {
  items: GitHubUser[];
  total_count: number;
  loading: boolean;
  error: string | null;
  query: string;
  sort?: string;
  order?: string;
}

export const initialState: UserState = {
  items: [],
  total_count: 0,
  loading: false,
  error: null,
  query: '',
  sort: 'joined',
  order: 'desc',
};
