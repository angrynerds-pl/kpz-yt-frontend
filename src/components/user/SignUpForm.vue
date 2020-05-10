<template>
  <v-card>
    <v-card-title class="text-upper">
      Sign up!
    </v-card-title>
    <v-card-subtitle>
      And keep favourite videos close.
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
          label="Username"
          prepend-icon="mdi-account"
          v-model="username"
          :error-messages="this.getErrors($v.username)"
        />
        <v-text-field
          label="Firstname"
          prepend-icon="mdi-format-text"
          v-model="firstname"
          :error-messages="this.getErrors($v.firstname)"
        />
        <v-text-field
          label="Lastname"
          prepend-icon="mdi-format-text"
          v-model="lastname"
          :error-messages="this.getErrors($v.lastname)"
        />
        <v-text-field
          prepend-icon="mdi-lock"
          label="Password"
          type="password"
          v-model="password"
          :error-messages="this.getErrors($v.password)"
        />
        <v-text-field
          prepend-icon="mdi-lock-alert"
          label="Repeat password"
          type="password"
          v-model="passwordRepeat"
          :error-messages="this.getErrors($v.passwordRepeat)"
        />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn
        @click="$router.back()"
        :loading="loading"
        small
        text
        tabindex="-1"
      >
        Sign in
      </v-btn>
      <v-spacer />
      <v-btn
        color="error"
        :disabled="$v.$error"
        @click="submit"
        :loading="loading"
      >
        Sign up
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Validate } from 'vuelidate-property-decorators';
import { required, sameAs, minLength } from 'vuelidate/lib/validators';
import { ValidationEvaluation } from 'vue/types/vue';
import axios from 'axios';
@Component({})
export default class SignUpForm extends Vue {
  @Validate({ required })
  username = '';
  @Validate({ required })
  firstname = '';
  @Validate({ required })
  lastname = '';
  @Validate({ required, minLength: minLength(8) })
  password = '';
  @Validate({ required, sameAs: sameAs('password') })
  passwordRepeat = '';

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
      .post('/users', {
        username: this.username,
        password: this.password,
        firstname: this.firstname,
        lastname: this.lastname
      })
      .then(res => {
        // eslint-disable-next-line
        const access_token = res.data.access_token;
        this.$emit('showSnackbar', 'Account created! Now sign in calmly.');
        this.$router.push('/');
      })
      .catch(error => {
        this.alertInfo = 'Server error!';
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
    if (fieldEval.required === false) {
      errors.push('Field is required!');
    }
    if (fieldEval.minLength === false) {
      errors.push('Field has to have mininum length of 8!');
    }
    if (fieldEval.sameAs === false) {
      errors.push('Passwords must match!');
    }
    return errors;
  }
}
</script>
