<template>
  <v-app>
    <v-content>
      <v-container>
        <v-row>
          <v-col>
            <h1 class="display-2 text-md-left text-center">
              YouTube Favourite Lists
            </h1>
          </v-col>
        </v-row>
        <v-row class="main-row" align="center">
          <v-col :order-md="1" :order="2" :cols="12" :md="4" :sm="12">
            <router-view @showSnackbar="showSnackbar" />
          </v-col>
          <v-col
            :order-md="2"
            :order="1"
            class="d-flex align-center flex-column text-center 	"
          >
            <v-img max-width="30%" src="@/assets/album.png" />
            <h1 title="Really!" class="font-weight-light">
              Your favourite
              <span class="font-weight-medium" style="color:red">YoutTube</span>
              videos everywhere!*
            </h1>
            <h5 class="font-weight-light">
              * Without need for signing in to Google account.
            </h5>
          </v-col>
        </v-row>
      </v-container>
      <v-footer padless color="red lighten-1">
        <v-card flat tile width="100%" class="red lighten-1 text-center">
          <v-card-text class="white--text">
            {{ new Date().getFullYear() }} —
            <strong>Angry Nerds and Friends</strong>
          </v-card-text>
        </v-card>
      </v-footer>
    </v-content>
    <v-snackbar v-model="snackbarVisible" top>
      {{ snackbarInfo }}
      <v-btn dark text @click="snackbarInfo = false" color="error">
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

<style lang="scss" scoped>
.main-row {
  min-height: 500px;
}
</style>
