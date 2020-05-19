<template>
  <v-footer
    fixed
    app
  >
    <v-row dense>
      <v-col
        :cols="8"
        :md="3"
        :order="1"
        :order-md="1"
      >
        <v-row dense>
          <v-col
            cols="auto"
            class="d-flex align-center"
          >
            <v-sheet
              :width="playerWidth"
              :min-height="playerHeight"
              :min-width="playerWidth"
              :height="playerHeight"
              color="grey"
              class="d-flex align-center justify-center mr-4"
              style="pointer-events:none;overflow:hidden;"
            >
              <div v-show="isItemSet">
                <div ref="youtubePlayer"></div>
              </div>
              <v-icon
                v-if="!isItemSet"
                :size="playerWidth / 2"
                dark
              >
                mdi-music
              </v-icon>
            </v-sheet>
            {{ item ? item.name : 'Pick a song' }}
            <v-icon
              large
              @click="redirect"
              class="ml-4"
            >
              mdi-play-box
            </v-icon>
          </v-col>
        </v-row>
      </v-col>
      <v-col
        :cols="12"
        :md="6"
        :order="3"
        :order-md="2"
      >
        <v-row dense>
          <v-col>
            <v-row dense>
              <v-col class="d-flex justify-center align-center">
                <v-btn
                  icon
                  class="mx-2"
                  @click="toggleShuffle"
                  :color="isShuffle ? 'error' : ''"
                >
                  <v-icon>mdi-shuffle</v-icon>
                </v-btn>
                <v-btn
                  icon
                  class="mx-2"
                  @click="prev"
                >
                  <v-icon>mdi-skip-backward</v-icon>
                </v-btn>
                <v-btn
                  outlined
                  icon
                  class="mx-2"
                  :large="$vuetify.breakpoint.mdAndUp"
                  @click="playToggle"
                >
                  <v-icon
                    v-if="playing"
                    :x-large="$vuetify.breakpoint.mdAndUp"
                  >
                    mdi-pause
                  </v-icon>
                  <v-icon
                    v-else
                    :x-large="$vuetify.breakpoint.mdAndUp"
                  >
                    mdi-play
                  </v-icon>
                </v-btn>
                <v-btn
                  icon
                  class="mx-2"
                  @click="next"
                >
                  <v-icon>
                    mdi-skip-forward
                  </v-icon>
                </v-btn>
                <v-btn
                  icon
                  class="mx-2"
                  @click="toggleRepeatMode"
                >
                  <v-icon
                    v-if="repeatMode != RepeatMode.ONE"
                    :color="repeatMode == RepeatMode.NONE ? '' : 'error'"
                  >
                    mdi-repeat
                  </v-icon>
                  <v-icon
                    color="error"
                    v-if="repeatMode == RepeatMode.ONE"
                  >
                    mdi-repeat-once
                  </v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col
                class="py-1 d-flex align-center justify-end"
                :cols="2"
              >
                {{ currentDuration | durationFilter }}
              </v-col>
              <v-col class="d-flex align-center">
                <v-slider
                  dense
                  :max="duration"
                  :value="currentDuration"
                  @input="seek"
                  hide-details
                  color="error"
                  track-color="error lighten-4"
                />
              </v-col>
              <v-col
                class="d-flex align-center justify-start"
                :cols="2"
              >
                {{ duration | durationFilter }}
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
      <v-col
        :cols="4"
        :md="3"
        :order="2"
        :order-md="3"
        class="d-flex align-center justify-end"
      >
        <v-row dense>
          <v-spacer />
          <v-col
            :cols="12"
            :lg="6"
          >
            <v-slider
              :value="isMuted ? 0 : volume"
              :prepend-icon="volumeIcon"
              hide-details
              :min="0"
              :max="100"
              @click:prepend="setMuted(!isMuted)"
              @input="setVolume"
              color="error"
              track-color="error lighten-4"
            ></v-slider>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import { Getter, Mutation } from 'vuex-class';
