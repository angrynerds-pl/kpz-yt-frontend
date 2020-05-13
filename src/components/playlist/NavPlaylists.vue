<template>
  <div>
    <v-list-item
      link
      v-for="playlist in playlists"
      :key="playlist.id"
      @click="playlistSelected(`${playlist.id}`)"
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
          @click="playlistPlayClicked(`${playlist.id}`)"
        >
          <v-icon color="grey lighten-1">mdi-play</v-icon>
        </v-btn>
      </v-list-item-action>
    </v-list-item>

    <v-list-item
      link
      dense
      @click="$router.push('/app/playlists')"
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
import bus from '../../main';
import { Component } from 'vue-property-decorator';
import { Getter, Mutation } from 'vuex-class';
import { Playlist, PlaylistItem } from '@/store/playlist';
import { User } from '@/store/user';

import axios from 'axios';
@Component({})
export default class NavPlaylists extends Vue {
  @Getter('user/authHeader') authHeader!: string;
  @Getter('user/user') user!: User;
  @Mutation('player/setPlayData') setPlayData!: (payload: {
    playlistItems: PlaylistItem[];
    index: number | null;
  }) => void;

  componentKey = 0;
  playlists: Playlist[] = [];

  beforeMount() {

    bus.$on('refreshPlaylists', () => {
      this.updatePlaylists();
    })

    this.updatePlaylists();
  }

  playlistPlayClicked(playlistId: number) 
  {

    const payload = {
      playlistItems: [],
      index: 0,
  }
    

    axios.get(`playlists/${playlistId}/playlist-items`, {
      headers: { Authorization: this.authHeader }
    })
    .then(res => {
      
      if(res.data.data !== undefined)
      {
        payload.playlistItems = res.data.data;
      }
             
      this.setPlayData(payload);
                
    }).catch(error => {
      this.$emit('showSnackBar', "Server error");
      console.log(error);
    });
  }

  playlistSelected(playlistId: number) {
    this.$router.push(`/app/playlists/${playlistId}`);
    bus.$emit('refreshPlaylistList');
  }


  updatePlaylists(){
    axios
      .get(`users/${this.user.id}/playlists`, {
        headers: { Authorization: this.authHeader }
      })
      .then(res => {
        this.playlists = res.data.data;
      });
  }

  forceRerender() {
    this.componentKey += 1;
  }
}
</script>

<style
  lang="scss"
  scoped
></style>
