<template>
  <v-card>
    <v-card-title class="text-upper">
      Sign in!
    </v-card-title>
    <v-card-subtitle>
      Go to your playlists in no time.
    </v-card-subtitle>

    <v-card-text>
      <v-alert v-if="alertInfo" color="error" dark dismissible dense>
        {{ alertInfo }}
      </v-alert>
      <v-form>
        <v-text-field
          label="Username"
          prepend-icon="mdi-account"
          v-model="username"
          :error-messages="this.getErrors($v.username)"
        />
        <v-text-field
          prepend-icon="mdi-lock"
          label="Password"
          type="password"
          v-model="password"
          :error-messages="this.getErrors($v.password)"
        />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <div>
        <v-btn
          color="default"
          @click="$router.push('/signup')"
          small
          text
          :loading="loading"
        >
          Sign up
        </v-btn>
      </div>
      <v-spacer />
      <v-btn
        color="error"
        :disabled="$v.$error"
        @click="submit"
        :loading="loading"
      >
        Sign in
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Validate } from 'vuelidate-property-decorators';
import { required } from 'vuelidate/lib/validators';
import { ValidationEvaluation } from 'vue/types/vue';
import axios from 'axios';
@Component({})
export default class SignInForm extends Vue {
  @Validate({ required })
  username = '';
  @Validate({ required })
  password = '';

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
      .post('sessions', {
        username: this.username,
        password: this.password
      })
      .then(res => {
        //TODO: Mutation -> set user in vuex
        // eslint-disable-next-line
        const access_token = res.data.access_token;
        this.$router.push('/dashboard');
      })
      .catch(error => {
        if (error.response.status === 404) {
          this.alertInfo = 'Invalid username or password!';
        }
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
