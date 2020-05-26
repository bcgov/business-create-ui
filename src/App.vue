<template>
  <v-app class="app-container" id="app">
    <!-- Dialogs -->
    <name-request-invalid-error-dialog
      attach="#app"
      :dialog="nameRequestInvalidErrorDialog"
      :type="nameRequestInvalidType"
      @okay="nameRequestInvalidErrorDialog = false"
      @redirect="goToDashboard(true)"
    />

    <account-authorization-dialog
      attach="#app"
      :dialog="accountAuthorizationDialog"
      @exit="goToDashboard(true)"
      @retry="fetchData()"
    />

    <fetch-error-dialog
      attach="#app"
      :dialog="fetchErrorDialog"
      @exit="goToDashboard(true)"
      @retry="fetchData()"
    />

    <payment-error-dialog
      attach="#app"
      :dialog="paymentErrorDialog"
      @exit="goToDashboard(true)"
    />

    <save-error-dialog
      attach="#app"
      :dialog="saveErrorDialog"
      :errors="saveErrors"
      :warnings="saveWarnings"
      @exit="goToDashboard(true)"
      @okay="saveErrorDialog = false"
    />

    <confirm-dialog
      ref="confirm"
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
              <!-- Sign in and sign out components -->
              <sign-in v-if="isRouteName(RouteNames.SIGN_IN)" />
              <sign-out v-if="isRouteName(RouteNames.SIGN_OUT)" />

              <!-- Only render when data is ready, or validation can't be properly evaluated. -->
              <template v-if="haveData">
                <!-- Using v-show to pre-create/mount components so validation on stepper is shown -->
                <component
                  v-for="step in getSteps"
                  v-show="isRouteName(step.to)"
                  :is="step.component"
                  :key="step.step"
                />
              </template>
            </v-col>

            <v-col cols="12" lg="3" style="position: relative">
              <aside>
                <affix relative-element-selector=".col-lg-9" :offset="{ top: 86, bottom: 12 }">
                  <sbc-fee-summary
                    :filingData="[...filingData]"
                    :payURL="payApiUrl"
                  />
                </affix>
              </aside>
            </v-col>
          </v-row>
        </v-container>

        <actions
          :key="$route.path"
          @goToDashboard="goToDashboard()"
        />
      </main>
    </div>

    <sbc-footer />
  </v-app>
</template>

<script lang="ts">
// Libraries
import { Component, Vue, Watch, Mixins } from 'vue-property-decorator'
import { State, Action, Getter } from 'vuex-class'
import TokenService from 'sbc-common-components/src/services/token.services'
import { BAD_REQUEST, PAYMENT_REQUIRED, FORBIDDEN } from 'http-status-codes'

// Components
import SbcHeader from 'sbc-common-components/src/components/SbcHeader.vue'
import SbcFooter from 'sbc-common-components/src/components/SbcFooter.vue'
import SbcFeeSummary from 'sbc-common-components/src/components/SbcFeeSummary.vue'
import { EntityInfo, Stepper, Actions } from '@/components/common'
import Views from '@/views'

// Dialogs, mixins, interfaces, etc
import { AccountAuthorizationDialog, NameRequestInvalidErrorDialog, ConfirmDialog, FetchErrorDialog,
  PaymentErrorDialog, SaveErrorDialog } from '@/components/dialogs'
import { DateMixin, FilingTemplateMixin, LegalApiMixin, NameRequestMixin } from '@/mixins'
import { FilingDataIF, ActionBindingIF, ConfirmDialogType } from '@/interfaces'
import { CertifyStatementResource } from '@/resources'

// Enums and Constants
import { EntityTypes, FilingCodes, RouteNames, NameRequestStates } from '@/enums'
import { SessionStorageKeys } from 'sbc-common-components/src/util/constants'

@Component({
  components: {
    SbcHeader,
    SbcFooter,
    SbcFeeSummary,
    EntityInfo,
    Stepper,
    Actions,
    NameRequestInvalidErrorDialog,
    AccountAuthorizationDialog,
    FetchErrorDialog,
    PaymentErrorDialog,
    SaveErrorDialog,
    ConfirmDialog,
    ...Views
  }
})
export default class App extends Mixins(DateMixin, FilingTemplateMixin, LegalApiMixin, NameRequestMixin) {
  // Refs
  $refs!: {
    confirm: ConfirmDialogType
  }

