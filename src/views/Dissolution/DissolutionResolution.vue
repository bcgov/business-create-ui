<template>
  <div id="dissolution-resolution">
    <CompleteResolution />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import { CreateResolutionIF } from '@/interfaces'
import { CommonMixin } from '@/mixins'
import CompleteResolution from '@/components/Dissolution/CompleteResolution.vue'
import { RouteNames } from '@/enums'

@Component({
  components: {
    CompleteResolution
  },
  mixins: [
    CommonMixin
  ]
})
export default class DissolutionResolution extends Vue {
  @Getter(useStore) getShowErrors!: boolean
  @Getter(useStore) getCreateResolutionStep!: CreateResolutionIF

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
