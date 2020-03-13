<template>
  <v-app>
    <v-content>
      <v-container fluid>
        <v-btn
          color="primary"
          small
          @click="close"
        >
          Close
        </v-btn>
        <v-btn
          color="primary"
          small
          @click="testTab"
        >
          Go to Calm Geeks
        </v-btn>
      </v-container>
    </v-content>
  </v-app>
</template>

<script lang="ts">
/// <reference path="../../../node_modules/@types/chrome/index.d.ts" />
import Vue from 'vue';
import Component from 'vue-class-component';
@Component({})
export default class Popup extends Vue {
  mounted() {
    console.log(chrome);
  }
  close() {
    window.close();
  }
  testTab() {
    chrome.tabs.create({
      url: 'http://angrynerds.pl'
    });
  }
}
</script>