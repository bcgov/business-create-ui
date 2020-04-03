<template>
  <v-app class="app-container" id="app">
    <!-- Dialogs -->
    <NameRequestInvalidErrorDialog
      :dialog="nameRequestInvalidErrorDialog"
      @okay="nrOkay()"
      @redirect="redirectToDashboard()"
      :type="nameRequestInvalidType"
      attach="#app"
    />

    <AccountAuthorizationDialog
      :dialog="accountAuthorizationErrorDialog"
      @exit="redirectToDashboard()"
      @retry="evaluateNRPreconditions()"
      attach="#app"
    />

    <!-- Initial Page Load Transition -->
    <transition name="fade">
      <div class="loading-container" v-show="!haveData">
        <div class="loading__content">
          <v-progress-circular color="primary" size="50" indeterminate />
          <div class="loading-msg">Loading</div>
        </div>
      </div>
    </transition>

    <sbc-header />

    <div class="app-body">
      <main v-if="!isErrorDialog">
        <entity-info />

        <v-container class="view-container pt-4">
          <v-row>
            <v-col cols="12" lg="9">
              <header>
                <h1>Incorporation Application</h1>
              </header>

              <stepper class="mt-10" />

              <router-view />
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

        <actions :key="$route.path"/>
      </main>
    </div>

    <sbc-footer />
  </v-app>
</template>

<script lang="ts">
// Libraries
import { Component, Vue, Watch, Mixins } from 'vue-property-decorator'
import { Action, State } from 'vuex-class'
import axios from '@/utils/axios-auth'
import TokenService from 'sbc-common-components/src/services/token.services'

// Components
import SbcHeader from 'sbc-common-components/src/components/SbcHeader.vue'
import SbcFooter from 'sbc-common-components/src/components/SbcFooter.vue'
import SbcFeeSummary from 'sbc-common-components/src/components/SbcFeeSummary.vue'
import { EntityInfo, Stepper, Actions } from '@/components/common'

// Dialogs
import { AccountAuthorizationDialog, NameRequestInvalidErrorDialog } from '@/components/dialogs'

// Mixins
import { DateMixin, FilingTemplateMixin, LegalApiMixin, NameRequestMixin } from '@/mixins'

// Interfaces
import { FilingDataIF, ActionBindingIF, StateModelIF, IncorporationFilingIF } from '@/interfaces'

import { CertifyStatementResource } from '@/resources'

// Enums
import { EntityTypes, FilingCodes, NameRequestStates } from '@/enums'

@Component({
  components: {
    SbcHeader,
    SbcFooter,
    SbcFeeSummary,
    EntityInfo,
    Stepper,
    Actions,
    NameRequestInvalidErrorDialog,
    AccountAuthorizationDialog
  }
})
export default class App extends Mixins(DateMixin, FilingTemplateMixin, LegalApiMixin, NameRequestMixin) {
  // Global state
  @State stateModel!: StateModelIF

  // Global actions
  @Action setCurrentStep!: ActionBindingIF
  @Action setCurrentDate!: ActionBindingIF
  @Action setCertifyStatementResource!: ActionBindingIF
  @Action setNameRequestState!: ActionBindingIF
  @Action setAuthRoles: ActionBindingIF

  // Local Properties
  private filingData: Array<FilingDataIF> = []
  private accountAuthorizationErrorDialog: boolean = false
  private nameRequestInvalidErrorDialog: boolean = false
  private nameRequestInvalidType: string = ''
  private haveData: boolean = false

  /**
   * Instance of the token refresh service.
   * Needs to exist for lifetime of app.
   */
  private tokenService: TokenService = null

  /** The URL of the Pay API. */
  private get payApiUrl (): string {
    return sessionStorage.getItem('PAY_API_URL')
  }

  /** The Name Request Number from the route. */
  private get queryNrNumber (): string {
    return this.$route.query.nrNumber as string
  }

  /** True if route is Signin. */
  private get isSigninRoute (): boolean {
    return Boolean(this.$route.name === 'signin')
  }

  /** True if route is Signout. */
  private get isSignoutRoute (): boolean {
    return Boolean(this.$route.name === 'signout')
  }

  /** True if an error dialog is displayed. */
  private get isErrorDialog (): boolean {
    return (this.accountAuthorizationErrorDialog || this.nameRequestInvalidErrorDialog)
  }

  /** True if Jest is running the code. */
  private get isJestRunning (): boolean {
    return (process.env.JEST_WORKER_ID !== undefined)
  }

  /** Starts token service to refresh KC token periodically. */
  private async startTokenService (): Promise<void> {
    // only initialize once
    // don't start during Jest tests as it messes up the test JWT
    if (this.tokenService || this.isJestRunning) return Promise.resolve()

    console.info('Starting token refresh service...') // eslint-disable-line no-console
    this.tokenService = new TokenService()
    await this.tokenService.init()
    this.tokenService.scheduleRefreshTimer()
  }

