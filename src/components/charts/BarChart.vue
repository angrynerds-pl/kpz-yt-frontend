<script lang="ts">
import Vue from 'vue';
import { mixins, HorizontalBar } from 'vue-chartjs';
import { Component, Watch } from 'vue-property-decorator';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  extends: HorizontalBar,
  mixins: [mixins.reactiveProp],
  props: ['chartData', 'options']
})
export default class BarChart extends Vue {
  chartData!: ChartData;
  options!: ChartOptions;
  renderChart!: (data: ChartData, options: ChartOptions) => void;

  mounted() {
    this.renderChart(this.chartData, this.options);
  }

  @Watch('options', { deep: true })
  onOptionsChange() {
    this.renderChart(this.chartData, this.options);
  }
}
</script>
