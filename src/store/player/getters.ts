import { GetterTree } from 'vuex';
import { PlayerState } from '.';
import { RootState } from '..';

export const getters: GetterTree<PlayerState, RootState> = {
  isShuffle(state) {
    return state.shuffle;
  },

  isItemSet(state) {
    return state.currentIndex !== null;
  },

  repeatMode(state) {
    return state.repeatMode;
  },

  item(state) {
    if (state.currentIndex !== null) return state.items[state.currentIndex];
    else return null;
  },

  playlist(state) {
    return state.playlist;
  },

  volume(state) {
    return state.volume;
  },

  isMuted(state) {
    return state.muted;
  }
};
