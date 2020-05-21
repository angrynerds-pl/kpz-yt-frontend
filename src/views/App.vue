<template>
  <v-app>
    <v-navigation-drawer
      v-model="nav"
      app
    >
      <v-list
        nav
        class="py-0"
      >
        <v-list-item
          two-line
          @click="$router.push('/app/user')"
          title="Go to profile"
        >
          <v-list-item-avatar tile>
            <img
              :src="`https://api.adorable.io/avatars/256/${user.username}.png`"
            />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title
              >{{ user.firstname }} {{ user.lastname }}</v-list-item-title
            >
            <v-list-item-subtitle>{{ user.username }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn
              @click="logout"
              icon
              title="Logout"
            >
              <v-icon color="grey lighten-1">mdi-exit-to-app</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>

        <v-list-item
          link
          @click="$router.push(`/app`)"
        >
          <v-list-item-avatar
            color="grey lighten-5"
            tile
          >
            <v-icon>mdi-chart-bar-stacked</v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <nav-playlists v-bind:playlists="playlists" />
      </v-list>
    </v-navigation-drawer>

    <router-view
      @toggle-nav="nav = !nav"
      @showSnackbar="showSnackbar"
      @updatePlaylists="updatePlaylists"
    >
    </router-view>

    <player />

    <v-snackbar
      v-model="snackbarVisible"
      top
    >
      {{ snackbarInfo }}
      <v-btn
        dark
        text
        @click="snackbarVisible = false"
        color="error"
      >
        Close
      </v-btn>
    </v-snackbar>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import axios from 'axios';
import { Component } from 'vue-property-decorator';
import { Getter, Mutation } from 'vuex-class';
import NavPlaylists from '@/components/playlist/NavPlaylists.vue';
import Player from '@/components/player/Player.vue';
import { PlaylistItem, Playlist } from '../store/playlist';
import UserForm from './UserForm.vue';
import { User } from '../store/user';

@Component({
  components: { NavPlaylists, Player }
})
export default class App extends Vue {
  @Getter('user/user') user!: User;
  @Mutation('user/setUserFromToken') setUserFromToken!: () => void;
  @Mutation('user/logout') logoutMutation!: () => void;
  @Getter('user/authHeader') authHeader!: string;
  nav = this.$vuetify.breakpoint.lgAndUp;

  playlists: Playlist[] = [];

  /* TEST */
  @Mutation('player/setPlayData') setPlayData!: (payload: {
    playlistItems: PlaylistItem[];
    index: number | null;
  }) => void;
  mounted() {
    setTimeout(() => {
      this.setPlayData({
        playlistItems: [
          {
            name: 'Rick Astley - Never Gonna Give You Up (Video)',
            ytID: 'dQw4w9WgXcQ'
          },
          {
            name: 'Lacheque - DRAGONFRUIT SALAD',
            ytID: 'hWCs7fsl3QA'
          },
          {
            name: 'Yutaka - Dragonfly',
            ytID: '2Il1OtvmVSg'
          }
        ],
        index: 1
      });
    }, 500);

    this.updatePlaylists();
  }
  /* TEST */

  beforeMount() {
    this.setUserFromToken();
  }

  logout() {
    this.logoutMutation();
    this.$router.push('/');
  }

  snackbarInfo = '';
  snackbarVisible = false;

  showSnackbar(info: string) {
    this.snackbarInfo = info;
    this.snackbarVisible = true;
  }

  updatePlaylists() {
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
