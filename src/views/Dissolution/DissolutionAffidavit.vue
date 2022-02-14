<template>
  <div id="dissolution-affidavit">
    <Affidavit />
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Vue, Watch } from 'vue-property-decorator'
import Affidavit from '@/components/Dissolution/Affidavit.vue'
import { RouteNames } from '@/enums'
import { CommonMixin } from '@/mixins'
import { Action, Getter } from 'vuex-class'
import { ActionBindingIF, UploadAffidavitIF } from '@/interfaces'

@Component({
  components: {
    Affidavit
  }
})
export default class DissolutionAffidavit extends Mixins(CommonMixin) {
  // Global getter
  @Getter getAffidavitStep!: UploadAffidavitIF
  @Getter getShowErrors!: boolean

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
    if (this.getShowErrors && this.$route.name === RouteNames.DISSOLUTION_AFFIDAVIT) {
      // Scroll to invalid components.
      await Vue.nextTick()
      const vid = this.getAffidavitStep.validationDetail.validationItemDetails
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
