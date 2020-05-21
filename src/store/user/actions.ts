import { ActionTree } from 'vuex';
import { UserState } from '.';
import { RootState } from '..';
import Axios, { AxiosResponse, AxiosError } from 'axios';

export const actions: ActionTree<UserState, RootState> = {
  login(context, { username, password }) {
    return Axios.post('sessions', { username, password })
      .then((response: AxiosResponse) => {
        context.commit('login', response.data.access_token);
        context.commit('setUserFromToken');
        return Promise.resolve(response);
      })
      .catch((err: AxiosError) => {
        return Promise.reject(err);
      });
  }
};
