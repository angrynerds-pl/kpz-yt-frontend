<template>
  <v-card>
    <v-card-title class="text-upper">
      Create new empty playlist
    </v-card-title>
    <v-card-subtitle>
      Hide your embarrassing songs under a catchy name.
    </v-card-subtitle>

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
          label="Playlist name"
          prepend-icon="mdi-pencil"
          v-model="playlistName"
          :error-messages="this.getErrors($v.playlistName)"
        />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn
        color="error"
        :disabled="$v.$error"
        @click="submit"
        :loading="loading"
      >
        Create
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import bus from '../../main';
import Vue from 'vue';
import axios from 'axios';
import { Component } from 'vue-property-decorator';
import { Validate } from 'vuelidate-property-decorators';
import { required } from 'vuelidate/lib/validators';
import { ValidationEvaluation } from 'vue/types/vue';
import { Action } from 'vuex-class';
import { Getter } from 'vuex-class';
import { User } from '@/store/user';
import { AxiosPromise } from 'axios';
@Component({})
export default class CreatePlaylistForm extends Vue {
  @Getter('user/authHeader') authHeader!: string;
  @Getter('user/user') user!: User;
  @Validate({ required })
  playlistName = '';

  loading = false;
  alertInfo: string | false = false;

  submit() {
    this.alertInfo = false;
    this.$v.$touch();
    if (this.$v.$error) {
      return;
    }
    this.loading = true;
    axios
      .post(
        '/playlists',
        {
          name: this.playlistName,
          user: { id: this.user.id }
        },
        {
          headers: { Authorization: this.authHeader }
        }
      )
      .then(res => {
        this.$emit('showSnackbar', 'Playlist created!');
        bus.$emit('refreshPlaylists');
        this.$router.push(`/app/playlists/${res.data.data.id}`);
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
