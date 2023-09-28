<template>
  <div id="dissolution-affidavit">
    <Affidavit />
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-facing-decorator'
import Affidavit from '@/components/Dissolution/CompleteAffidavit.vue'
import { RouteNames } from '@/enums'
import { CommonMixin } from '@/mixins'
import { Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import { UploadAffidavitIF } from '@/interfaces'

@Component({
  components: {
    Affidavit
  }
})
export default class DissolutionAffidavit extends Mixins(CommonMixin) {
  // Global getter
  @Getter(useStore) getAffidavitStep!: UploadAffidavitIF
  @Getter(useStore) getShowErrors!: boolean

  @Watch('$route')
  private async scrollToInvalidComponent (): Promise<void> {
    if (this.getShowErrors && this.$route.name === RouteNames.DISSOLUTION_AFFIDAVIT) {
      // Scroll to invalid components.
      await this.$nextTick()
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
