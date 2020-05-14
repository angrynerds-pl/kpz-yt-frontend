<template>
  <div>
    <v-list-item
      link
      v-for="playlistItem in playlistItems"
      :key="playlistItem.id"
      @click="itemPlayClicked(`${playlistItem.id}`)"
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

        <div class="flex" >
        <v-btn class="mr-4"
          icon
          small
          @click.stop="showChangePlaylistDialog(`${playlistItem.id}`)"
        > <v-icon color="grey lighten-1">mdi-content-duplicate</v-icon>
        </v-btn>

        <v-btn
          icon
          small
          @click.stop="itemDeleteClicked(`${playlistItem.id}`)"
        >
          <v-icon color="grey lighten-1">mdi-delete</v-icon>
        </v-btn>
        </div>

        
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
              prepend-icon="mdi-link-variant-plus"
              v-model="playlistItemLink"
              :error-messages="this.getErrors($v.playlistItemLink)"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="white"
            @click.close="addItemDialog=false"
            :loading="loading"
          >
            Close
          </v-btn>
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

    <v-dialog
      v-model="changePlaylistDialog"
      max-width="500px"
    >
      <v-card>
        <v-card-title>
          Choose playlist
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
          <v-select
              label="Target playlist"
              :items="options"
              item-text="name"
              item-value="id"
              v-model="selected"
              prepend-icon="mdi-music-box-multiple-outline"
              :options="options"
            />
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="white"
            @click.close="changePlaylistDialog=false"
            :loading="loading"
          >
            Close
          </v-btn>
          <v-spacer />
          <v-btn
            color="white"
            @click="copyToPlaylist"
            :loading="loading"
          >
            Copy
          </v-btn>
          <v-btn
            color="error"
            @click="changePlaylist"
            :loading="loading"
          >
            Move
          </v-btn>

        </v-card-actions>
      </v-card>

    </v-dialog>

    
    <v-list-item
      link
      dense
      @click="openItemAddDialog"
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
import { Getter, Mutation } from 'vuex-class';
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
  @Mutation('player/setPlayData') setPlayData!: (payload: {
    playlistItems: PlaylistItem[];
    index: number | null;
  }) => void;
  
  @Validate({ required })
  playlistItemLink = '';
  addItemDialog = false;
  playlistId = -1;


  loading = false;
  alertInfo: string | false = false;


  changePlaylistDialog = false;
  selected = 0;
  options: Playlist[] = [];
  playlistItemToMove = 0;


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

  openItemAddDialog()
  {
    this.alertInfo = false;
    this.addItemDialog=true;
  }

  copyToPlaylist()
  {
    if(this.selected == 0) 
    {
      this.alertInfo = "Field is required";
      return;
    } 
    else 
    {
      this.alertInfo = false;
    }
    this.loading = true;

    axios
      .get(`playlist-items/${this.playlistItemToMove}`,
              {
                headers: { Authorization: this.authHeader },
              })
      .then(res => {

        const playlistItemToCopy : PlaylistItem = res.data.data;

        axios
        .post(`playlists/${this.selected}/playlist-items`,
              {
                ytID: playlistItemToCopy.ytID,
                playlist: {
                  id: this.selected,
                }
              },
              {
                headers: { Authorization: this.authHeader },
              })
        .then(res => {
          this.changePlaylistDialog = false;

          this.$emit('showSnackbar', 'Item copied!');
          bus.$emit('refreshPlaylistList');
        })
        .catch (error => {
          this.alertInfo = "Server error";
          console.log(error);

        });
        
        
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

  changePlaylist()
  {

    if(this.selected == 0) 
    {
      this.alertInfo = "Field is required";
      return;
    } 
    else 
    {
      this.alertInfo = false;
    }
    this.loading = true;


    axios
      .put(`playlist-items/${this.playlistItemToMove}`,
              {
                playlist: {
                  id: this.selected,
                } 
              },
              {
                headers: { Authorization: this.authHeader },
              })
      .then(res => {
        
        this.changePlaylistDialog = false;
        this.$emit('showSnackbar', 'Item moved!');
        
        
        bus.$emit('refreshPlaylistList');
        //this.$router.push(`/app/playlists/${res.data.data.id}`);
      })
      .catch(error => {
        this.alertInfo = "Server error";
        console.error(error);
      })
      .finally(() => {
        this.loading = false;
      });


    //TODO update/change playlist in itemplaylist
  }



  showChangePlaylistDialog(playlistItemId : number)
  {
    axios
      .get(`users/${this.user.id}/playlists`, {
        headers: { Authorization: this.authHeader }
      })
      .then(res => {
        this.options = res.data.data;

        this.playlistItemToMove = playlistItemId;
        this.changePlaylistDialog=!this.changePlaylistDialog;
      }).catch(error => {
        this.$emit('showSnackbar', "Server Error");
        console.log(error);
      });
  }

  itemDeleteClicked(itemId : number)
  {
    axios.delete(`/playlist-items/${itemId}`, {
        headers: { Authorization: this.authHeader }
      })
    .then(res => {
      this.$emit('showSnackbar', "Item deleted");
      this.updatePlaylistItems();
    })
    .catch(error => {
      this.$emit('showSnackbar', "Server error");
      console.log(error);
    })
  }


  itemPlayClicked(itemId : number)
  {
    const payload = {
      playlistItems: this.playlistItems,
      index: 0,
    }

    payload.index = this.playlistItems.findIndex(value => {
      if(value.id == itemId)
        return true;
      else
        return false;
    });

    this.setPlayData(payload);

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


      }).catch(error => {
          console.log(error);
          this.$emit('setToolbarTitle', "<Unresolved name>");
      });




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



  submit() {                    
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
        this.addItemDialog = false;
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