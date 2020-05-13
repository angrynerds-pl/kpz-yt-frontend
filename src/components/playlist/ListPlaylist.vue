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
        <v-list-item-title>{{ playlistItem.ytID }}</v-list-item-title>
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
import { Observable } from 'rxjs';
@Component({})
export default class ListPlaylist extends Vue {
  @Getter('user/authHeader') authHeader!: string;
  @Getter('user/user') user!: User;
  @Validate({ required })
  playlistItemLink = '';
  addItemDialog = false;
  playlistId = -1;


  loading = false;
  alertInfo: string | false = false;


  playlist?: Playlist = undefined;
  playlistItems: PlaylistItem[] = [];
  componentKey = 0;

  beforeMount() {

    bus.$on('refreshPlaylistList', () => {
      this.updatePlaylistItems();
    });

    this.playlistId = parseInt(this.$route.params.id);
    
    this.updatePlaylistItems();
    
  }

  beforeUpdate() {

    // if(this.playlistId !== parseInt(this.$route.params.id))
    // {
    //   this.playlistId = parseInt(this.$route.params.id);
    //   this.updatePlaylistItems();
    // }
    //this.updatePlaylistItems();
    //const dwa = 2;
  }

  updatePlaylistItems() {

    
    axios
      .get(`playlists/${this.$route.params.id}`, {
        headers: { Authorization: this.authHeader }
      })
      .then(res => {
        this.playlist = res.data.data;
        if(this.playlist !== undefined)
        {
        this.$emit('setToolbarTitle', this.playlist.name);
        }
        else
        {
        this.$emit('setToolbarTitle', "<Unresolved name>");
        } 
            axios
            .get(`playlists/${this.$route.params.id}/playlist-items`, {
                headers: { Authorization: this.authHeader }
            })
            .then(res => {
                this.playlistItems = res.data.data;
                
                
      }).catch(error => {
          console.log(error);
      });



      //this.forceRerender();
      }).catch(error => {
          console.log(error);
          this.$emit('setToolbarTitle', "<Unresolved name>");
      });

    // if(this.playlist !== undefined)
    // {
    //   this.$emit('setToolbarTitle', this.playlist.name);
    // } 
    // else{
    //   this.$emit('setToolbarTitle', "<Unresolved name>");
    // }



    // this.playlistItems.forEach((element, index, array) => {
    //     axios.get(`youtubeapi/videos/${element.ytID}`, {
    //     //axios.get(`youtubeapi/videos/-MZqYDaz4CI`, {
    //       headers: { Authorization: this.authHeader }
    //     })
    //     .then(res => {

    //       const observable : Observable<any> = res.data;
    //       let ytResponse = { 
    //         snippet: {
    //           title : "defaultTitle",
    //         }
    //       };
    //       observable.subscribe(data => {
    //         ytResponse = data;
    //       });

    //         array[index].name = ytResponse.snippet.title;
    //         console.log(ytResponse.snippet);
          
    //     })
    //     .catch(error => {
    //       array[index].name = '<UnresolvSed name>';
    //       console.log(error);
    //     })

    //     //array[index].name = "<Unresolved name>";
    //   });




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

      let ytID = "";
      const regex = /^(https:\/\/www\.youtube\.com\/watch\?v=|https:\/\/youtu\.be\/)(?<param>.+)$/;

      
      const found = this.playlistItemLink.match(regex);
      if(found !== undefined && found !== null && found.groups !== undefined)
      {
        ytID = found.groups.param;
      }
      else
      {
        this.alertInfo = "Invalid link";
        this.loading = false;
        return;
      }

      console.log(found);
      ///playlists/{id}/playlist-items

      axios
      .post(`playlists/${this.playlistId}/playlist-items`,
              {
              ytID: ytID,
              playlist: { id: this.playlistId }
              },
              {
                headers: { Authorization: this.authHeader },
              })
      .then(res => {
        this.$emit('showSnackbar', 'Item added!');
        this.updatePlaylistItems();
        //bus.$emit('refreshPlaylists');
        //this.$router.push(`/app/playlists/${res.data.data.id}`);
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