<template>
  <div>
    <v-list-item
      link
      v-for="playlist in playlists"
      :key="playlist.id"
      @click="$router.push(`/app/playlists/${playlist.id}`)"
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
        <!-- TODO: click -->
        <v-btn
          icon
          small
          @click.stop
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
      style="position:fixed;bottom:0;width:88%;background:#fff;"
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
import { Component } from 'vue-property-decorator';
import { Getter } from 'vuex-class';
import { Playlist } from '@/store/playlist';
import { User } from '@/store/user';

import axios from 'axios';
@Component({})
export default class NavPlaylists extends Vue {
  @Getter('user/authHeader') authHeader!: string;
  @Getter('user/user') user!: User;

  playlists: Playlist[] = [];

  beforeMount() {
    axios
      .get(`users/${this.user.id}/playlists`, {
        headers: { Authorization: this.authHeader }
      })
      .then(res => {
        this.playlists = res.data.data;
      });
  }
}
</script>

<style
  lang="scss"
  scoped
></style>
