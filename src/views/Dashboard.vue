<template>
  <div>
    <v-app-bar
      color="error"
      app
      dark
    >
      <v-app-bar-nav-icon @click="$emit('toggle-nav')"></v-app-bar-nav-icon>
      <v-toolbar-title>Dashboard</v-toolbar-title>
    </v-app-bar>

    <v-content>
      <v-container fluid>
        Some charts and kind words here
      </v-container>
    </v-content>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
@Component({})
export default class Dashboard extends Vue {}
</script>

<style
  lang="scss"
  scoped
></style>
