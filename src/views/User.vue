<template>
  <div>
    <v-app-bar
      color="error"
      app
      dark
    >
      <v-app-bar-nav-icon @click="$emit('toggle-nav')"></v-app-bar-nav-icon>
      <v-toolbar-title>Your profile</v-toolbar-title>
    </v-app-bar>

    <v-content>
      <v-container>
        <!-- TODO -->
        Info, avatar and edit options here
        <pre>{{ JSON.stringify(user, null, 2) }}</pre>
      </v-container>
    </v-content>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Getter } from 'vuex-class';
@Component({})
export default class User extends Vue {
  @Getter('user/user') user!: User;
}
</script>

<style
  lang="scss"
  scoped
></style>
