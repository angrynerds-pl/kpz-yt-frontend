<template>
  <v-app>
    <v-content>
      <v-container>
        <v-row>
          <v-col>
            <h1 class="display-2 text-md-left text-center">
              YouTube Favourite Lists
            </h1>
            <h5 class="subtitle-1	text-md-left text-center font-weight-light">
              The best way to lorem ipsum!
            </h5>
          </v-col>
        </v-row>
        <v-row
          class="tall-row"
          align="center"
        >
          <v-col
            :order-md="1"
            :order="2"
            :cols="12"
            :md="4"
            :sm="12"
          >
            <router-view @showSnackbar="showSnackbar" />
          </v-col>
          <v-col
            :order-md="2"
            :order="1"
            class="d-flex align-center flex-column text-center"
          >
            <v-img
              max-width="30%"
              src="@/assets/album.png"
            />
            <h1
              title="Really!"
              class="font-weight-light"
            >
              Your favourite
              <span
                class="font-weight-medium"
                style="color:red"
                >YoutTube</span
              >
              videos everywhere!*
            </h1>
            <h5 class="font-weight-light">
              * Without need for signing in to Google account.
            </h5>
          </v-col>
        </v-row>
        <v-divider />
        <v-row class="tall-row">
          <v-col
            :cols="12"
            :md="5"
            class="pb-0 pb-md-3 d-flex flex-column align-center justify-center"
          >
            <h1 class="d-inline-block d-md-none font-weight-light">
              Check out our Chrome Extension
            </h1>
            <v-img
              :max-width="this.$vuetify.breakpoint.smAndDown ? 200 : 300"
              contain
              src="@/assets/work.png"
            />
          </v-col>
          <v-col
            class="pt-0 pt-md-3 d-flex flex-column align-start justify-center"
          >
            <h1 class="d-none d-md-inline-block  font-weight-light">
              Check out our Chrome Extension
            </h1>
            <ol class="title font-weight-light">
              <li>Install extension from store</li>
              <li>Sign in using popup</li>
              <li>Use button integrated with YouTube page</li>
            </ol>
            <v-btn
              color="error"
              class="mt-3"
              href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            >
              Install Extension now
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
      <v-footer
        padless
        color="red lighten-1"
      >
        <v-card
          flat
          tile
          width="100%"
          class="red lighten-1 text-center"
        >
          <v-card-text class="white--text">
            {{ new Date().getFullYear() }} —
            <strong>Angry Nerds and Friends</strong>
          </v-card-text>
        </v-card>
      </v-footer>
    </v-content>
    <v-snackbar
      v-model="snackbarVisible"
      top
    >
      {{ snackbarInfo }}
      <v-btn
        dark
        text
        @click="snackbarInfo = false"
        color="error"
      >
        Close
      </v-btn>
    </v-snackbar>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
@Component({})
export default class Home extends Vue {
  snackbarInfo = '';
  snackbarVisible = false;

  showSnackbar(info: string) {
    this.snackbarInfo = info;
    this.snackbarVisible = true;
  }
}
</script>

<style
  lang="scss"
  scoped
>
.tall-row {
  min-height: 500px;
}
</style>