  // Global state
  @State(state => state.stateModel.entityType)
  readonly entityType!: string

  @State(state => state.stateModel.incorporationDateTime.isFutureEffective)
  readonly isFutureEffective!: boolean

  // Global getters
  @Getter haveChanges!: boolean
  @Getter getSteps!: Array<any>

  // Global actions
  @Action setCurrentStep!: ActionBindingIF
  @Action setCurrentDate!: ActionBindingIF
  @Action setCertifyStatementResource!: ActionBindingIF
  @Action setNameRequestState!: ActionBindingIF
  @Action setAuthRoles: ActionBindingIF
  @Action setDefineCompanyStepValidity!: ActionBindingIF
  @Action setAddPeopleAndRoleStepValidity!: ActionBindingIF
  @Action setCreateShareStructureStepValidity!: ActionBindingIF
  @Action setHaveChanges!: ActionBindingIF
  @Action setAccountInformation!: ActionBindingIF
  @Action setTemporaryId!: ActionBindingIF

  // Local Properties
  private filingData: Array<FilingDataIF> = []
  private accountAuthorizationDialog: boolean = false
  private fetchErrorDialog: boolean = false
  private paymentErrorDialog: boolean = false
  private saveErrorDialog: boolean = false
  private nameRequestInvalidErrorDialog: boolean = false
  private nameRequestInvalidType: string = ''
  private haveData: boolean = false
  private saveErrors: Array<object> = []
  private saveWarnings: Array<object> = []

  // Template Enums
  readonly RouteNames = RouteNames

  /**
   * Instance of the token refresh service.
   * Needs to exist for lifetime of app.
   */
  private tokenService: TokenService = null

  /** The URL of the Pay API. */
  private get payApiUrl (): string {
    return sessionStorage.getItem('PAY_API_URL')
  }

  /** The Temporary Registration Id from the route */
  private get tempId (): string {
    return this.$route.query.id as string
  }

  /** True if an error dialog is displayed. */
  private get isErrorDialog (): boolean {
    return (
      this.accountAuthorizationDialog ||
      this.nameRequestInvalidErrorDialog ||
      this.fetchErrorDialog ||
      this.paymentErrorDialog ||
      this.saveErrorDialog
    )
  }

  /** True if Jest is running the code. */
  private get isJestRunning (): boolean {
    return (process.env.JEST_WORKER_ID !== undefined)
  }

  /** Helper to check is the current route matches */
  private isRouteName (routeName: string): boolean {
    return this.$route.name === routeName
  }

  /** Called when component is created. */
  private created (): void {
    // before unloading this page, if there are changes then prompt user
    window.onbeforeunload = (event) => {
      if (this.haveChanges) {
        event.preventDefault()
        // NB: custom text is not supported in all browsers
        event.returnValue = 'You have unsaved changes. Are you sure you want to leave?'
      }
    }

    // listen for save error event
    this.$root.$on('save-error-event', error => {
      console.log('Save error =', error) // eslint-disable-line no-console
      // process errors/warnings
      switch (error?.response?.status) {
        case PAYMENT_REQUIRED:
          this.paymentErrorDialog = true
          break
        case BAD_REQUEST:
        case FORBIDDEN:
          this.saveErrors = error?.response?.data?.errors || []
          this.saveWarnings = error?.response?.data?.warnings || []
          this.saveErrorDialog = true
          break
        default:
          this.saveErrorDialog = true
      }
    })
  }

  /** Called when component is destroyed. */
  private destroyed (): void {
    // stop listening for save error event
    this.$root.$off('save-error-event')
  }

