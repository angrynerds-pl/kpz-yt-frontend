<template>
  <div>
    <v-list-item
      link
      v-for="playlistItem in playlistItems"
      :key="playlistItem.id"
    >
      <v-list-item-avatar
        color="grey lighten-5"
        tile
      >
        <v-icon>mdi-playlist-music</v-icon>
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title>{{ playlistItem.name }}</v-list-item-title>
      </v-list-item-content>
      <v-list-item-action>
        <!-- TODO: click -->
        <v-btn
          icon
          small
          @click.stop
        >
          <v-icon color="grey lighten-1">mdi-play</v-icon>
        </v-btn>
      </v-list-item-action>
    </v-list-item>

    <v-dialog
      v-model="addItemDialog"
      max-width="500px"
    >
      <v-card>
        <v-card-title>
          Add item
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
              label="Link"
              prepend-icon="mdi-pencil"
              v-model="playlistItemLink"
              :error-messages="this.getErrors($v.playlistItemLink)"
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
            Add
          </v-btn>
        </v-card-actions>
      </v-card>

    </v-dialog>

    
    <v-list-item
      link
      dense
      @click="addItemDialog=!addItemDialog"
    >
      <v-list-item-avatar>
        <v-icon>mdi-plus</v-icon>
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title>Add item</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import bus from '../../main';
import { Component } from 'vue-property-decorator';
import { Validate } from 'vuelidate-property-decorators';
import { Getter } from 'vuex-class';
import { Playlist, PlaylistItem } from '@/store/playlist';
import { User } from '@/store/user';
import { ValidationEvaluation } from 'vue/types/vue';
import { required } from 'vuelidate/lib/validators';
import axios from 'axios';
import { integer } from 'vuelidate/lib/validators';
@Component({})
export default class ListPlaylist extends Vue {
  @Getter('user/authHeader') authHeader!: string;
  @Getter('user/user') user!: User;
  @Validate({ required })
  playlistItemLink = '';


  loading = false;
  alertInfo: string | false = false;


  playlist?: Playlist = undefined;
  playlistItems: PlaylistItem[] = [];
  componentKey = 0;

  beforeMount() {

    bus.$on('refreshPlaylistList', () => {
      this.forceRerender();
    });
    
    this.updatePlaylistItems();
    
  }

  beforeUpdate() {
    this.updatePlaylistItems();
  }

  updatePlaylistItems() {
    axios
      .get(`playlists/${this.$route.params.id}`, {
        headers: { Authorization: this.authHeader }
      })
      .then(res => {
        this.playlist = res.data.data;
            axios
            .get(`playlists/${this.$route.params.id}/playlist-items`, {
                headers: { Authorization: this.authHeader }
            })
            .then(res => {
                this.playlistItems = res.data.data;
                
      }).catch(error => {
          console.log(error);
      });
      }).catch(error => {
          console.log(error);
      });

      this.playlistItems.forEach(element => {
        // axios.get(`youtubeapi/videos/${element.ytID}`, {
        //   headers: { Authorization: this.authHeader }
        // })
        // .then(res => {
        //   const snippet = res.data.data;
        //   element.name = snippet.title;
        // })
        // .catch(error => {
        //   element.name = '<Unresolved name>';
        //   console.log(error);
        // })

        //element.name = "<Unresolved name>";
      });

    if(this.playlist !== undefined)
    {
      this.$emit('setToolbarTitle', this.playlist.name);
    } 
    else{
      this.$emit('setToolbarTitle', "");
    }
  }

  forceRerender() {
    this.componentKey += 1;
  }



  submit() {                    //TODO change submit method, reset form after close
    this.alertInfo = false;
    this.$v.$touch();
    if (this.$v.$error) {
      return;
    }
    this.loading = true;
      axios
      .post('/playlists/xd',
              {
              name: this.playlistItemLink,
              user: { id: this.user.id }
              },
              {
                headers: { Authorization: this.authHeader },
              })
      .then(res => {
        this.$emit('showSnackbar', 'Playlist created!');
        bus.$emit('refreshPlaylists');
        this.$router.push(`/app/playlists/${res.data.data.id}`);
      })
      .catch(error => {
        this.alertInfo = "Server error";
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
