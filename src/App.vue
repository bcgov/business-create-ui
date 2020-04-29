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
                <component :key="step.step" v-for="step in getSteps"
                  :is="step.component"
                  v-show="isRouteName(step.to)"
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
          @goToDashboard="goToDashboard"
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

// Components
import SbcHeader from 'sbc-common-components/src/components/SbcHeader.vue'
import SbcFooter from 'sbc-common-components/src/components/SbcFooter.vue'
import SbcFeeSummary from 'sbc-common-components/src/components/SbcFeeSummary.vue'
import { EntityInfo, Stepper, Actions } from '@/components/common'
import Views from '@/views'

// Dialogs, mixins, interfaces, etc
import { AccountAuthorizationDialog, NameRequestInvalidErrorDialog, ConfirmDialog } from '@/components/dialogs'
import { DateMixin, FilingTemplateMixin, LegalApiMixin, NameRequestMixin } from '@/mixins'
import { FilingDataIF, ActionBindingIF, ConfirmDialogType } from '@/interfaces'
import { CertifyStatementResource } from '@/resources'
import { EntityTypes, FilingCodes, RouteNames, NameRequestStates } from '@/enums'

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
  @State(state => state.stateModel.nameRequest.entityType)
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

  // Local Properties
  private filingData: Array<FilingDataIF> = []
  private accountAuthorizationErrorDialog: boolean = false
  private nameRequestInvalidErrorDialog: boolean = false
  private nameRequestInvalidType: string = ''
  private haveData: boolean = false

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

  /** The Name Request Number from the route. */
  private get queryNrNumber (): string {
    return this.$route.query.nrNumber as string
  }

  /** True if an error dialog is displayed. */
  private get isErrorDialog (): boolean {
    return (this.accountAuthorizationErrorDialog || this.nameRequestInvalidErrorDialog)
  }

  /** True if Jest is running the code. */
  private get isJestRunning (): boolean {
    return (process.env.JEST_WORKER_ID !== undefined)
  }

  /** Helper to check is the current route matches */
  private isRouteName (routeName: string) : boolean {
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
  }

  /** Called to redirect to dashboard. */
  private goToDashboard (): void {
    // check if there are no data changes
    if (!this.haveChanges) {
      // redirect to dashboard
      const dashboardUrl = sessionStorage.getItem('DASHBOARD_URL')
      window.location.assign(dashboardUrl + this.queryNrNumber)
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
      window.location.assign(dashboardUrl + this.queryNrNumber)
    })
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

  /** Fetches data required for NR and draft filing. */
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

        // Initialize Fee Summary
        this.initEntityFees()

        // Set the resources
        this.setCertifyStatementResource(CertifyStatementResource.find(x => x.entityType === this.entityType))
      } catch (e) {
        // TODO: Catch a flag from the api, if there is an error to be handled.
      }
    }
    this.haveData = true
    // wait for things to stabilize, then reset flag
    Vue.nextTick(() => this.setHaveChanges(false))
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

  /** Evaluates Name Request pre-conditions. */
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
      await this.fetchData()
    }
  }

  /** Called when user clicks OK in error dialog, to close the dialog. */
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
