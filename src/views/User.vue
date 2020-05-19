<template>
  <div>
    <v-app-bar
      color="error"
      app
      dark
    >
      <v-app-bar-nav-icon @click="$emit('toggle-nav')"></v-app-bar-nav-icon>
      <v-toolbar-title>Your profile</v-toolbar-title>
    </v-app-bar>

   <v-content> 
    <v-form>
      <v-container>
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field
              label="Username"
              :value=user.username
              outlined
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="6">
            <v-text-field
              label="First name"
              :value=user.firstname
              outlined
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="6">
            <v-text-field
              label="Last name"
              :value=user.lastname
              outlined
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="6">
            <v-text-field
              type="password"
              label="New password"
              hint="Enter new password"
              outlined
            ></v-text-field>
          </v-col>
        </v-row>
        <v-btn
            color="error"
          >
            Apply changes
            </v-btn>
      </v-container>
    </v-form>
  </v-content>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Getter } from 'vuex-class';
@Component({})
export default class User extends Vue {
  @Getter('user/user') user!: User;
}
</script>

<style
  lang="scss"
  scoped
></style>
