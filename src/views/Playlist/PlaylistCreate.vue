<template>
  <div>
    <v-app-bar
      color="error"
      app
      dark
    >
      <v-app-bar-nav-icon @click="$emit('toggle-nav')"></v-app-bar-nav-icon>
      <v-toolbar-title>New playlist</v-toolbar-title>
    </v-app-bar>

    <v-content>
      <v-container>
        <create-playlist-form @showSnackbar="e => $emit('showSnackbar', e)" />
      </v-container>
    </v-content>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import CreatePlaylistForm from '@/components/playlist/CreatePlaylistForm.vue';
@Component({
  components: {
    CreatePlaylistForm
  }
})
export default class PlaylistCreate extends Vue {}
</script>

<style
  lang="scss"
  scoped
></style>