  /** Called to redirect to dashboard. */
  private goToDashboard (force: boolean = false): void {
    // check if there are no data changes
    if (!this.haveChanges || force) {
      // redirect to dashboard
      const dashboardUrl = sessionStorage.getItem('DASHBOARD_URL')
      // TODO: window.location.assign(dashboardUrl + this.nrNumber)
      return
    }

    // open confirmation dialog and wait for response
    this.$refs.confirm.open(
      'Unsaved Changes',
      'You have unsaved changes in your Incorporation Application. Do you want to exit?',
      {
        width: '45rem',
        persistent: true,
        yes: 'Return to my application',
        no: null,
        cancel: 'Exit without saving'
      }
    ).then(() => {
      // if we get here, Yes was clicked
      // nothing to do
    }).catch(() => {
      // if we get here, Cancel was clicked
      // ignore changes
      this.setHaveChanges(false)
      // redirect to dashboard
      const dashboardUrl = sessionStorage.getItem('DASHBOARD_URL')
      // TODO: window.location.assign(dashboardUrl + this.nrNumber)
    })
  }

  /** Starts token service to refresh KC token periodically. */
  private async startTokenService (): Promise<void> {
    // only initialize once
    // don't start during Jest tests as it messes up the test JWT
    if (this.tokenService || this.isJestRunning) return
    try {
      console.info('Starting token refresh service...') // eslint-disable-line no-console
      this.tokenService = new TokenService()
      await this.tokenService.init()
      this.tokenService.scheduleRefreshTimer()
    } catch (error) {
      // Happens when the refresh token has expired in session storage
      // reload to get new tokens

      // eslint-disable-next-line no-console
      console.log('Could not initialize token refresher: ', error)
      this.clearKeycloakSession()
      location.reload()
    }
  }

  /**
   * Clears Keycloak token information from session storage
   */
  private clearKeycloakSession (): void {
    sessionStorage.removeItem(SessionStorageKeys.KeyCloakToken)
    sessionStorage.removeItem(SessionStorageKeys.KeyCloakIdToken)
    sessionStorage.removeItem(SessionStorageKeys.KeyCloakRefreshToken)
    sessionStorage.removeItem(SessionStorageKeys.UserFullName)
    sessionStorage.removeItem(SessionStorageKeys.UserKcId)
    sessionStorage.removeItem(SessionStorageKeys.UserAccountType)
    sessionStorage.removeItem(SessionStorageKeys.CurrentAccount)
  }

  /** Fetches NR data and fetches draft filing. */
  private async fetchData (routeChanged: boolean = false): Promise<void> {
    // only fetch data on first route change
    if (routeChanged && this.haveData) return

    // reset errors in case this method is invoked more than once (ie, retry)
    this.resetFlags()

    try {
      this.setCurrentDate(this.dateToUsableString(new Date()))

      // ensure we have a NR number
      if (!this.tempId) {
        this.nameRequestInvalidType = NameRequestStates.NOT_FOUND
        this.nameRequestInvalidErrorDialog = true
        return // go to finally()
      }

      // ensure user is authorized to use this NR
      await this.checkAuth().catch(error => {
        console.log('Auth error =', error) // eslint-disable-line no-console
        this.accountAuthorizationDialog = true
        throw error // go to catch()
      })

      try {
        this.setTemporaryId(this.tempId)
        // Retrieve draft filing if it exists for the NR Number specified
        let draftFiling = await this.fetchDraft()
        let emptyFiling = this.buildEmptyFiling()
        if (draftFiling?.incorporationApplication?.nameRequest) {
          await this.populateNameRequest(draftFiling)
          emptyFiling = this.buildFiling()
        }

        draftFiling = { ...draftFiling, ...emptyFiling.filing }

        // Parse the draft and update NR data into the store if it exists
        if (draftFiling) {
          this.parseDraft(draftFiling)
          // this.setNameRequestState(this.generateNameRequestState(nrResponse, +draftFiling.header.filingId))
        }

        // Initialize Fee Summary
        this.initEntityFees()

        // Set the resources
        this.setCertifyStatementResource(CertifyStatementResource.find(x => x.entityType === this.entityType))
      } catch (error) {
        console.log('Fetch error =', error) // eslint-disable-line no-console
        this.fetchErrorDialog = true
        throw error // go to catch()
      }
    } catch (e) {
      // errors should be handled above
      // just fall through to finally()
    } finally {
      this.haveData = true
      // wait for things to stabilize, then reset flag
      Vue.nextTick(() => this.setHaveChanges(false))
    }
  }

