import { MutationTree } from 'vuex';
import { UserState, User } from '.';
import jwtDecode from 'jwt-decode';
export const mutations: MutationTree<UserState> = {
  login(state, token: string) {
    state.token = token;
    localStorage.setItem('access_token', token);
  },

  setUserFromToken(state) {
    const decoded = jwtDecode(state.token || '') as { id: number; user: User };
    if (decoded && decoded.user) {
      state.user = decoded.user;
    }
  },

  setUser(state, user: User) {
    state.user = user;
  },

  logout(state) {
    state.user = undefined;
    state.token = undefined;
    localStorage.removeItem('access_token');
  }
};
