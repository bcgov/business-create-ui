<template>
  <v-container id="step-buttons-container" class="list-item">

    <v-btn id="step-1-btn" large to="/define-company">
      <span>Define Your<br>Company</span>
    </v-btn>

    <v-btn id="step-5-btn" large to="/review-confirm">
      <span>Review<br>and Confirm</span>
    </v-btn>

  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'

@Component
export default class Stepper extends Vue {
  @Watch('$route', { immediate: true })
  private onRouteChange (): void {
    //
    // FUTURE: watch current route and configure current state accordingly
    // console.log('new route =', this.$route)
    //
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

#step-buttons-container {
  background: $BCgovInputBG;

  .v-btn + .v-btn {
    margin-left: 0.5rem;
  }
}
</style>
