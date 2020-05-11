<template>
  <div>
    <v-app-bar
      color="error"
      app
      dark
    >
      <v-app-bar-nav-icon @click="$emit('toggle-nav')"></v-app-bar-nav-icon>
      <v-toolbar-title>Dashboard</v-toolbar-title>
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
                />
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

  topTitlesData: number[] = [];
  topTitlesLabels: string[] = [];

  get chartOptions(): ChartOptions {
    return {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        yAxes: [{ ticks: { beginAtZero: true } }],
        xAxes: [{}]
      }
    };
  }

  get topTitlesDataMapped(): ChartData {
    return {
      labels: this.topTitlesLabels,
      datasets: [
        {
          label: 'Playback count',
          backgroundColor: '#f87979',
          data: this.topTitlesData
        }
      ]
    };
  }

  async fetchStats() {
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
  }

  mounted() {
    this.fetchStats();
  }
}
</script>

<style
  lang="scss"
  scoped
></style>
