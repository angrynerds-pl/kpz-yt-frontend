import { MutationTree } from 'vuex';
import { PlayerState, RepeatMode } from '.';
import Vue from 'vue';

export const mutations: MutationTree<PlayerState> = {
  setPlayData(state, { playlistItems, index }) {
    state.items = playlistItems;
    state.currentIndex = index;
  },

  setName(state, { name, index }) {
    const item = state.items[index];
    if (item) item.name = name;
  },

  setVolume(state, v: number) {
    state.volume = v;
    if (v > 0) state.muted = false;
  },

  setMuted(state, v: boolean) {
    state.muted = v;
  },

  toggleShuffle(state) {
    state.shuffle = !state.shuffle;
  },

  toggleRepeatMode(state) {
    switch (state.repeatMode) {
      case RepeatMode.ALL:
        state.repeatMode = RepeatMode.ONE;
        break;
      case RepeatMode.ONE:
        state.repeatMode = RepeatMode.NONE;
        break;
      case RepeatMode.NONE:
        state.repeatMode = RepeatMode.ALL;
        break;
    }
  },

  next(state) {
    const size = state.items.length;
    const last = size - 1;
    const current = state.currentIndex;
    state.currentIndex = null;
    Vue.nextTick(() => {
      if (current !== null) {
        if (!state.shuffle) {
          switch (state.repeatMode) {
            case RepeatMode.NONE:
              if (current < last) {
                state.currentIndex = current + 1;
              } else {
                state.currentIndex = null;
              }
              break;
            case RepeatMode.ALL:
              state.currentIndex = (current + 1) % size;
              break;
            case RepeatMode.ONE:
              state.currentIndex = current;
              break;
          }
        } else {
          if (size > 1 && state.repeatMode !== RepeatMode.ONE) {
            let rand = 0;
            do {
              rand = Math.floor(Math.random() * Math.floor(size));
            } while (rand == current);
            state.currentIndex = rand;
          } else state.currentIndex = current;
        }
      }
    });
  },

  prev(state) {
    const size = state.items.length;
    const current = state.currentIndex;
    state.currentIndex = null;
    Vue.nextTick(() => {
      if (current !== null) {
        if (!state.shuffle) {
          switch (state.repeatMode) {
            case RepeatMode.NONE:
              if (current > 0) {
                state.currentIndex = current - 1;
              } else {
                state.currentIndex = 0;
              }
              break;
            case RepeatMode.ALL:
              state.currentIndex = current - 1 < 0 ? size - 1 : current - 1;
              break;
            case RepeatMode.ONE:
              state.currentIndex = current;
              break;
          }
        } else {
          if (size > 1 && state.repeatMode !== RepeatMode.ONE) {
            let rand = 0;
            do {
              rand = Math.floor(Math.random() * Math.floor(size));
            } while (rand == current);
            state.currentIndex = rand;
          } else state.currentIndex = current;
        }
      }
    });
  }
};
