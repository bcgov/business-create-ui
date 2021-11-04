<template>
  <div>
    <UploadResolution class="mt-4" />
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Mixins, Vue, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'

// Interfaces
import { ActionBindingIF, CreateResolutionIF } from '@/interfaces'

// Mixins
import { CommonMixin } from '@/mixins'

// Components
import { UploadResolution } from '@/components/CreateResolution'

import { RouteNames } from '@/enums'

@Component({
  components: {
    UploadResolution
  }
})
export default class CreateResolution extends Mixins(CommonMixin) {
  @Getter getShowErrors!: boolean
  @Getter getCreateResolutionStep!: CreateResolutionIF

  @Action setIgnoreChanges!: ActionBindingIF

  /** Called when component is created. */
  private created (): void {
    // ignore data changes until page has loaded
    this.setIgnoreChanges(true)
    Vue.nextTick(() => {
      this.setIgnoreChanges(false)
    })
  }

  @Watch('$route')
  private async scrollToInvalidComponent (): Promise<void> {
    if (this.getShowErrors && this.$route.name === RouteNames.CREATE_RESOLUTION) {
      // Scroll to invalid components.
      await Vue.nextTick()
      const vid = this.getCreateResolutionStep.validationDetail.validationItemDetails
      const validFlags = this.buildValidFlags(vid)
      const componentIds = this.buildElementIds(vid)
      await this.validateAndScroll(
        validFlags,
        componentIds
      )
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';
</style>
