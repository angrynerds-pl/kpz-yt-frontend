import Vue from 'vue';
import Vuex from 'vuex';
import { user } from './user';
Vue.use(Vuex);

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RootState {}

export default new Vuex.Store<RootState>({
  state: {},
  mutations: {},
  actions: {},
  modules: { user }
});
