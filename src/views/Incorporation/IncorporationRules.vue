<template>
  <div id="incorporation-rules">
    <UploadRules />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import { CreateRulesIF } from '@/interfaces'
import { CommonMixin } from '@/mixins'
import UploadRules from '@/components/Incorporation/UploadRules.vue'

import { RouteNames } from '@/enums'

@Component({
  components: {
    UploadRules
  },
  mixins: [
    CommonMixin
  ]
})
export default class IncorporationRules extends Vue {
  @Getter(useStore) getShowErrors!: boolean
  @Getter(useStore) getCreateRulesStep!: CreateRulesIF

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
