import { Module } from 'vuex';
import { RootState } from '..';
import { mutations } from './mutations';
import { getters } from './getters';
import { actions } from './actions';
export interface User {
  id?: number;
  username: string;
  password?: string;
  firstname: string;
  lastname: string;
}

export interface UserState {
  user?: User;
  token?: string;
}

const state: UserState = {
  user: undefined,
  token: localStorage.getItem('access_token') || undefined
};

export const user: Module<UserState, RootState> = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
