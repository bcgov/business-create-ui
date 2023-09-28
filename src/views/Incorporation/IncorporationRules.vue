<template>
  <div id="incorporation-rules">
    <UploadRules />
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-facing-decorator'
import { Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import { CreateRulesIF } from '@/interfaces'
import { CommonMixin } from '@/mixins'
import UploadRules from '@/components/Incorporation/UploadRules.vue'

import { RouteNames } from '@/enums'

@Component({
  components: {
    UploadRules
  }
})
export default class IncorporationRules extends Mixins(CommonMixin) {
  @Getter(useStore) getCreateRulesStep!: CreateRulesIF
  @Getter(useStore) getShowErrors!: boolean

  @Watch('$route')
  private async scrollToInvalidComponent (): Promise<void> {
    if (this.getShowErrors && this.$route.name === RouteNames.INCORPORATION_RULES) {
      // scroll to invalid components
      await this.$nextTick()
      const vid = this.getCreateRulesStep.validationDetail.validationItemDetails
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
