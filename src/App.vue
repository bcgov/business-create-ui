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

    <file-and-pay-invalid-name-request-dialog
     attach="#app"
     :dialog="fileAndPayInvalidNameRequestDialog"
     @okay="goToManageBusinessDashboard()"/>

    <account-authorization-dialog
      attach="#app"
      :dialog="accountAuthorizationDialog"
      @exit="goToDashboard(true)"
      @retry="fetchData()"
    />

    <invalid-incorporation-application-dialog
      attach="#app"
      :dialog="invalidIncorporationApplicationDialog"
      @exit="goToDashboard(true)"
    />

    <fetch-error-dialog
      attach="#app"
      :dialog="fetchErrorDialog"
      @exit="goToDashboard(true)"
      @retry="fetchData()"
    />

    <payment-error-dialog
      attach="#app"
      filingName="Application"
      :dialog="paymentErrorDialog"
      :errors="saveErrors"
      :warnings="saveWarnings"
      @exit="goToDashboard(true)"
    />

    <save-error-dialog
      attach="#app"
      filingName="Application"
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

    <sbc-footer :aboutText=aboutText />
  </v-app>
</template>

<script lang="ts">
// Libraries
import { Component, Vue, Watch, Mixins } from 'vue-property-decorator'
import { State, Action, Getter } from 'vuex-class'
import KeycloakService from 'sbc-common-components/src/services/keycloak.services'
import { PAYMENT_REQUIRED } from 'http-status-codes'
import * as Sentry from '@sentry/browser'
import { updateLdUser } from '@/utils'

// Components
import SbcHeader from 'sbc-common-components/src/components/SbcHeader.vue'
import SbcFooter from 'sbc-common-components/src/components/SbcFooter.vue'
import SbcFeeSummary from 'sbc-common-components/src/components/SbcFeeSummary.vue'
import { EntityInfo, Stepper, Actions } from '@/components/common'
import Views from '@/views'

// Dialogs, mixins, interfaces, etc
import {
  AccountAuthorizationDialog, NameRequestInvalidErrorDialog, ConfirmDialog, FetchErrorDialog,
  InvalidIncorporationApplicationDialog, PaymentErrorDialog, SaveErrorDialog,
  FileAndPayInvalidNameRequestDialog
} from '@/components/dialogs'
import { DateMixin, FilingTemplateMixin, LegalApiMixin, NameRequestMixin } from '@/mixins'
import { FilingDataIF, ActionBindingIF, ConfirmDialogType } from '@/interfaces'
import { CompanyResources } from '@/resources'

