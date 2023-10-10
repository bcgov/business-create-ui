<template>
  <div id="dissolution-resolution">
    <CompleteResolution />
  </div>
</template>

<script lang="ts">
import { Component, mixins, Watch } from 'vue-facing-decorator'
import { Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import { CreateResolutionIF } from '@/interfaces'
import { CommonMixin } from '@/mixins'
import CompleteResolution from '@/components/Dissolution/CompleteResolution.vue'
import { RouteNames } from '@/enums'

@Component({
  components: {
    CompleteResolution
  }
})
export default class DissolutionResolution extends mixins(CommonMixin) {
  @Getter(useStore) getCreateResolutionStep!: CreateResolutionIF
  @Getter(useStore) getShowErrors!: boolean

  @Watch('$route')
  private async scrollToInvalidComponent (): Promise<void> {
    if (this.getShowErrors && this.$route.name === RouteNames.DISSOLUTION_RESOLUTION) {
      // scroll to invalid components
      await this.$nextTick()
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
