<template>
  <div>
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'App'
})
export default class AppRoot extends Vue {}
</script>
