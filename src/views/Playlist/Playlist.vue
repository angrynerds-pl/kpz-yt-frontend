<template>
  <div>
    <v-dialog
      v-model="confirmDialog"
      max-width="500px"
    >
      <v-card>
        <v-card-title>
          Confirmation
        </v-card-title>

        <v-card-text>
          Do you really want to delete playlist {{ title }} and all of its
          songs?
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="white"
            :disabled="loading"
            @click="confirmDialog = false"
          >
            Cancel
          </v-btn>
          <v-spacer />
          <v-btn
            color="error"
            @click="deletePlaylist(`${$route.params.id}`)"
            :loading="loading"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="changeNameDialog"
      max-width="500px"
    >
      <v-card>
        <v-card-title>
          Change name
        </v-card-title>

        <v-card-text>
          <v-alert
            v-if="alertInfo"
            color="error"
            dark
            dismissible
            dense
          >
            {{ alertInfo }}
          </v-alert>
          <v-form>
            <v-text-field
              label="New name"
              prepend-icon="mdi-pencil"
              v-model="playlistName"
              @keydown.prevent.enter="changeName(`${$route.params.id}`)"
              :error-messages="this.getErrors($v.playlistName)"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="white"
            @click.close="changeNameDialog = false"
            :loading="loading"
          >
            Close
          </v-btn>
          <v-spacer />
          <v-btn
            color="error"
            :disabled="$v.$error"
            @click="changeName(`${$route.params.id}`)"
            :loading="loading"
          >
            Change
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-app-bar
      color="error"
      app
      dark
    >
      <v-app-bar-nav-icon @click="$emit('toggle-nav')"></v-app-bar-nav-icon>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer />

      <v-btn
        v-if="title !== ''"
        icon
        @click.stop="openChangeNameDialog"
      >
        <v-icon color="white">mdi-pencil</v-icon>
      </v-btn>

      <v-btn
        v-if="title !== ''"
        icon
        @click.stop="confirmDialog = !confirmDialog"
      >
        <v-icon color="white">mdi-delete</v-icon>
      </v-btn>
    </v-app-bar>

    <v-content>
      <v-container>
        <list-playlist
          @setToolbarTitle="setToolbarTitle"
          @showSnackbar="e => $emit('showSnackbar', e)"
        />
      </v-container>
    </v-content>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Getter } from 'vuex-class';
import { User } from '@/store/user';
import axios from 'axios';
import ListPlaylist from '../../components/playlist/ListPlaylist.vue';
import { Validate } from 'vuelidate-property-decorators';
import { ValidationEvaluation } from 'vue/types/vue';
import { required } from 'vuelidate/lib/validators';
@Component({
  components: {
    ListPlaylist
  }
})
export default class Playlist extends Vue {
  @Getter('user/authHeader') authHeader!: string;
  @Getter('user/user') user!: User;

  @Validate({ required })
  playlistName = '';
  alertInfo: string | false = false;
  confirmDialog = false;
  changeNameDialog = false;
  title = '';
  loading = false;

  setToolbarTitle(title: string) {
    this.title = title;
  }

  openChangeNameDialog() {
    this.playlistName = this.title;
    this.changeNameDialog = !this.changeNameDialog;
  }

  deletePlaylist(playlistId: number) {
    this.loading = true;

    axios
      .delete(`/playlists/${playlistId}`, {
        headers: { Authorization: this.authHeader }
      })
      .then(() => {
        this.confirmDialog = false;
        this.$emit('updatePlaylists');
        this.$emit('showSnackbar', 'Playlist deleted');
        this.$router.push(`/app`);
      })
      .catch(error => {
        this.$emit('showSnackbar', 'Server error');
        console.log(error);
      })
      .finally(() => {
        this.loading = false;
      });
  }

  changeName(playlistId: number) {
    this.alertInfo = false;
    this.$v.$touch();
    if (this.$v.$error) {
      return;
    }
    this.loading = true;

    axios
      .put(
        `playlists/${playlistId}`,
        {
          name: this.playlistName
        },
        {
          headers: { Authorization: this.authHeader }
        }
      )
      .then(() => {
        this.changeNameDialog = false;
        this.$emit('showSnackbar', 'Name changed!');

        this.$emit('updatePlaylists');
        this.setToolbarTitle(this.playlistName);
      })
      .catch(error => {
        this.alertInfo = 'Server error';
        console.error(error);
      })
      .finally(() => {
        this.loading = false;
      });
  }

  getErrors(fieldEval: ValidationEvaluation) {
    const errors: string[] = [];
    if (!fieldEval.$dirty) {
      return errors;
    }
    if (!fieldEval.required) {
      errors.push('Field is required!');
    }
    return errors;
  }
}
</script>

<style
  lang="scss"
  scoped
></style>
