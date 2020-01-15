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

    <sbc-header ref="sbcHeader" :brandLink="origin" :authURL="authApiUrl" />

    <main class="app-body">
      <entity-info />

      <v-container class="view-container pt-4">
        <v-row>
          <v-col cols="12" lg="9">
            <header>
              <h1>Incorporation Application</h1>
            </header>

            <stepper class="mt-10" />

            <router-view class="app-router-view mt-10" />
          </v-col>

          <v-col cols="12" lg="3" style="position: relative">
            <aside>
              <affix relative-element-selector=".app-router-view" :offset="{ top: 120, bottom: 40 }">
                <sbc-fee-summary
                  v-bind:filingData="[...filingData]"
                  v-bind:payURL="payApiUrl"
                  @total-fee="totalFee=$event"
                />
              </affix>
            </aside>
          </v-col>
        </v-row>
      </v-container>

      <actions />
    </main>

    <!-- FOR TESTING ONLY -->
    <pre>{{stateModel}}</pre>
    <pre>{{tombStoneModel}}</pre>

    <sbc-footer />
  </v-app>
</template>

<script lang="ts">
// Libraries
import { Component, Vue, Watch, Mixins } from 'vue-property-decorator'
import { Action, State } from 'vuex-class'

// Components
import SbcHeader from 'sbc-common-components/src/components/SbcHeader.vue'
import SbcFooter from 'sbc-common-components/src/components/SbcFooter.vue'
import SbcFeeSummary from 'sbc-common-components/src/components/SbcFeeSummary.vue'
import { EntityInfo, Stepper, Actions } from '@/components/common'

// Mixins
import { DateMixin } from '@/mixins'

// Interfaces
import { FilingDataIF, ActionBindingIF, CertifyStatementIF, StateModelIF, TombStoneIF } from '@/interfaces'

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
export default class App extends Mixins(DateMixin) {
  // Global state
  @State stateModel!: StateModelIF
  @State tombStoneModel!: TombStoneIF

  // Global actions
  @Action setCurrentStep!: ActionBindingIF

  private filingData: Array<FilingDataIF> = []
  private totalFee: number = 0
  private entityType: string = 'CP'

  @Action('setEntityType') setEntityType!: ActionBindingIF
  @Action('setCurrentDate') setCurrentDate!: ActionBindingIF
  @Action('setCertifyStatementResource') setCertifyStatementResource!: ActionBindingIF

  // Lifecycle event
  private created (): void {
    this.filingData.push({ filingTypeCode: FilingCodes.INCORPORATION_BC, entityType: EntityTypes.BCOMP })
    this.setEntityType(this.entityType)
    this.setCurrentDate(this.dateToUsableString(new Date()))
    this.setCertifyStatementResource(CertifyStatementResource.find(x => x.entityType === this.entityType))
  }

  /**
   * The origin URL.
   */
  private get origin (): string {
    const root = window.location.origin || ''
    const path = process.env.VUE_APP_PATH
    return `${root}/${path}`
  }

  /**
   * The Pay API URL.
   */
  private get payApiUrl (): string | null {
    return sessionStorage.getItem('PAY_API_URL')
  }

  /**
   * The Auth API URL.
   */
  private get authApiUrl (): string | null {
    return sessionStorage.getItem('AUTH_API_URL')
  }

  /**
   * Method called when $route property changes.
   */
  @Watch('$route', { immediate: true })
  private onRouteChanged (): void {
    this.setCurrentStep(this.$route.meta.step)
  }
}
</script>
