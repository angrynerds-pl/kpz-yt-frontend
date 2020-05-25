import { ActionTree } from 'vuex';
import { PlayerState } from '.';
import { RootState } from '..';
import axios from 'axios';

export const actions: ActionTree<PlayerState, RootState> = {
  setPlayDataFetch(context, { playlistItems, index }) {
    context.commit('setPlayData', { playlistItems, index });

    context.state.items.forEach((item, index) => {
      if (!item.name)
        context
          .dispatch('fetchName', item.ytID)
          .then(res => {
            try {
              const ytResponse = res.data.items[0].snippet;

              context.commit('setName', { name: ytResponse.title, index });
            } catch (e) {
              console.log(e);
            }
          })
          .catch(error => {
            console.log(error);
          });
    });
  },

  fetchName(context, ytID) {
    return axios.get(`youtubeapi/videos/${ytID}`, {
      headers: { Authorization: context.rootGetters['user/authHeader'] }
    });
  }
};