// Enums and Constants
import { EntityTypes, FilingCodes, FilingStatus, RouteNames, NameRequestStates } from '@/enums'
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
    InvalidIncorporationApplicationDialog,
    PaymentErrorDialog,
    SaveErrorDialog,
    ConfirmDialog,
    FileAndPayInvalidNameRequestDialog,
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
  @Getter getTempId!: string

  // Global actions
  @Action setCurrentStep!: ActionBindingIF
  @Action setCurrentDate!: ActionBindingIF
  @Action setCompanyResources!: ActionBindingIF
  @Action setNameRequestState!: ActionBindingIF
  @Action setUserEmail: ActionBindingIF
  @Action setAuthRoles: ActionBindingIF
  @Action setDefineCompanyStepValidity!: ActionBindingIF
  @Action setAddPeopleAndRoleStepValidity!: ActionBindingIF
  @Action setCreateShareStructureStepValidity!: ActionBindingIF
  @Action setHaveChanges!: ActionBindingIF
  @Action setAccountInformation!: ActionBindingIF
  @Action setTempId!: ActionBindingIF

  // Local Properties
  private filingData: Array<FilingDataIF> = []
  private accountAuthorizationDialog: boolean = false
  private fetchErrorDialog: boolean = false
  private invalidIncorporationApplicationDialog: boolean = false
  private paymentErrorDialog: boolean = false
  private saveErrorDialog: boolean = false
  private nameRequestInvalidErrorDialog: boolean = false
  private nameRequestInvalidType: string = ''
  private haveData: boolean = false
  private saveErrors: Array<object> = []
  private saveWarnings: Array<object> = []
  private fileAndPayInvalidNameRequestDialog: boolean = false

  // Template Enums
  readonly RouteNames = RouteNames

  /** Whether the token refresh service is initialized. */
  private tokenService: boolean = false

  /** The URL of the Pay API. */
  private get payApiUrl (): string {
    return sessionStorage.getItem('PAY_API_URL')
  }

  /** True if an error dialog is displayed. */
  private get isErrorDialog (): boolean {
    return (
      this.accountAuthorizationDialog ||
      this.nameRequestInvalidErrorDialog ||
      this.fetchErrorDialog ||
      this.invalidIncorporationApplicationDialog ||
      this.paymentErrorDialog ||
      this.saveErrorDialog ||
      this.fileAndPayInvalidNameRequestDialog
    )
  }

  /** True if Jest is running the code. */
  private get isJestRunning (): boolean {
    return (process.env.JEST_WORKER_ID !== undefined)
  }

  /** The About text. */
  private get aboutText (): string {
    return process.env.ABOUT_TEXT
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
    this.$root.$on('save-error-event', async error => {
      // save errors/warnings
      this.saveErrors = error?.response?.data?.errors || []
      this.saveWarnings = error?.response?.data?.warnings || []

      if (error?.response?.status === PAYMENT_REQUIRED) {
        // changes were saved if a 402 is received, so clear flag
        this.setHaveChanges(false)
        this.paymentErrorDialog = true
      } else {
        console.log('save error =', error) // eslint-disable-line no-console
        this.saveErrorDialog = true
      }
    })

    this.$root.$on('name-request-invalid-error', async error => {
      console.log('NR error during File and Pay =', error) // eslint-disable-line no-console
      this.fileAndPayInvalidNameRequestDialog = true
    })

    this.$root.$on('name-request-retrieve-error', async () => {
      console.log('Error while retrieving NR during File and Pay') // eslint-disable-line no-console
      this.nameRequestInvalidErrorDialog = true
    })
  }

  /** Called when component is destroyed. */
  private destroyed (): void {
    // stop listening for save error event
    this.$root.$off('save-error-event')
    this.$root.$off('name-request-invalid-errort')
    this.$root.$off('name-request-retrieve-error')
  }

  private goToManageBusinessDashboard (): void {
    this.fileAndPayInvalidNameRequestDialog = false
    const manageBusinessUrl = `${sessionStorage.getItem('AUTH_URL')}business`
    this.setHaveChanges(false)
    window.location.assign(manageBusinessUrl)
  }

  /** Called to redirect to dashboard. */
  private goToDashboard (force: boolean = false): void {
    // check if there are no data changes
    if (!this.haveChanges || force) {
      // redirect to dashboard
      const dashboardUrl = sessionStorage.getItem('DASHBOARD_URL')
      window.location.assign(dashboardUrl + this.getTempId)
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
      window.location.assign(dashboardUrl + this.getTempId)
    })
  }

  /** Starts token service to refresh KC token periodically. */
  private async startTokenService (): Promise<void> {
    // only initialize once
    // don't start during Jest tests as it messes up the test JWT
    if (this.tokenService || this.isJestRunning) return
    try {
      console.info('Starting token refresh service...') // eslint-disable-line no-console
      await KeycloakService.initializeToken()
      this.tokenService = true
    } catch (error) {
      // Happens when the refresh token has expired in session storage
      // reload to get new tokens

      // eslint-disable-next-line no-console
      console.log('Could not initialize token refresher: ', error)
      this.clearKeycloakSession()
      location.reload()
    }
  }

  /** Clears Keycloak token information from session storage. */
  private clearKeycloakSession (): void {
    sessionStorage.removeItem(SessionStorageKeys.KeyCloakToken)
    sessionStorage.removeItem(SessionStorageKeys.KeyCloakRefreshToken)
    sessionStorage.removeItem(SessionStorageKeys.KeyCloakIdToken)
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

      const tempId = this.$route.query?.id
      // ensure we have a Temporary Registration number
      if (!tempId) {
        this.nameRequestInvalidType = NameRequestStates.NOT_FOUND
        this.nameRequestInvalidErrorDialog = true
        return // go to finally()
      }
      this.setTempId(tempId)

      // get user info
      const userInfo = await this.getUserInfo().catch(error => {
        console.log('User info error =', error) // eslint-disable-line no-console
        this.accountAuthorizationDialog = true
        throw error // go to catch()
      })

      // update Launch Darkly
      await this.updateLaunchDarkly(userInfo).catch(error => {
        // just log the error -- no need to halt app
        console.log('Launch Darkly update error =', error) // eslint-disable-line no-console
      })

      // ensure user is authorized to use this IA
      await this.checkAuth().catch(error => {
        console.log('Auth error =', error) // eslint-disable-line no-console
        this.accountAuthorizationDialog = true
        throw error // go to catch()
      })

      try {
        // fetch draft filing
        let draftFiling = await this.fetchDraft()

        // If there is an existing filing, check if it is in a valid state to be edited
        if (draftFiling) {
          this.invalidIncorporationApplicationDialog = this.hasInvalidFilingState(draftFiling)
          if (this.invalidIncorporationApplicationDialog) return
        }
        // merge draft properties into empty filing so all properties are initialized
        const emptyFiling = this.buildFiling()
        draftFiling = { ...emptyFiling.filing, ...draftFiling }

        // parse draft filing into the store
        if (draftFiling) {
          this.parseDraft(draftFiling)
        }

        // verify nameRequest object
        const nameRequest = draftFiling?.incorporationApplication?.nameRequest
        if (!nameRequest) {
          // there should be a nameRequest object but continue even if it doesn't exist
          // TODO: after MVP, add a real check here
          console.log('Filing should have nameRequest object') // eslint-disable-line no-console
        }
        /** Fetches and validates the NR and sets the data to the store. This method is different
         * from the validateNameRequest method in Actions.vue. This method sets the data to
         * the store shows a specific message for different invalid states and redirection is to the
         * Filings Dashboard */
        if (nameRequest?.nrNumber) {
          await this.processNameRequest(draftFiling)
        }

        // Initialize Fee Summary
        this.initEntityFees()

        // Set the resources
        // An unknown entity type will need to be handled here
        const companyResources = CompanyResources.find(x => x.entityType === this.entityType)
        if (companyResources) this.setCompanyResources(companyResources)
        else throw new Error('Invalid Entity Type')
      } catch (error) {
        // logging exception to sentry due to incomplete business data.
        // at this point system doesn't know why its incomplete.
        // since its not an expected behaviour it could be better to track.
        Sentry.captureException(error)
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

  /** Used to check if the filing is in a valid state for changes. */
  private hasInvalidFilingState (filing: any): boolean {
    const filingStatus = filing.header.status
    return filingStatus !== FilingStatus.DRAFT
  }

  /** Fetches NR and validates it. */
  private async processNameRequest (filing: any): Promise<void> {
    try {
      const nrNumber = filing.incorporationApplication.nameRequest.nrNumber

      // fetch NR data
      const nrResponse = await this.fetchNameRequest(nrNumber).catch(error => {
        console.log('NR error =', error) // eslint-disable-line no-console
        this.nameRequestInvalidErrorDialog = true
      })

      // ensure NR was found
      if (!nrResponse) {
        this.nameRequestInvalidType = NameRequestStates.NOT_FOUND
        this.nameRequestInvalidErrorDialog = true
        return
      }

      // ensure NR is valid
      if (!this.isNrValid(nrResponse)) {
        this.nameRequestInvalidType = NameRequestStates.INVALID
        this.nameRequestInvalidErrorDialog = true
        return
      }

      // TODO: verify that nrResponse.entityTypeCd === business.legalType

      // ensure NR is consumable
      const state = this.getNrState(nrResponse)
      if (state !== NameRequestStates.APPROVED && state !== NameRequestStates.CONDITIONAL) {
        this.nameRequestInvalidType = state || NameRequestStates.INVALID
        this.nameRequestInvalidErrorDialog = true
        return
      }
      // if we get this far, the NR is good to go!
      const nameRequestState = this.generateNameRequestState(nrResponse, filing.Id)
      this.setNameRequestState(nameRequestState)
    } catch (e) {
      // errors should be handled above
    }
  }

  /** Resets all error flags/states. */
  private resetFlags (): void {
    this.haveData = false
    this.nameRequestInvalidErrorDialog = false
    this.invalidIncorporationApplicationDialog = false
    this.accountAuthorizationDialog = false
    this.fetchErrorDialog = false
    this.paymentErrorDialog = false
    this.saveErrorDialog = false
    this.fileAndPayInvalidNameRequestDialog = false
    this.saveErrors = []
    this.saveWarnings = []
  }

  /** Gets current user info and stores it. */
  private async getUserInfo (): Promise<any> {
    // NB: will throw if API error
    const response = await this.getCurrentUser()
    // NB: just save email for now
    let email
    if (response?.data?.contacts?.length > 0) {
      // this is a BCSC user
      email = response?.data?.contacts[0].email
    } else if (response?.data?.email) {
      // this is a IDIR user
      email = response?.data?.email
    }
    if (email) {
      this.setUserEmail(email)
    } else {
      throw new Error('Invalid user info')
    }
    return response.data
  }

  /** Updates Launch Darkly with current user info. */
  private async updateLaunchDarkly (userInfo: any): Promise<void> {
    // since username is unique, use it as the user key
    const key: string = userInfo.username
    const email: string = userInfo.contacts[0]?.email || userInfo.email
    const firstName: string = userInfo?.firstname
    const lastName: string = userInfo?.lastname
    // remove leading { and trailing } and tokenize string
    const custom: any = { roles: userInfo.roles?.slice(1, -1).split(',') }

    await updateLdUser(key, email, firstName, lastName, custom)
  }

  /** Gets authorizations from Auth API, verifies roles, and stores them. */
  private async checkAuth (): Promise<any> {
    // NB: will throw if API error
    const response = await this.getNrAuthorizations(this.getTempId)
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
      await this.fetchData(true)

      // Allow user settings account information to load into session storage before checking
      // There can be a timing issue when a session is first established where account information
      // is not available right away in session storage
      await Vue.nextTick()
      this.loadAccountInformation()
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
