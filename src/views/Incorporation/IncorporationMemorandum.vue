<template>
  <div id="incorporation-memorandum">
    <UploadMemorandum />
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Vue, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { ActionBindingIF, CreateMemorandumIF } from '@/interfaces'
import { CommonMixin } from '@/mixins'
import UploadMemorandum from '@/components/Incorporation/UploadMemorandum.vue'
import { RouteNames } from '@/enums'

@Component({
  components: {
    UploadMemorandum
  }
})
export default class IncorporationMemorandum extends Mixins(CommonMixin) {
  @Getter getShowErrors!: boolean
  @Getter getCreateMemorandumStep!: CreateMemorandumIF

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
    if (this.getShowErrors && this.$route.name === RouteNames.INCORPORATION_MEMORANDUM) {
      // Scroll to invalid components.
      await Vue.nextTick()
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

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';
</style>
