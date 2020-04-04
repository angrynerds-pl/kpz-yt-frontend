<template>
  <v-app>
    <v-content>
      <v-container>
        <v-row>
          <v-col>
            <h1>
              YouTube Favourite Lists
            </h1>
          </v-col>
        </v-row>
        <v-row class="main-row" align="center" >
          <v-col :order-md="1" :order="2" :cols="12" :md="4" :sm="12">
            <router-view />
          </v-col>
          <v-col :order-md="2" :order="1" class="d-flex align-center flex-column text-center">
            <v-img max-width="200" src="@/assets/album.png" />
            <h1>Your favourite <span style="color:red">YoutTube</span> videos everywhere!*</h1>
            <h5>* Without need for signing in to Google account.</h5>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
@Component({})
export default class Home extends Vue {}
</script>

<style lang="scss" scoped>
.main-row {
  height: 500px;
}
</style>
