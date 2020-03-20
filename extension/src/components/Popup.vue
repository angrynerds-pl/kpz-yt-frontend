<template>
  <v-app>
    <v-content>
      <v-container fluid class="login-container">
        <v-form>
          <v-text-field
            v-model="authData.username"
            :error-messages="usernameErrors"
            autocomplete="off"
            label="Username"
            :disabled="loading"
            @blur="$v.authData.username.$touch()"
            required
          ></v-text-field>

          <v-text-field
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
            type="submit"
            color="success"
            :loading="loading"
            :disabled="$v.$error"
            block
            @click="submit"
          >
            Login
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
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';
import Component from 'vue-class-component';

@Component({
  mixins: [validationMixin],
  validations: {
    authData: {
      username: {
        required
      },
      password: {
        required
      }
    }
  }
})
export default class Popup extends Vue {
  apiUrl!: string;
  authData: any = {
    username: null,
    password: null
  };
  loading = false;

  created() {
    this.apiUrl = process.env.API_URL;
  }

  submit() {
    const bkg = chrome.extension.getBackgroundPage();

    this.$v.$touch();
    if (this.$v.$error) {
      return;
    }
    this.loading = true;
    axios
      .post('sessions', {
        username: this.authData.username,
        password: this.authData.password
      })
      .then((res: any) => {
        chrome.storage.sync.set({
          access_token: res.access_token
        });
        this.loading = false;
      })
      .catch(error => {
        bkg && bkg.console.log('error');
        this.loading = false;
      });
  }

  close() {
    window.close();
  }

  get usernameErrors() {
    const errors: string[] = [];
    if (this.$v.authData) {
      if (!this.$v.authData.username.$dirty) {
        return errors;
      }
      if (!this.$v.authData.username.required) {
        errors.push('Field is required!');
      }
    }
    return errors;
  }

  get passwordErrors() {
    const errors: string[] = [];
    if (this.$v.authData) {
      if (!this.$v.authData.password.$dirty) {
        return errors;
      }
      if (!this.$v.authData.password.required) {
        errors.push('Field is required!');
      }
    }
    return errors;
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  min-width: 250px;
}
</style>
