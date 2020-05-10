import { GetterTree } from 'vuex';
import { PlaylistState } from '.';
import { RootState } from '..';

export const getters: GetterTree<PlaylistState, RootState> = {
    playlist(state)
    {
        return state.playlist;
    }
}
