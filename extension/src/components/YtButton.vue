<template>
  <v-app
    class="yt-button"
    tag="div"
  >


    <v-content ref="content">
      <v-menu
        v-model="menu"
        :close-on-content-click="false"
        absolute
        left
        bottom
        min-width="300px"
        attach=".yt-button"
      >
        <template v-slot:activator="{ on }">
          <v-btn
            :dark="isDark"
            v-on="on"
            icon
          >
            <v-icon :dark="isDark"
              >mdi-youtube</v-icon>
          </v-btn>
        </template>

        <v-card :dark="isDark">
          <v-list :dark="isDark">
            <v-list-item></v-list-item>
          </v-list>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              text
              :dark="isDark"
              @click="menu = false"
            >
              Cancel
            </v-btn>
            <v-btn
              color="primary"
              text
              :dark="isDark"
              @click="menu = false"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-content>
  </v-app>
</template>

<script lang="ts">
/// <reference path="../../../node_modules/@types/chrome/index.d.ts" />s

import Vue from 'vue';
import axios from 'axios';
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';
import Component from 'vue-class-component';
import { Validations } from 'vuelidate-property-decorators';
import { ValidationEvaluation } from 'vue/types/vue';
interface AuthData {
  username: string;
  password: string;
}

@Component({
  mixins: [validationMixin]
})
export default class YtButton extends Vue {
  menu = false;
  loading = false;
  isLoggedIn = false;
  isDark = false;

  mounted() {
    this.setLoggedWatcher();
    this.setThemeWatcher();
  }

  private setThemeWatcher() {
    const html = document.querySelector('html') as HTMLElement;
    let observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (
          mutation.type == 'attributes' &&
          mutation.attributeName === 'dark'
        ) {
          this.isDark = !!html.getAttribute('dark');
        }
      });
    });
    observer.observe(html, {
      attributes: true
    });

    this.isDark = !!html.getAttribute('dark');
  }

  private setLoggedWatcher() {
    this.checkIsUserLoggedIn();
    chrome.storage.onChanged.addListener(changes => {
      if (changes) {
        this.checkIsUserLoggedIn();
      }
    });
  }

  private checkIsUserLoggedIn() {
    chrome.storage.sync.get(['access_token'], result => {
      const token = result.access_token;
      this.isLoggedIn = !!token;
    });
  }
}
</script>

<style lang="scss">
.yt-button,
.yt-button > * {
  max-height: initial !important;
  min-height: initial !important;
  background-color: transparent !important;
  position: relative;
}
</style>
