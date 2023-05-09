<template>
  <div id="incorporation-memorandum">
    <UploadMemorandum />
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import { Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import { CreateMemorandumIF } from '@/interfaces'
import { CommonMixin } from '@/mixins'
import UploadMemorandum from '@/components/Incorporation/UploadMemorandum.vue'
import { RouteNames } from '@/enums'

@Component({
  components: {
    UploadMemorandum
  }
})
export default class IncorporationMemorandum extends Mixins(CommonMixin) {
  @Getter(useStore) getCreateMemorandumStep!: CreateMemorandumIF
  @Getter(useStore) getShowErrors!: boolean

  @Watch('$route')
  private async scrollToInvalidComponent (): Promise<void> {
    if (this.getShowErrors && this.$route.name === RouteNames.INCORPORATION_MEMORANDUM) {
      // scroll to invalid components
      await this.$nextTick()
      const vid = this.getCreateMemorandumStep.validationDetail.validationItemDetails
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
