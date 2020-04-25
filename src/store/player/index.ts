import { Module } from 'vuex';
import { RootState } from '..';
import { mutations } from './mutations';
import { getters } from './getters';
import { actions } from './actions';
import { PlaylistItem, Playlist } from '../playlist';

export enum RepeatMode {
  ALL,
  ONE,
  NONE
}

export interface PlayerState {
  playlist?: Playlist;
  items: PlaylistItem[];
  currentIndex: number | null;
  volume: number;
  muted: boolean;
  repeatMode: RepeatMode;
  shuffle: boolean;
}

const state: PlayerState = {
  items: [],
  currentIndex: null,
  volume: 33,
  muted: false,
  repeatMode: RepeatMode.NONE,
  shuffle: false
};

export const player: Module<PlayerState, RootState> = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