  private async populateNameRequest (filing: any): Promise<void> {
    try {
      this.setCurrentDate(this.dateToUsableString(new Date()))
      let nameRequest = filing.incorporationApplication.nameRequest
      // ensure we have a NR number

      if (!nameRequest.nrNumber) {
        this.nameRequestInvalidType = NameRequestStates.NOT_FOUND
        this.nameRequestInvalidErrorDialog = true
        return // go to finally()
      }
      // fetch NR data
      const nrResponse = await this.fetchNameRequest(nameRequest.nrNumber).catch(error => {
        console.log('NR error =', error) // eslint-disable-line no-console
        // this.nameRequestInvalidErrorDialog = true
        // throw error // go to catch()
        return {}
      })
      // ensure NR was found
      debugger
      if (!nrResponse) {
        this.nameRequestInvalidType = NameRequestStates.NOT_FOUND
        this.nameRequestInvalidErrorDialog = true
        return // go to finally()
      }
      // ensure NR is valid
      if (!this.isNrValid(nrResponse)) {
        this.nameRequestInvalidType = NameRequestStates.INVALID
        this.nameRequestInvalidErrorDialog = true
        return // go to finally()
      }
      // ensure NR is consumable
      const state = this.getNrState(nrResponse)
      if (!state || state !== NameRequestStates.APPROVED) {
        this.nameRequestInvalidType = state || NameRequestStates.INVALID
        this.nameRequestInvalidErrorDialog = true
        return // go to finally()
      }
      // if we get this far, the NR is good to go!
      nrResponse.isConsumable = true
      this.setNameRequestState(this.generateNameRequestState(nrResponse, filing.Id))
    } catch (ex) {
    }
  }

  private populateNameRequest (filing: any): void {

  }

  /** Resets all error flags/states. */
  private resetFlags (): void {
    this.haveData = false
    this.nameRequestInvalidErrorDialog = false
    this.accountAuthorizationDialog = false
    this.fetchErrorDialog = false
    this.paymentErrorDialog = false
    this.saveErrorDialog = false
    this.saveErrors = []
    this.saveWarnings = []
  }

  /** Gets authorizations from Auth API and verifies roles. */
  private async checkAuth (): Promise<any> {
    // NB: will throw if API error
    const response = await this.getNrAuthorizations(this.tempId)
    // NB: roles array may contain 'view', 'edit', 'staff' or nothing
    const authRoles = response?.data?.roles
    if (authRoles && authRoles.length > 0) {
      this.setAuthRoles(authRoles)
    } else {
      throw new Error('Invalid auth roles')
    }
  }

  /** Gets account information (e.g. Premium account) and loads it into the state model */
  private loadAccountInformation (): void {
    if (sessionStorage.getItem(SessionStorageKeys.CurrentAccount)) {
      const accountInfo = JSON.parse(sessionStorage.getItem(SessionStorageKeys.CurrentAccount))
      this.setAccountInformation(accountInfo)
    }
  }

  /** Initializes the Fee Summary based on the entity type. */
  @Watch('isFutureEffective')
  private initEntityFees (): void {
    switch (this.entityType) {
      case EntityTypes.BCOMP:
        this.filingData = [{
          filingTypeCode: FilingCodes.INCORPORATION_BC,
          entityType: EntityTypes.BCOMP,
          futureEffective: this.isFutureEffective
        }]
        break
      case EntityTypes.COOP:
        this.filingData = [{
          filingTypeCode: FilingCodes.INCORPORATION_CP,
          entityType: EntityTypes.COOP,
          futureEffective: this.isFutureEffective
        }]
        break
      default:
        this.filingData = []
    }
  }

  /** Called when $route property changes. Used to init app. */
  @Watch('$route', { immediate: true })
  private async onRouteChanged (): Promise<void> {
    const isSigninRoute = (this.$route.name === 'signin')
    const isSignoutRoute = (this.$route.name === 'signout')

    // don't init if we are still on signin or signout route
    if (!isSigninRoute && !isSignoutRoute) {
      this.setCurrentStep(this.$route.meta?.step)
      await this.startTokenService()
      this.loadAccountInformation()
      await this.fetchData(true)
    }
  }
}
</script>

<style lang="scss" scoped>
// place app header on top of dialogs (and therefore still usable)
.app-header {
  z-index: 1000;
}
</style>
