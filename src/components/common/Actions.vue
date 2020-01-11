<template>
  <v-container id="action-buttons-container" class="list-item">

    <div class="buttons-left">
      <v-btn id="save-btn" large disabled>
        <span>Save</span>
      </v-btn>

      <v-btn id="save-resume-btn" large disabled>
        <span>Save and Resume Later</span>
      </v-btn>
    </div>

    <div class="buttons-right">
      <v-fade-transition hide-on-leave>
        <v-btn id="back-btn" large outlined to="/define-company" v-show="showBackBtn">
          <v-icon left>mdi-chevron-left</v-icon>
          <span>Back</span>
        </v-btn>
      </v-fade-transition>

      <v-fade-transition hide-on-leave>
        <v-btn id="review-confirm-btn" large color="primary" to="/review-confirm" v-show="showReviewConfirmBtn">
          <span>Review and Confirm</span>
          <v-icon right>mdi-chevron-right</v-icon>
        </v-btn>
      </v-fade-transition>

      <v-fade-transition hide-on-leave>
        <v-btn id="file-pay-btn" large disabled color="primary" v-show="showFilePayBtn">
          <span>File and Pay</span>
        </v-btn>
      </v-fade-transition>

      <v-btn id="cancels-btn" large disabled>
        <span>Cancel</span>
      </v-btn>
    </div>

  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'

@Component
export default class Actions extends Vue {
  private get showBackBtn (): boolean {
    return (this.$route.meta.step > 1)
  }

  private get showReviewConfirmBtn (): boolean {
    return (this.$route.meta.step < 2)
  }

  private get showFilePayBtn (): boolean {
    return (this.$route.meta.step === 2)
  }

  @Watch('$route', { immediate: true })
  private onRouteChange (): void {
    //
    // FUTURE: watch current route and configure buttons accordingly
    // console.log('new route =', this.$route)
    //
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

#action-buttons-container {
  background-color: $gray1;
  padding-top: 2rem;
  padding-bottom: 2rem;
  border-top: 1px solid $gray5;

  .buttons-left {
    width: 50%;
  }

  .buttons-right {
    margin-left: auto;
  }

  .v-btn + .v-btn {
    margin-left: 0.5rem;
  }
}
</style>
