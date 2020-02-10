<template>
  <v-app class="app-container" id="app">
    <!-- FUTURE: dialogs go here -->

    <!-- Initial Page Load Transition -->
    <transition name="fade">
      <div class="loading-container fade-out">
        <div class="loading__content">
          <v-progress-circular color="primary" size="50" indeterminate />
          <div class="loading-msg">Loading...</div>
        </div>
      </div>
    </transition>

    <sbc-header ref="sbcHeader" />

    <main class="app-body">
      <entity-info />

      <v-container class="view-container pt-4">
        <v-row>
          <v-col cols="12" lg="9">
            <header>
              <h1>Incorporation Application</h1>
            </header>

            <stepper class="mt-10" />

            <router-view :key="isDraft"/>
          </v-col>

          <v-col cols="12" lg="3" style="position: relative">
            <aside>
              <affix relative-element-selector=".col-lg-9" :offset="{ top: 86, bottom: 12 }">
                <sbc-fee-summary
                  v-bind:filingData="[...filingData]"
                  v-bind:payURL="payApiUrl"
                />
              </affix>
            </aside>
          </v-col>
        </v-row>
      </v-container>

      <actions />
    </main>

    <sbc-footer />
  </v-app>
</template>

<script lang="ts">
// Libraries
import { Component, Watch, Mixins } from 'vue-property-decorator'
import { Action, State } from 'vuex-class'

// Components
import SbcHeader from 'sbc-common-components/src/components/SbcHeader.vue'
import SbcFooter from 'sbc-common-components/src/components/SbcFooter.vue'
import SbcFeeSummary from 'sbc-common-components/src/components/SbcFeeSummary.vue'
import { EntityInfo, Stepper, Actions } from '@/components/common'

// Mixins
import { DateMixin, FilingTemplateMixin, LegalApiMixin } from '@/mixins'

// Interfaces
import { FilingDataIF, ActionBindingIF, StateModelIF } from '@/interfaces'

import { CertifyStatementResource } from '@/resources'

// Enums
import { EntityTypes, FilingCodes } from '@/enums'

@Component({
  components: {
    SbcHeader,
    SbcFooter,
    SbcFeeSummary,
    EntityInfo,
    Stepper,
    Actions
  }
})
export default class App extends Mixins(DateMixin, FilingTemplateMixin, LegalApiMixin) {
  // Global state
  @State stateModel!: StateModelIF

  // Global actions
  @Action setCurrentStep!: ActionBindingIF
  @Action setCurrentDate!: ActionBindingIF
  @Action setCertifyStatementResource!: ActionBindingIF

  // Local Properties
  private filingData: Array<FilingDataIF> = []
  private isDraft: boolean = false

  private async created (): Promise<any> {
    // Mock the nrNumber and Data
    await this.setNameRequestState({ nrNumber: 'NR7654446', entityType: 'BC', filingId: null })

    this.setCurrentDate(this.dateToUsableString(new Date()))
    try {
      // Retrieve draft filing if it exists for the nrNumber specified
      const draft = await this.fetchDraft()

      // Parse the draft data into the ui if it exists
      draft && await this.parseDraft(draft)

      // Inform the router view we are resuming a draft and to update ui
      this.isDraft = true
    } catch (e) {
      // TODO: Catch a flag from the api, if there is an error to be handled.
    }
  }

  /**
   * The Pay API URL.
   */
  private get payApiUrl (): string | null {
    return sessionStorage.getItem('PAY_API_URL')
  }

  /**
   * Method called when $route property changes.
   */
  @Watch('$route', { immediate: true })
  private onRouteChanged (): void {
    this.setCurrentStep(this.$route.meta.step)
  }

  @Watch('stateModel.nameRequest.entityType')
  private onEntityTypeChanged (val: string | null) : void {
    switch (val) {
      case EntityTypes.BCOMP:
        this.filingData.push({ filingTypeCode: FilingCodes.INCORPORATION_BC, entityType: EntityTypes.BCOMP })
        break
      case EntityTypes.COOP:
        this.filingData.push({ filingTypeCode: FilingCodes.INCORPORATION_CP, entityType: EntityTypes.COOP })
        break
      default:
        this.filingData = []
    }

    this.setCertifyStatementResource(val ? CertifyStatementResource
      .find(x => x.entityType === val) : null)
  }

  // FOR FUTURE USE TO SUPPORT EXIT IN ERROR DIALOGS
  private onClickExit (): void {
    (this.$refs.form as Vue & { logout: () => void }).logout()
  }
}
</script>

<style lang="scss" scoped>
</style>
