<template>
  <div id="dissolution-resolution">
    <CompleteResolution />
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Vue, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { ActionBindingIF, CreateResolutionIF } from '@/interfaces'
import { CommonMixin } from '@/mixins'
import CompleteResolution from '@/components/Dissolution/CompleteResolution.vue'
import { RouteNames } from '@/enums'

@Component({
  components: {
    CompleteResolution
  }
})
export default class DissolutionResolution extends Mixins(CommonMixin) {
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
    if (this.getShowErrors && this.$route.name === RouteNames.DISSOLUTION_RESOLUTION) {
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
