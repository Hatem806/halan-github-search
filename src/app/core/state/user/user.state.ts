import { GitHubUser } from '../../models/user.mode';

export interface UserState {
  items: GitHubUser[];
  total_count: number;
  loading: boolean;
  error: string | null;
}

export const initialState: UserState = {
  items: [],
  total_count: 0,
  loading: false,
  error: null,
};
