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
        title="Add to playlist"
      >
        <template v-slot:activator="{ on }">
          <v-btn
            :dark="isDark"
            v-on="on"
            icon
          >
            <v-icon :dark="isDark">mdi-youtube</v-icon>
          </v-btn>
        </template>

        <v-card
          :dark="isDark"
          class="yt-button-popover"
        >
          <v-card-title class="yt-font-large">
            YouTube Favourite Lists
          </v-card-title>
          <v-card-subtitle class="yt-font-middle">
            Pick playlist to add this video to:
          </v-card-subtitle>

          <div style="position:relative;">
            <v-card-text class="yt-font-middle">
              <template v-if="textInfo">
                {{ textInfo }}
              </template>
              <v-list
                v-else
                :dark="isDark"
                dense
                class="yt-list"
              >
                <v-list-item
                  v-for="playlist in playlists"
                  :key="playlist.id"
                  @click="addToPlaylist(playlist.id)"
                >
                  {{ playlist.name }}
                </v-list-item>
              </v-list>
            </v-card-text>
            <v-overlay
              :value="loading"
              absolute
            >
              <v-progress-circular
                indeterminate
                size="64"
              ></v-progress-circular>
            </v-overlay>
          </div>
          <v-divider></v-divider>

          <v-card-actions>
            <v-slide-x-reverse-transition>
              <div v-if="addingStatus === AddingStatus.SUCCESS">
                <v-icon
                  :dark="isDark"
                  color="success"
                >
                  mdi-check
                </v-icon>
                Added successfully
              </div>
            </v-slide-x-reverse-transition>
            <v-slide-x-reverse-transition>
              <div v-if="addingStatus === AddingStatus.ERROR">
                <v-icon
                  :dark="isDark"
                  color="error"
                >
                  mdi-alert
                </v-icon>
                Error
              </div>
            </v-slide-x-reverse-transition>
            <v-spacer></v-spacer>
            <v-btn
              text
              :dark="isDark"
              @click="menu = false"
              class="yt-font-small"
            >
              Close
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
import { Watch } from 'vue-property-decorator';
import jwtDecode from 'jwt-decode';
import urlParse from 'url-parse';
interface AuthData {
  username: string;
  password: string;
}

enum AddingStatus {
  NONE,
  SUCCESS,
  ERROR
}

@Component({
  mixins: [validationMixin],
  data: () => ({
    AddingStatus
  })
})
export default class YtButton extends Vue {
  menu = false;
  loading = false;
  isLoggedIn = false;
  isDark = false;
  tokenData: Record<string, any> = {};
  textInfo: false | string = false;
  token: string = '';
  addingStatus: AddingStatus = AddingStatus.NONE;
  playlists: { name: string; id: number }[] = [];

  addingFeedbackTimeout: number = 0;

  mounted() {
    this.setLoggedWatcher();
    this.setThemeWatcher();
  }

  @Watch('menu')
  onMenuOpen(n: boolean) {
    if (n) {
      if (this.isLoggedIn) {
        this.loadPlaylists();
      } else {
        this.textInfo = "Please login using extension's popup.";
        this.loading = false;
      }
    }
  }

  private loadPlaylists() {
    this.loading = true;
    axios
      .get(`/users/${this.tokenData.user.id}/playlists`, {
        headers: { Authorization: `Bearer ${this.token}` }
      })
      .then(res => {
        this.playlists = res.data.data;
        this.textInfo = false
      })
      .catch(() => {
        this.textInfo = 'Error while loading playlists.';
      })
      .finally(() => {
        this.loading = false;
      });
  }

  private addToPlaylist(id: number) {
    this.loading = true;
    axios
      .post(
        `/playlists/${id}/playlist-items`,
        {
          ytID: urlParse(window.location.href, true).query.v,
          playlist: { id }
        },
        {
          headers: { Authorization: `Bearer ${this.token}` }
        }
      )
      .then(res => {
        this.addingStatus = AddingStatus.SUCCESS;
      })
      .catch(() => {
        this.addingStatus = AddingStatus.ERROR;
      })
      .finally(() => {
        this.loading = false;
        clearTimeout(this.addingFeedbackTimeout);
        this.addingFeedbackTimeout = setTimeout(() => {
          this.addingStatus = AddingStatus.NONE;
        }, 1500);
      });
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
      this.token = token;
      this.tokenData = jwtDecode(token);
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
.yt-button-popover {
  font-size: 16px !important;
}

.yt-font {
  &-middle {
    font-size: 0.875em !important;
    line-height: 1.375em !important;
  }
  &-large {
    font-size: 1.25em !important;
  }
  &-small {
    font-size: 0.875em !important;
  }
}

.yt-list {
  max-height: 256px;
  overflow-y: scroll;
}
</style>
