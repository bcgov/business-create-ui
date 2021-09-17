<template>
  <div id="create-rules">
    <UploadRules class="mt-4" />
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Mixins, Vue, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'

// Interfaces
import { ActionBindingIF, CreateRulesIF } from '@/interfaces'

// Mixins
import { CommonMixin } from '@/mixins'

// Components
import { UploadRules } from '@/components/CreateRules'

import { RouteNames } from '@/enums'

@Component({
  components: {
    UploadRules
  }
})
export default class CreateRules extends Mixins(CommonMixin) {
  @Getter getShowErrors!: boolean
  @Getter getCreateRulesStep!: CreateRulesIF

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
    if (this.getShowErrors && this.$route.name === RouteNames.CREATE_RULES) {
      // Scroll to invalid components.
      await Vue.nextTick()
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

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';
</style>
