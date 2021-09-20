<template>
  <div id="create-memorandum">
    <UploadMemorandum class="mt-4" />
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Mixins, Vue, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'

// Interfaces
import { ActionBindingIF, CreateMemorandumIF } from '@/interfaces'

// Mixins
import { CommonMixin } from '@/mixins'

// Components
import { UploadMemorandum } from '@/components/CreateMemorandum'

import { RouteNames } from '@/enums'

@Component({
  components: {
    UploadMemorandum
  }
})
export default class CreateMemorandum extends Mixins(CommonMixin) {
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
    if (this.getShowErrors && this.$route.name === RouteNames.CREATE_MEMORANDUM) {
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
