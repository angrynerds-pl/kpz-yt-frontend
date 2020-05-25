import { User } from '../user';
import { Module } from 'vuex';
import { RootState } from '..';
import { getters } from './getters';
import { actions } from './actions';
import { mutations } from './mutations';

export interface PlaylistItem {
  id?: number;
  ytID: string;
  name?: string;
}

export interface Playlist {
  id?: number;
  user?: User;
  name?: string;
  playlistItems: PlaylistItem[];
}

export interface PlaylistState {
  playlist?: Playlist;
}

const state: PlaylistState = {
  playlist: undefined
};

export const playlist: Module<PlaylistState, RootState> = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
