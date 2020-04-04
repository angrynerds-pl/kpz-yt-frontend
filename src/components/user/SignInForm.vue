<template>
  <v-card>
    <v-card-title>
      Sign in!
    </v-card-title>
    <v-card-subtitle>
      Go to your playlists in no time.
    </v-card-subtitle>

    <v-card-text>
      <v-form>
        <v-text-field
          label="Username"
          prepend-icon="mdi-account"
        />
        <v-text-field
          prepend-icon="mdi-lock"
          label="Password"
          type="password"
        />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn color="primary">
        Sign in
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
@Component({})
export default class SignInForm extends Vue {}
</script>
