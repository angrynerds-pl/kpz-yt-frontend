import { MutationTree } from 'vuex';
import { UserState } from '.';
import jwtDecode from 'jwt-decode';
export const mutations: MutationTree<UserState> = {
  login(state, token: string) {
    state.token = token;
    state.user = jwtDecode(token);
    localStorage.setItem('access_token', token);
  },
  logout(state) {
    state.user = undefined;
    state.token = undefined;
    localStorage.removeItem('access_token');
  }
};
