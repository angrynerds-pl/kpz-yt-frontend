<template>
  <div>
    <v-list-item
      link
      v-for="playlist in playlists"
      :key="playlist.id"
      @click="playlistSelected(`${playlist.id}`)"
      :class="
        `/app/playlists/${playlist.id}` === $route.path
          ? 'v-item--active v-list-item--active'
          : ''
      "
    >
      <v-list-item-avatar
        color="grey lighten-5"
        tile
      >
        <v-icon>mdi-playlist-music</v-icon>
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title>{{ playlist.name }}</v-list-item-title>
      </v-list-item-content>
      <v-list-item-action>
        <v-btn
          icon
          small
          @click.stop="playlistPlayClicked(`${playlist.id}`)"
        >
          <v-icon color="grey lighten-1">mdi-play</v-icon>
        </v-btn>
      </v-list-item-action>
    </v-list-item>

    <!-- Empty list item to make space for `New playlist` -->
    <v-list-item
      link
      dense
      disabled
    >
    </v-list-item>
    <v-list-item
      link
      dense
      @click="$router.push('/app/playlists')"
      style="position:fixed;bottom:0;width: calc(100% - 16px); background:#fff;"
    >
      <v-list-item-avatar>
        <v-icon>mdi-plus</v-icon>
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title>New playlist</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Getter, Action } from 'vuex-class';
import { Playlist, PlaylistItem } from '@/store/playlist';
import { User } from '@/store/user';

import axios from 'axios';
@Component({})
export default class NavPlaylists extends Vue {
  @Prop({ default: [] }) playlists!: Playlist[];

  @Getter('user/authHeader') authHeader!: string;
  @Getter('user/user') user!: User;
  @Action('player/setPlayDataFetch') setPlayData!: (payload: {
    playlistItems: PlaylistItem[];
    index: number | null;
  }) => void;

  playlistPlayClicked(playlistId: number) {
    const payload = {
      playlistItems: [],
      index: 0
    };
    axios
      .get(`playlists/${playlistId}/playlist-items`, {
        headers: { Authorization: this.authHeader }
      })
      .then(res => {
        if (res.data.data !== undefined) {
          payload.playlistItems = res.data.data;
        }
        this.setPlayData(payload);
      })
      .catch(error => {
        this.$emit('showSnackBar', 'Server error');
        console.log(error);
      });
  }

  playlistSelected(playlistId: number) {
    this.$router.push(`/app/playlists/${playlistId}`);
  }
}
</script>

<style
  lang="scss"
  scoped
></style>
