import { GetterTree } from 'vuex';
import { UserState } from '.';
import { RootState } from '..';

export const getters: GetterTree<UserState, RootState> = {
  isLoggedIn(state: UserState) {
    return !!state.token;
  },

  authHeader(state: UserState) {
    return `Bearer ${state.token}`;
  },

  user(state: UserState) {
    return state.user;
  }
};