  /**
   * Fetches data required for NR and draft filing.
   */
  private async fetchData (): Promise<void> {
    // only fetch data once
    if (this.haveData) return Promise.resolve()

    // Evaluate name request pre-conditions
    const nameRequest = await this.evaluateNRPreconditions()
    if (nameRequest && nameRequest.nrNum && nameRequest.isConsumable) {
      this.setNameRequestState(this.generateNameRequestState(nameRequest, null))
      this.setCurrentDate(this.dateToUsableString(new Date()))
      try {
        // Retrieve draft filing if it exists for the nrNumber specified
        const draftFiling = await this.fetchDraft()

        // Parse the draft and update NR data into the store if it exists
        if (draftFiling) {
          this.parseDraft(draftFiling)
          this.setNameRequestState(
            this.generateNameRequestState(nameRequest, +draftFiling.header.filingId))
        }

        // Initialize Fee Summary & Resources
        this.initEntity(this.stateModel.nameRequest.entityType)
      } catch (e) {
        // TODO: Catch a flag from the api, if there is an error to be handled.
      }
    }
    this.haveData = true
  }

  /** Redirects to dashboard URL. */
  private redirectToDashboard (): void {
    const dashboardUrl = sessionStorage.getItem('DASHBOARD_URL')
    window.location.assign(dashboardUrl + this.queryNrNumber)
  }

  private storeAuthRoles (response): void {
    // NB: roles array may contain 'view', 'edit' or nothing
    const authRoles = response && response.data && response.data.roles
    if (authRoles && authRoles.length > 0) {
      this.setAuthRoles(authRoles)
    } else {
      throw new Error('Invalid auth roles')
    }
  }

  /**
   * Evaluates Name Request pre-conditions.
   */
  private async evaluateNRPreconditions (): Promise<any> {
    // Clear error conditions in the event this is invoked more than one time (retry)
    this.nameRequestInvalidErrorDialog = false
    this.accountAuthorizationErrorDialog = false

    // Name request not found, show error dialog
    if (!this.queryNrNumber) {
      this.nameRequestInvalidType = NameRequestStates.NOTFOUND
      this.nameRequestInvalidErrorDialog = true
      return
    }

    return this.getNRAuthorizations(this.queryNrNumber).then(async data => {
      this.storeAuthRoles(data) // throws if no role
      const nrResponse = await this.queryNameRequest(this.queryNrNumber)

      // NR not found
      if (!nrResponse) {
        this.nameRequestInvalidType = NameRequestStates.NOTFOUND
        this.nameRequestInvalidErrorDialog = true
      }

      // Check if NR response is valid
      if (!this.isNrValid(nrResponse)) {
        this.nameRequestInvalidType = NameRequestStates.INVALID
        this.nameRequestInvalidErrorDialog = true
      }

      const nr = this.isNRConsumable(nrResponse)
      // Show error dialogs if the NR is not in a consumable state
      if (!nr.isConsumable) {
        nrResponse.isConsumable = false
        if (nr.expired) {
          // NR Expired
          this.nameRequestInvalidType = NameRequestStates.EXPIRED
          this.nameRequestInvalidErrorDialog = true
        } else if (!nr.approved) {
          // NR not in an approve state
          this.nameRequestInvalidType = NameRequestStates.NOTAPPROVED
          this.nameRequestInvalidErrorDialog = true
        } else if (nr.approved) {
          // NR is approved, but has been consumed
          this.nameRequestInvalidType = NameRequestStates.CONSUMED
          this.nameRequestInvalidErrorDialog = true
        }
      } else {
        nrResponse.isConsumable = true
      }
      return nrResponse
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.error(error)
      this.accountAuthorizationErrorDialog = true
    })
  }

  /**
   * Initializes the UI based on the entity type.
   * @param entityType the type of entity initiating an incorporation
   */
  private initEntity (entityType: string): void {
    switch (entityType) {
      case EntityTypes.BCOMP:
        this.filingData.push({ filingTypeCode: FilingCodes.INCORPORATION_BC, entityType: EntityTypes.BCOMP })
        break
      case EntityTypes.COOP:
        this.filingData.push({ filingTypeCode: FilingCodes.INCORPORATION_CP, entityType: EntityTypes.COOP })
        break
      default:
        this.filingData = []
    }

    this.setCertifyStatementResource(
      entityType ? CertifyStatementResource.find(x => x.entityType === entityType) : null
    )
  }

  /**
   * Method called when $route property changes. Used to init app.
   */
  @Watch('$route', { immediate: true })
  private async onRouteChanged (): Promise<void> {
    // don't init if we are still on signin or signout route
    if (!this.isSigninRoute && !this.isSignoutRoute) {
      this.setCurrentStep(this.$route.meta?.step)
      await this.startTokenService()
      await this.fetchData()
    }
  }

  private nrOkay (): void {
    this.nameRequestInvalidErrorDialog = false
  }
}
</script>

<style lang="scss" scoped>
// place app header on top of dialogs (and therefore still usable)
.app-header {
  z-index: 1000;
}
</style>
