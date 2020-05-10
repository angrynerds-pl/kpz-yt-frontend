<template>
  <div>
    <v-app-bar
      color="error"
      app
      dark
    >
      <v-app-bar-nav-icon @click="$emit('toggle-nav')"></v-app-bar-nav-icon>
      <v-toolbar-title>{{title}}</v-toolbar-title>
    </v-app-bar>

    <v-content>
      <v-container>
        <list-playlist @setToolbarTitle="setToolbarTitle"/>
      </v-container>
    </v-content>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import ListPlaylist from '../../components/playlist/ListPlaylist.vue'
@Component({
  components: {
    ListPlaylist
  }
})
export default class Playlist extends Vue {


    title = 'title';

    setToolbarTitle(title: string)
    {
      this.title = title;
    }
}
</script>

<style
  lang="scss"
  scoped
></style>
