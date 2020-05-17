<template>
  <div>
    <v-app-bar
      color="error"
      app
      dark
    >
      <v-app-bar-nav-icon @click="$emit('toggle-nav')"></v-app-bar-nav-icon>
      <v-toolbar-title>Dashboard</v-toolbar-title>
      <v-col class="text-right">
        <v-icon @click="reload()">mdi-refresh</v-icon>
      </v-col>
    </v-app-bar>

    <v-content>
      <v-container fluid>
        <v-row>
          <v-col
            :cols="12"
            :md="6"
          >
            <v-card>
              <v-card-title>Top 10 titles</v-card-title>
              <v-card-text>
                <bar-chart
                  :chartData="topTitlesDataMapped"
                  :options="chartOptions"
                  :style="topTitlesStyle"
                />
                <v-overlay
                  :value="!topTitlesIsLoaded"
                  :absolute="true"
                >
                  <div class="text-center">
                    <v-progress-circular
                      indeterminate
                      color="error"
                    ></v-progress-circular>
                  </div>
                </v-overlay>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            :cols="12"
            :md="6"
          >
            <v-card>
              <v-card-title>Top 10 playlists</v-card-title>
              <v-card-text>
                <bar-chart
                  :chartData="topPlaylistsDataMapped"
                  :options="chartOptions"
                  :style="topPlaylistsStyle"
                />
                <v-overlay
                  :value="!topPlaylistsIsLoaded"
                  :absolute="true"
                >
                  <div class="text-center">
                    <v-progress-circular
                      indeterminate
                      color="error"
                    ></v-progress-circular>
                  </div>
                </v-overlay>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import BarChart from '@/components/charts/BarChart.vue';
import Axios from 'axios';
import { ChartData, ChartOptions } from 'chart.js';
import { Getter } from 'vuex-class';
import { User } from '../store/user/index';

@Component({
  components: { BarChart }
})
export default class Dashboard extends Vue {
  @Getter('authHeader', { namespace: 'user' }) authHeader!: string;
  @Getter('user', { namespace: 'user' }) loggedUser!: User;

  topTitlesIsLoaded = false;
  topTitlesData: number[] = [];
  topTitlesLabels: string[] = [];

  topPlaylistsIsLoaded = false;
  topPlaylistsData: number[] = [];
  topPlaylistsLabels: string[] = [];

  async reload() {
    this.topTitlesIsLoaded = false;
    this.topTitlesData = [];
    this.topTitlesLabels = [];

    this.topPlaylistsIsLoaded = false;
    this.topPlaylistsData = [];
    this.topPlaylistsLabels = [];

    this.fetchTopTitles();
    this.fetchTopPlaylists();
  }

  get chartOptions(): ChartOptions {
    return {
      responsive: true,
      legend: {
        display: false
      },
      maintainAspectRatio: false,
      scales: {
        yAxes: [{ ticks: { reverse: true, beginAtZero: true } }],
        xAxes: [{}]
      },
      responsiveAnimationDuration: 500
    };
  }

  get topTitlesDataMapped(): ChartData {
    return {
      labels: this.topTitlesLabels,
      datasets: [
        {
          label: 'Playback count',
          backgroundColor: '#f87979',
          data: this.topTitlesData,
          barThickness: 20,
          maxBarThickness: 20
        }
      ]
    };
  }

  get topTitlesStyle() {
    // 40px in height for each label
    const newTitlesHeightPx = 40 * this.topTitlesLabels.length;
    return {
      position: 'relative',
      height: `${newTitlesHeightPx}px`
    };
  }

  get topPlaylistsDataMapped(): ChartData {
    return {
      labels: this.topPlaylistsLabels,
      datasets: [
        {
          label: 'Playback count',
          backgroundColor: '#f87979',
          data: this.topPlaylistsData,
          barThickness: 20,
          maxBarThickness: 20
        }
      ]
    };
  }

  get topPlaylistsStyle() {
    // 40px in height for each label
    const newPlaylistsHeightPx = 40 * this.topPlaylistsLabels.length;
    return {
      position: 'relative',
      height: `${newPlaylistsHeightPx}px`
    };
  }

  async fetchTopTitles() {
    const userId = this.loggedUser.id;
    const limit = 10;
    const url = `/users/${userId}/top-titles/${limit}`;
    const resp = await Axios.get(url, {
      headers: {
        Authorization: this.authHeader
      }
    });

    const topTitles = resp.data.data;

    const newTopTitleData = [];
    const newTopTitleLabels = [];
    for (const element of topTitles) {
      newTopTitleData.push(element.playbackCount);
      newTopTitleLabels.push(element.title);
    }

    this.topTitlesData = newTopTitleData;
    this.topTitlesLabels = newTopTitleLabels;
    this.topTitlesIsLoaded = true;
  }

  async fetchTopPlaylists() {
    this.topPlaylistsIsLoaded = false;
    this.topPlaylistsData = [];
    this.topPlaylistsLabels = [];

    const userId = this.loggedUser.id;
    const limit = 10;
    const url = `/users/${userId}/top-playlists/${limit}`;
    const resp = await Axios.get(url, {
      headers: {
        Authorization: this.authHeader
      }
    });

    const topPlaylists = resp.data.data;

    const newTopPlaylistData = [];
    const newTopPlaylistLabels = [];
    for (const element of topPlaylists) {
      newTopPlaylistData.push(element.playbackCount);
      newTopPlaylistLabels.push(element.name);
    }

    this.topPlaylistsData = newTopPlaylistData;
    this.topPlaylistsLabels = newTopPlaylistLabels;
    this.topPlaylistsIsLoaded = true;
  }

  mounted() {
    this.reload();
  }
}
</script>

<style
  lang="scss"
  scoped
></style>
