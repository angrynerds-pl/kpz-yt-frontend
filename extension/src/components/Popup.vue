<template>
  <v-app>
    <v-content class="pa-2">
      <v-container fluid class="login-container">
        <v-btn
          class="close-button-container"
          icon
          @click.prevent="close"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <div
          v-if="isLoggedIn"
          class="d-flex flex-column fill-height justify-space-around align-center"
        >
          <div
            class="d-flex justify-center align-center"
          >
            <h2>
              What you think about?
            </h2>
          </div>
          <!--          <div-->
          <!--            class="d-flex flex-row flex-grow-1 justify-space-around align-center"-->
          <!--          >-->
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                dark
                v-on="on"
                color="success"
                icon
                @click.prevent="logout"
              >
                <v-icon>mdi-open-in-new</v-icon>
              </v-btn>
            </template>
            <span>Go to app</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                dark
                v-on="on"
                color="success"
                icon
                @click.prevent="logout"
              >
                <v-icon>mdi-exit-to-app</v-icon>
              </v-btn>
            </template>
            <span>Logout</span>
          </v-tooltip>
        </div>
        <!--        </div>-->
        <v-form v-else class="pt-4 pb-4">
          <h1 class="headline mb-2">Login</h1>
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
            <span>
              Have not account yet?
            </span>
          </div>
          <v-btn text block>
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
  authData: any = {
    username: null,
    password: null
  };
  loading = false;
  isLoggedIn = false;

  created() {
    this.checkIsUserLoggedIn();
    chrome.storage.onChanged.addListener(
      (changes, namespace) => {
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
      .then((res: any) => {
        console.log('res', res.data.access_token);
        chrome.storage.sync.set({
          access_token: res.data.access_token
        });
        this.loading = false;
      })
      .catch(error => {
        console.log('error');
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

  private checkIsUserLoggedIn() {
    chrome.storage.sync.get(
      ['access_token'],
      result => {
        const token = result.access_token;
        token
          ? (this.isLoggedIn = true)
          : (this.isLoggedIn = false);
      }
    );
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  min-width: 250px;
  height: 100%;
}
.headline {
  text-align: center;
}
.close-button-container {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
