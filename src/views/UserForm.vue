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
            <v-col
              cols="12"
              sm="12"
            >
              <v-text-field
                :value="user.username"
                disabled
                prepend-icon="mdi-account"
                label="Username"
              ></v-text-field>
            </v-col>

            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                prepend-icon="mdi-format-text"
                v-model="firstname"
                label="First name"
                :error-messages="this.getErrors($v.firstname)"
              ></v-text-field>
            </v-col>

            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                prepend-icon="mdi-format-text"
                v-model="lastname"
                label="Last name"
                :error-messages="this.getErrors($v.lastname)"
              ></v-text-field>
            </v-col>

            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="password"
                prepend-icon="mdi-lock"
                type="password"
                label="New password"
                hint="Enter new password"
                :error-messages="this.getErrors($v.password)"
              ></v-text-field>
            </v-col>
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="passwordRepeat"
                type="password"
                prepend-icon="mdi-lock-alert"
                label="Repeat new password"
                hint="Enter new password"
                :error-messages="this.getErrors($v.passwordRepeat)"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-btn
            color="error"
            @click.stop="openDialog"
          >
            Save changes
          </v-btn>

          <v-dialog
            v-model="changeUserDialog"
            max-width="500px"
          >
            <v-card>
              <v-card-title class="headline">Confirmation</v-card-title>

              <v-card-text>
                Are you sure to change your account data?
              </v-card-text>

              <v-card-actions>
                <v-btn
                  color="white"
                  @click="
                    changeUserDialog = false;
                    updateUi();
                  "
                >
                  No
                </v-btn>
                <v-spacer />
                <v-btn
                  color="error"
                  @click="submit"
                >
                  Yes
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-container>
      </v-form>
    </v-content>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { User } from '@/store/user';
import { Getter, Mutation } from 'vuex-class';
import { Validate } from 'vuelidate-property-decorators';
import { required, minLength, alpha, sameAs } from 'vuelidate/lib/validators';
import axios from 'axios';
import { ValidationEvaluation } from 'vue/types/vue';
@Component({})
export default class UserForm extends Vue {
  @Getter('user/user') user!: User;
  @Getter('user/authHeader') authHeader!: string;
  @Mutation('user/setUser') setUser!: (user: User) => void;
  changeUserDialog = false;
  @Validate({ required, alpha })
  firstname = '';
  @Validate({ required, alpha })
  lastname = '';
  @Validate({ minLength: minLength(8) })
  password = '';
  @Validate({ sameAs: sameAs('password') })
  passwordRepeat = '';

  beforeMount() {
    this.updateUi();
  }

  updateUi() {
    this.firstname = this.user.firstname;
    this.lastname = this.user.lastname;
    this.password = '';
    this.passwordRepeat = '';
  }

  getErrors(fieldVal: ValidationEvaluation) {
    const errors: string[] = [];
    if (!fieldVal.$dirty) {
      return errors;
    }
    if (fieldVal.required == false) {
      errors.push('Field is required!');
    }
    if (fieldVal.minLength == false) {
      errors.push('New password has to be at least 8 characters long!');
    }
    if (fieldVal.alpha == false) {
      errors.push('Field must only contain alphabet characters!');
    }
    if (fieldVal.sameAs === false) {
      errors.push('Passwords must match!');
    }
    return errors;
  }
  submit() {
    this.changeUserDialog = false;
    this.$v.$touch();
    if (this.$v.$error) {
      this.updateUi();
      return;
    }
    axios
      .put(
        `users/${this.user.id}`,
        {
          firstname: this.firstname,
          lastname: this.lastname,
          password: this.password === '' ? undefined : this.password
        },
        {
          headers: { Authorization: this.authHeader }
        }
      )
      .then(res => {
        this.setUser(res.data.data);
        this.$emit('showSnackbar', 'Account successfully updated');
      })
      .catch(error => {
        this.$emit('showSnackbar', 'Server error');
        console.log(error);
      });
    this.password = '';
    this.passwordRepeat = '';
  }
  openDialog() {
    this.$v.$touch();
    if (this.$v.$error) {
      return;
    }
    this.changeUserDialog = true;
  }
}
</script>

<style
  lang="scss"
  scoped
></style>