import YouTubePlayerC from 'youtube-player';
import { YouTubePlayer } from 'youtube-player/dist/types';
import { PlaylistItem } from '../../store/playlist';
import moment from 'moment';
import { RepeatMode } from '../../store/player';
import PlayerStates from 'youtube-player/dist/constants/PlayerStates';
@Component({
  filters: {
    durationFilter: (v: number) => {
      const d = moment.duration(v * 1000);
      let base = `${d.minutes()}:${d
        .seconds()
        .toString()
        .padStart(2, '0')}`;
      if (d.hours() > 0) {
        base = d.hours() + base.padStart(5, '0');
      }
      return base;
    }
  }
})
export default class Player extends Vue {
  RepeatMode = RepeatMode;
  @Getter('player/isShuffle') isShuffle!: boolean;
  @Getter('player/repeatMode') repeatMode!: boolean;
  @Getter('player/isItemSet') isItemSet!: boolean;
  @Getter('player/item') item!: PlaylistItem | null;
  @Mutation('player/toggleShuffle') toggleShuffle!: () => void;
  @Mutation('player/toggleRepeatMode') toggleRepeatMode!: () => void;
  @Getter('player/volume') volume!: number;
  @Getter('player/isMuted') isMuted!: boolean;
  @Mutation('player/setVolume') setVolume!: (v: number) => void;
  @Mutation('player/setMuted') setMuted!: (v: boolean) => void;
  @Mutation('player/next') next!: () => void;
  @Mutation('player/prev') prev!: () => void;

  player: YouTubePlayer | null = null;
  playingInterval = 0;

  public duration = 0;
  public currentDuration = 0;
  public playing = false;

  height = 120;
  get playerWidth() {
    return this.playerHeight;
  }
  get playerHeight() {
    return this.$vuetify.breakpoint.smAndDown
      ? this.height * 0.35
      : this.height * 0.8;
  }

  get volumeIcon() {
    switch (true) {
      case !this.isMuted && this.volume > 66:
        return 'mdi-volume-high';
      case !this.isMuted && this.volume > 20:
        return 'mdi-volume-medium';
      case !this.isMuted && this.volume > 0:
        return 'mdi-volume-low';
      default:
        return 'mdi-volume-mute';
    }
  }

  async mounted() {
    this.player = await YouTubePlayerC(
      this.$refs.youtubePlayer as HTMLElement,
      {
        playerVars: { autoplay: 0, controls: 0 }
      }
    );
    this.player.setSize(this.playerWidth, this.playerHeight);
    this.onVolumeChange(this.volume);
    this.onMuteChange(this.isMuted);
    this.player.on('stateChange', v => {
      this.playing = v.data == PlayerStates.PLAYING;
      if (v.data == PlayerStates.ENDED) {
        this.next();
      }
    });
  }

  async playToggle() {
    if (this.player && this.isItemSet) {
      if (this.playing) {
        await this.pause();
      } else {
        await this.play();
      }
    }
  }

  async redirect() {
    if (this.player && this.item) {
      this.pause();
      window.open(
        'https://youtu.be/' +
          this.item.ytID +
          '?t=' +
          Math.floor(this.currentDuration),
        '_blank'
      );
    }
  }

  async play() {
    if (this.player) {
      this.playingInterval = setInterval(this.playingIntervalFn, 500);
      await this.player.playVideo();
    }
  }
  async pause() {
    if (this.player) {
      await this.player.pauseVideo();
      clearInterval(this.playingInterval);
    }
  }

  async stop() {
    if (this.player) {
      this.player.stopVideo();
      clearInterval(this.playingInterval);
      this.$nextTick(() => {
        this.duration = 0;
        this.currentDuration = 0;
      });
    }
  }

  async playingIntervalFn() {
    if (this.player) this.currentDuration = await this.player.getCurrentTime();
  }

  @Watch('currentDuration')
  async seek(v: number) {
    if (this.player && Math.abs(v - this.currentDuration) > 1) {
      await this.player.seekTo(v, true);
      this.currentDuration = await this.player.getCurrentTime();
    }
  }

  @Watch('volume')
  onVolumeChange(v: number) {
    if (this.player) this.player.setVolume(v);
  }

  @Watch('isMuted')
  onMuteChange(v: boolean) {
    if (this.player)
      if (this.isMuted) this.player.mute();
      else this.player.unMute();
  }

  @Watch('item')
  async onItemChange(v: PlaylistItem) {
    this.stop();
    if (this.player && v) {
      await this.player.loadVideoById(v.ytID);
      this.play();
      const int = setInterval(async () => {
        if (this.player) {
          const duration = await this.player.getDuration();
          if (duration > 0) {
            clearInterval(int);
            this.duration = duration;
          }
        }
      }, 100);
    }
  }
}
</script>

<style
  lang="scss"
  scoped
></style>
