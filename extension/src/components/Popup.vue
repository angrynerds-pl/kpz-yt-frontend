<template>
  <v-app>
    <v-toolbar flat short dense>
      <v-btn
        class="ml-n1"
        small
        icon
        @click.prevent="close"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-toolbar-title>
        YouTube Favourite Lists
      </v-toolbar-title>
    </v-toolbar>
    <v-content class="pa-2">
      <v-container fluid class="login-container">
        <h1 class="text-center">
          {{
            isLoggedIn
              ? 'What do you think about?'
              : 'Login'
          }}
        </h1>
        <v-row v-if="isLoggedIn" justify="center">
          <v-col
            class="d-flex justify-space-around"
          >
            <v-btn
              dark
              color="success"
              @click.prevent="openFront"
            >
              <v-icon class="mr-1"
                >mdi-open-in-new</v-icon
              >
              Go to app
            </v-btn>
            <v-btn
              color="success"
              @click.prevent="logout"
            >
              <v-icon class="mr-1"
                >mdi-exit-to-app</v-icon
              >
              Logout
            </v-btn>
          </v-col>
        </v-row>
        <v-form v-else class="py-4">
          <v-alert
            v-model="alertVisible"
            dismissible
            type="error"
            dense
          >
            {{ alertMessage }}
          </v-alert>
          <v-text-field
            class="mb-2"
            v-model="authData.username"
            :error-messages="usernameErrors"
            autocomplete="off"
            label="Username"
            :disabled="loading"
            @blur="$v.authData.username.$touch()"
            required
          ></v-text-field>

          <v-text-field
            class="mb-2"
            v-model="authData.password"
            label="Password"
            :error-messages="passwordErrors"
            type="password"
            name="password"
            autocomplete="off"
            :disabled="loading"
            @blur="$v.authData.password.$touch()"
            required
          ></v-text-field>

          <v-btn
            class="mb-6"
            type="submit"
            color="success"
            :loading="loading"
            :disabled="$v.$error"
            block
            @click.prevent="submit"
          >
            Login
          </v-btn>
          <div class="mb-2 d-flex justify-center">
            <span>Have not account yet?</span>
          </div>
          <v-btn
            text
            block
            small
            @click.prevent="openFront('register')"
          >
            Sign up
          </v-btn>
        </v-form>
      </v-container>
    </v-content>
  </v-app>
</template>

<script lang="ts">
/// <reference path="../../../node_modules/@types/chrome/index.d.ts" />

import Vue from 'vue';
import axios from 'axios';
import { required } from 'vuelidate/lib/validators';
import Component from 'vue-class-component';
import { Validations } from 'vuelidate-property-decorators';
import { ValidationEvaluation } from 'vue/types/vue';

interface AuthData {
  username: string;
  password: string;
}

@Component({})
export default class Popup extends Vue {
  authData: AuthData = {
    username: '',
    password: ''
  };

  @Validations()
  validations = {
    authData: {
      username: {
        required
      },
      password: {
        required
      }
    }
  };

  loading = false;
  isLoggedIn = false;
  alertVisible = false;
  alertMessage = '';

  created() {
    this.checkIsUserLoggedIn();
    chrome.storage.onChanged.addListener(
      changes => {
        if (changes) {
          this.checkIsUserLoggedIn();
        }
      }
    );
  }

  submit() {
    this.$v.$touch();
    if (this.$v.$error) {
      return;
    }
    this.loading = true;
    axios
      .post('sessions', this.authData)
      .then(res => {
        console.log('res', res.data.access_token);
        chrome.storage.sync.set({
          // eslint-disable-next-line @typescript-eslint/camelcase
          access_token: res.data.access_token
        });
        this.loading = false;
        this.alertVisible = false;
      })
      .catch(error => {
        if (error.response.status == 404) {
          this.alertVisible = true;
          this.alertMessage =
            'Invalid username or password.';
        }
        console.log('error', error);
      })
      .finally(() => {
        this.loading = false;
      });
  }

  close() {
    window.close();
  }

  logout() {
    chrome.storage.sync.clear();
  }

  get usernameErrors() {
    const vAuthData = this.$v.authData;
    if (vAuthData)
      return this.getErrors(
        vAuthData.password as ValidationEvaluation
      );
    else return [];
  }

  get passwordErrors() {
    const vAuthData = this.$v.authData;
    if (vAuthData)
      return this.getErrors(
        vAuthData.password as ValidationEvaluation
      );
    else return [];
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

  private checkIsUserLoggedIn() {
    chrome.storage.sync.get(
      ['access_token'],
      result => {
        const token = result.access_token;
        this.isLoggedIn = !!token;
      }
    );
  }

  private openFront(url: string = '') {
    const finalUrl =
      process.env.VUE_APP_ROOT_FRONT + '/' + url;
    window.open(finalUrl);
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  min-width: 350px;
}
</style>
