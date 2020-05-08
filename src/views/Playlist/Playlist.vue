<template>
  <div>
    <v-app-bar
      color="error"
      app
      dark
    >
      <v-app-bar-nav-icon @click="$emit('toggle-nav')"></v-app-bar-nav-icon>
      <v-toolbar-title>Playlist name here</v-toolbar-title>
    </v-app-bar>

    <v-content>
      <v-container>
        <!-- TODO -->
        List of items and actions
        {{ $route.params.id }}
      </v-container>
    </v-content>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
@Component({})
export default class Playlist extends Vue {}
</script>

<style
  lang="scss"
  scoped
></style>
