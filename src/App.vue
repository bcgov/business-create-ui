<template>
  <v-app class="app-container" id="app">
    <!-- Dialogs -->
    <NameRequestInvalidErrorDialog
      attach="#app"
      :dialog="nameRequestInvalidErrorDialog"
      :type="nameRequestInvalidType"
      @okay="nameRequestInvalidErrorDialog = false"
      @redirect="goToDashboard(true)"
    />

    <FileAndPayInvalidNameRequestDialog
     attach="#app"
     :dialog="fileAndPayInvalidNameRequestDialog"
     @okay="goToManageBusinessDashboard()"
    />

    <AccountAuthorizationDialog
      attach="#app"
      :dialog="accountAuthorizationDialog"
      @exit="goToDashboard(true)"
      @retry="fetchData()"
    />

    <InvalidDissolutionDialog
      attach="#app"
      :dialog="invalidDissolutionDialog"
      @exit="goToDashboard(true)"
    />

    <InvalidIncorporationApplicationDialog
      attach="#app"
      :dialog="invalidIncorporationApplicationDialog"
      @exit="goToDashboard(true)"
    />

    <InvalidRouteDialog
      attach="#app"
      :dialog="invalidRouteDialog"
      @exit="goToDashboard(true)"
    />

    <FetchErrorDialog
      attach="#app"
      :dialog="fetchErrorDialog"
      @exit="goToDashboard(true)"
      @retry="fetchData()"
    />

    <PaymentErrorDialog
      attach="#app"
      filingName="Application"
      :dialog="paymentErrorDialog"
      :errors="saveErrors"
      :warnings="saveWarnings"
      @exit="goToDashboard(true)"
    />

    <SaveErrorDialog
      attach="#app"
      :filingName="saveErrorDialogName"
      :dialog="saveErrorDialog"
      :errors="saveErrors"
      :warnings="saveWarnings"
      @exit="goToDashboard(true)"
      @okay="saveErrorDialog = false"
    />

    <ConfirmDialog
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
    <PaySystemAlert />
    <div class="app-body">
      <main v-if="!isErrorDialog">
        <entity-info />

        <v-container class="view-container pt-4">
          <v-row>
            <v-col cols="12" lg="9">
              <header>
                <h1>{{ getFilingName }}</h1>
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
                    :filingData="feeFilingData"
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
import { Component, Mixins, Vue, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import KeycloakService from 'sbc-common-components/src/services/keycloak.services'
import { PAYMENT_REQUIRED } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import * as Sentry from '@sentry/browser'
import { getFeatureFlag, updateLdUser } from '@/utils'

// Components
import PaySystemAlert from 'sbc-common-components/src/components/PaySystemAlert.vue'
import SbcHeader from 'sbc-common-components/src/components/SbcHeader.vue'
import SbcFooter from 'sbc-common-components/src/components/SbcFooter.vue'
import SbcFeeSummary from 'sbc-common-components/src/components/SbcFeeSummary.vue'
import { Actions, EntityInfo, Stepper } from '@/components/common'
import * as Views from '@/views'

// Dialogs, mixins, interfaces, etc
import {
  AccountAuthorizationDialog,
  ConfirmDialog,
  FetchErrorDialog,
  FileAndPayInvalidNameRequestDialog,
  InvalidDissolutionDialog,
  InvalidIncorporationApplicationDialog,
  InvalidRouteDialog,
  NameRequestInvalidErrorDialog,
  PaymentErrorDialog,
  SaveErrorDialog
} from '@/components/dialogs'
import {
  AuthApiMixin,
  CommonMixin,
  DateMixin,
  FilingTemplateMixin,
  LegalApiMixin,
  NameRequestMixin
} from '@/mixins'
import {
  AccountInformationIF,
  ActionBindingIF,
  AddressIF,
  ConfirmDialogType,
  DissolutionResourceIF,
  EmptyFees,
  FilingDataIF,
  IncorporationResourceIF,
  StepIF
} from '@/interfaces'
import { DissolutionResources, IncorporationResources } from '@/resources'
import { AuthServices, PayServices } from '@/services'

// Enums and Constants
import { FilingNames, FilingStatus, FilingTypes, NameRequestStates, RouteNames } from '@/enums'
import { SessionStorageKeys } from 'sbc-common-components/src/util/constants'

@Component({
  components: {
    PaySystemAlert,
    SbcHeader,
    SbcFooter,
    SbcFeeSummary,
    EntityInfo,
    Stepper,
    Actions,
    NameRequestInvalidErrorDialog,
    AccountAuthorizationDialog,
    FetchErrorDialog,
    InvalidDissolutionDialog,
    InvalidIncorporationApplicationDialog,
    InvalidRouteDialog,
    PaymentErrorDialog,
    SaveErrorDialog,
    ConfirmDialog,
    FileAndPayInvalidNameRequestDialog,
    ...Views
  }
})
export default class App extends Mixins(
  AuthApiMixin,
  CommonMixin,
  DateMixin,
  FilingTemplateMixin,
  LegalApiMixin,
  NameRequestMixin
) {
  // Refs
  $refs!: {
    confirm: ConfirmDialogType
  }

  @Getter getHaveChanges!: boolean
  @Getter getFilingData!: FilingDataIF
  @Getter getFilingType!: FilingTypes
  @Getter getFilingName!: FilingNames
  @Getter isDissolutionFiling!: boolean
  @Getter isIncorporationFiling!: boolean
  @Getter isPremiumAccount!: boolean
  @Getter isRoleStaff!: boolean
  @Getter getSteps!: Array<StepIF>

  @Action setAccountFolio!: ActionBindingIF
  @Action setBusinessId!: ActionBindingIF
  @Action setCurrentStep!: ActionBindingIF
  @Action setCurrentDate!: ActionBindingIF
  @Action setCurrentJsDate!: ActionBindingIF
  @Action setResources!: ActionBindingIF
  @Action setUserEmail!: ActionBindingIF
  @Action setUserPhone!: ActionBindingIF
  @Action setUserFirstName!: ActionBindingIF
  @Action setUserLastName!: ActionBindingIF
  @Action setUserKeycloakGuid!: ActionBindingIF
  @Action setUserAddress!: ActionBindingIF
  @Action setAuthRoles!: ActionBindingIF
  @Action setAddPeopleAndRoleStepValidity!: ActionBindingIF
  @Action setCreateShareStructureStepValidity!: ActionBindingIF
  @Action setHaveChanges!: ActionBindingIF
  @Action setAccountInformation!: ActionBindingIF
  @Action setTempId!: ActionBindingIF
  @Action setShowErrors!: ActionBindingIF
  @Action setFilingType!: ActionBindingIF
  @Action setFeePrices!: ActionBindingIF

  // Local properties
  private accountAuthorizationDialog: boolean = false
  private fetchErrorDialog: boolean = false
  private invalidDissolutionDialog: boolean = false
  private invalidIncorporationApplicationDialog: boolean = false
  private invalidRouteDialog: boolean = false
  private paymentErrorDialog: boolean = false
  private saveErrorDialog: boolean = false
  private nameRequestInvalidErrorDialog: boolean = false
  private nameRequestInvalidType: string = ''
  private haveData: boolean = false
  private saveErrors: Array<object> = []
  private saveWarnings: Array<object> = []
  private fileAndPayInvalidNameRequestDialog: boolean = false

  // Enum for template
  readonly RouteNames = RouteNames

  /** Whether the token refresh service is initialized. */
  private tokenService: boolean = false

  /** The Update Current JS Date timer id. */
  private updateCurrentJsDateId = 0

  /** Data for fee summary component. */
  private get feeFilingData (): Array<FilingDataIF> {
    return this.getFilingData
      ? [{ ...this.getFilingData, futureEffective: this.getEffectiveDateTime.isFutureEffective }]
      : []
  }

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

  /** The About text. */
  private get aboutText (): string {
    return process.env.ABOUT_TEXT
  }

  /** The header name for the Save Error Dialog. */
  private get saveErrorDialogName (): string {
    switch (this.getFilingType) {
      case FilingTypes.INCORPORATION_APPLICATION:
        return 'Application'
      case FilingTypes.DISSOLUTION:
        return 'Filing'
    }
  }

  /** Helper to check is the current route matches */
  private isRouteName (routeName: string): boolean {
    return this.$route.name === routeName
  }

  /** Called when component is created. */
  private async created (): Promise<void> {
    // update Current Js Date now and every 1 minute thereafter
    await this.updateCurrentJsDate()
    this.updateCurrentJsDateId = setInterval(this.updateCurrentJsDate, 60000)

    // add handler to prompt user if there are changes, before unloading this page
    window.onbeforeunload = (event) => {
      if (this.getHaveChanges) {
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

  /** Fetches and stores the current JS date. */
  private async updateCurrentJsDate (): Promise<void> {
    const jsDate = await this.getServerDate()
    this.setCurrentJsDate(jsDate)
  }

  /** Called when component is destroyed. */
  private destroyed (): void {
    // stop Update Current Js Date timer
    clearInterval(this.updateCurrentJsDateId)

    // stop listening for save error event
    this.$root.$off('save-error-event')
    this.$root.$off('name-request-invalid-errort')
    this.$root.$off('name-request-retrieve-error')
  }

  /** Called to init main entity identifier. */
  private assignIdentifier (): void {
    // Capture identifier from query param
    const id = this.$route.query?.id as string
    // Assign any valid business identifiers and init dissolution
    if (id?.startsWith('CP') || id?.startsWith('BC')) {
      this.setBusinessId(id)
      this.setFilingType(FilingTypes.DISSOLUTION)
    } else {
      // Assign temp reg number and init incorporation
      this.setTempId(id)
      this.setFilingType(FilingTypes.INCORPORATION_APPLICATION)
    }
  }

  private goToManageBusinessDashboard (): void {
    this.fileAndPayInvalidNameRequestDialog = false
    const manageBusinessUrl = `${sessionStorage.getItem('AUTH_WEB_URL')}business`
    this.setHaveChanges(false)
    window.location.assign(manageBusinessUrl)
  }

  /** Called to redirect to dashboard. */
  private goToDashboard (force: boolean = false): void {
    // check if there are no data changes
    if (!this.getHaveChanges || force) {
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

    // Feature flag safety check
    const supportedFilings = await getFeatureFlag('supported-filings')
    if (!supportedFilings?.includes(this.$route.meta.filingType)) {
      window.alert('Dissolution are not available at the moment. Please check again later.')
      this.goToDashboard(true)
      return
    }

    // Protect the routes not associated with this filing type.
    if (this.$route.meta.filingType !== this.getFilingType) {
      console.log('ROUTE ERROR')
      this.invalidRouteDialog = true
    }

    try {
      // set current date from "real time" date from server
      this.setCurrentDate(this.dateToYyyyMmDd(this.getCurrentJsDate))

      // get user info
      const userInfo = await this.getSaveUserInfo().catch(error => {
        console.log('User info error =', error) // eslint-disable-line no-console
        this.accountAuthorizationDialog = true
        throw error // go to catch()
      })

      // get account info
      const accountInfo = await this.getSaveAccountInfo().catch(error => {
        console.log('Account info error =', error) // eslint-disable-line no-console
        this.accountAuthorizationDialog = true
        throw error // go to catch()
      })

      // get org info
      const orgInfo = await this.getSaveOrgInfo(accountInfo?.id).catch(error => {
        console.log('Org info error =', error) // eslint-disable-line no-console
        this.accountAuthorizationDialog = true
        throw error // go to catch()
      })

      // update Launch Darkly
      await this.updateLaunchDarkly(userInfo).catch(error => {
        // just log the error -- no need to halt app
        console.log('Launch Darkly update error =', error) // eslint-disable-line no-console
      })

      // fetch the draft filing
      try {
        // Dissolution filing
        if (this.isDissolutionFiling) {
          const resources = await this.handleDraftDissolution()
          if (!resources) throw new Error(`Invalid dissolution entity type = ${this.getEntityType}`)
          this.setResources(resources)
        }

        // Incorporation filing
        if (this.isIncorporationFiling) {
          const resources = await this.handleDraftIncorporation()
          if (!resources) throw new Error(`Invalid incorporation entity type = ${this.getEntityType}`)
          this.setResources(resources)
        }
      } catch (error) {
        // Log exception to Sentry due to incomplete business data.
        // At this point the system doesn't know why it's incomplete.
        // Since it's not an expected behaviour, it is better to report it.
        Sentry.captureException(error)
        console.log('Fetch error =', error) // eslint-disable-line no-console
        this.fetchErrorDialog = true
        throw error // go to catch()
      }

      // fetch and set the fee prices to display in the text
      this.setFeePrices(
        await PayServices.fetchFilingFees(this.getFilingData.filingTypeCode, this.getFilingData.entityType, true)
          .catch(error => {
            console.log('Failed to fetch filing fees, error =', error) // eslint-disable-line no-console
            // return a valid fees structure
            return cloneDeep(EmptyFees)
          })
      )

      // set current profile name to store for field pre population
      // do this only if we are not staff
      if (userInfo && !this.isRoleStaff) {
        // pre-populate Certified By name
        this.setCertifyState(
          {
            valid: this.getCertifyState.valid,
            certifiedBy: `${userInfo.firstname} ${userInfo.lastname}`
          }
        )
      }
    } catch (error) {
      // errors should be handled above
      console.error('Unhandled error in fetchData() =', error) // eslint-disable-line no-console
      // just fall through to finally()
    } finally {
      this.haveData = true
      // wait for things to stabilize, then reset flag
      Vue.nextTick(() => this.setHaveChanges(false))
    }
  }

  /** Handle draft dissolution and return the resources for assignment. */
  private async handleDraftDissolution (): Promise<DissolutionResourceIF> {
    // ensure user is authorized to use this business
    await this.fetchAuthorizations(this.getBusinessId).then(response => {
      if (!response.data.roles || response.data.roles.length === 0) {
        this.accountAuthorizationDialog = true
        throw new Error('Auth error: inaccessible entity')
      }
    }).catch(error => {
      this.accountAuthorizationDialog = true
      throw error // go to catch()
    })

    // fetch draft filing
    let draftFiling = await this.fetchDraftDissolution()

    // if there is an existing filing, check if it is in a valid state to be edited
    if (draftFiling) {
      this.invalidDissolutionDialog = this.hasInvalidFilingState(draftFiling)
      if (this.invalidDissolutionDialog) return
    }

    // merge draft properties into empty filing so all properties are initialized
    const emptyFiling = this.buildDissolutionFiling()
    draftFiling = { ...emptyFiling.filing, ...draftFiling }

    // parse draft filing into the store
    if (draftFiling) {
      this.parseDissolutionDraft(draftFiling)
    }

    // return the resources
    return DissolutionResources.find(x => x.entityType === this.getEntityType)
  }

  /** Handle draft incorporation and return the resources for assignment. */
  private async handleDraftIncorporation (): Promise<IncorporationResourceIF> {
    // ensure user is authorized to use this IA
    await this.checkAuth().catch(error => {
      console.log('Auth error =', error) // eslint-disable-line no-console
      this.accountAuthorizationDialog = true
      throw error // go to catch()
    })

    // fetch draft filing
    let draftFiling = await this.fetchDraftIA()

    // if there is an existing filing, check if it is in a valid state to be edited
    if (draftFiling) {
      this.invalidIncorporationApplicationDialog = this.hasInvalidFilingState(draftFiling)
      if (this.invalidIncorporationApplicationDialog) return
    }

    // merge draft properties into empty filing so all properties are initialized
    const emptyFiling = this.buildIncorporationFiling()
    draftFiling = { ...emptyFiling.filing, ...draftFiling }

    // parse draft filing into the store
    if (draftFiling) {
      this.parseIncorporationsDraft(draftFiling)
    }

    // verify nameRequest object
    const nameRequest = draftFiling?.incorporationApplication?.nameRequest
    if (!nameRequest) throw new Error('missing Name Request object')

    // Fetches and validates the NR and sets the data to the store. This method is different
    // from the validateNameRequest method in Actions.vue. This method sets the data to
    // the store shows a specific message for different invalid states and redirection is to the
    // Filings Dashboard.
    if (nameRequest?.nrNumber) {
      await this.processNameRequest(draftFiling)
    }

    // return the resources
    return IncorporationResources.find(x => x.entityType === this.getEntityType)
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
        console.log('NR is not valid') // eslint-disable-line no-console
        this.nameRequestInvalidType = NameRequestStates.INVALID
        this.nameRequestInvalidErrorDialog = true
        return
      }

      // ensure types match
      if (this.nrTypeToEntityType(nrResponse) !== this.getEntityType) {
        console.log('NR type doesn\'t match entity type') // eslint-disable-line no-console
        this.nameRequestInvalidType = NameRequestStates.INVALID
        this.nameRequestInvalidErrorDialog = true
        return
      }

      // ensure NR is consumable
      const state = this.getNrState(nrResponse)
      if (state !== NameRequestStates.APPROVED && state !== NameRequestStates.CONDITIONAL) {
        console.log('NR is not consumable') // eslint-disable-line no-console
        this.nameRequestInvalidType = state || NameRequestStates.INVALID
        this.nameRequestInvalidErrorDialog = true
        return
      }

      // if we get this far, the NR is good to go!
      const nameRequestState = this.generateNameRequestState(nrResponse, filing.Id)
      this.setNameRequestState(nameRequestState)
    } catch (error) {
      // errors should be handled above
      console.error('Unhandled error in processNameRequest() =', error) // eslint-disable-line no-console
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

  /** Gets user info and stores user's email, first name and last name. */
  private async getSaveUserInfo (): Promise<any> {
    // NB: will throw if API error
    const userInfo = await AuthServices.fetchUserInfo()

    if (this.isDissolutionFiling) {
      let { contacts, folioNumber } = await AuthServices.fetchAuthInfo(this.getBusinessId)
      userInfo.contacts = contacts
      this.setAccountFolio(folioNumber)
    }
    if (!userInfo) throw new Error('Invalid user info')

    if (userInfo.contacts?.length > 0 && userInfo.contacts[0].email) {
      // this is a BCSC user
      this.setUserEmail(userInfo.contacts[0].email)
    } else if (userInfo.email) {
      // this is an IDIR user
      this.setUserEmail(userInfo.email)
    } else {
      throw new Error('Invalid user email')
    }

    if (userInfo.contacts?.length > 0 && userInfo.contacts[0].phone) {
      // this is a BCSC user
      this.setUserPhone(userInfo.contacts[0].phone)
    } else if (userInfo.phone) {
      // this is an IDIR user
      this.setUserPhone(userInfo.phone)
    } else {
      console.log('Invalid user phone')
    }

    if (!userInfo.firstname) throw new Error('Invalid user first name')
    if (!userInfo.lastname) throw new Error('Invalid user last name')

    this.setUserFirstName(userInfo.firstname)
    this.setUserLastName(userInfo.lastname)
    this.setUserKeycloakGuid(userInfo.keycloakGuid)

    return userInfo
  }

  /** Gets account info and stores it. */
  private async getSaveAccountInfo (): Promise<any> {
    const currentAccount = sessionStorage.getItem(SessionStorageKeys.CurrentAccount)
    if (!currentAccount) throw new Error('Invalid current account')

    const currentAccountParsed = JSON.parse(currentAccount)
    if (!currentAccountParsed) throw new Error('Invalid account info')

    const accountInfo: AccountInformationIF = {
      accountType: currentAccountParsed.accountType,
      id: currentAccountParsed.id,
      label: currentAccountParsed.label,
      type: currentAccountParsed.type
    }
    this.setAccountInformation(accountInfo)

    return currentAccountParsed
  }

  /** Gets org info and stores user's address. */
  private async getSaveOrgInfo (orgId: number): Promise<any> {
    if (!orgId) throw new Error('Invalid org id')

    // NB: will throw if API error
    const orgInfo = await AuthServices.fetchOrgInfo(orgId)
    if (!orgInfo) throw new Error('Invalid org info')

    const mailingAddress = orgInfo.mailingAddress
    if (!mailingAddress) throw new Error('Invalid mailing address')

    const userAddress: AddressIF = {
      addressCity: mailingAddress.city,
      addressCountry: mailingAddress.country,
      addressRegion: mailingAddress.region,
      postalCode: mailingAddress.postalCode,
      streetAddress: mailingAddress.street,
      streetAddressAdditional: mailingAddress.streetAdditional
    }
    this.setUserAddress(userAddress)

    if (sessionStorage.getItem(SessionStorageKeys.CurrentAccount)) {
      const accountInfo = JSON.parse(sessionStorage.getItem(SessionStorageKeys.CurrentAccount))
      this.setAccountInformation(accountInfo)
    }

    return orgInfo
  }

  /** Updates Launch Darkly with current user info. */
  private async updateLaunchDarkly (userInfo: any): Promise<void> {
    // since username is unique, use it as the user key
    const key: string = userInfo.username
    const email: string = userInfo.contacts[0]?.email || userInfo.email
    const firstName: string = userInfo.firstname
    const lastName: string = userInfo.lastname
    // remove leading { and trailing } and tokenize string
    const custom: any = { roles: userInfo.roles?.slice(1, -1).split(',') }

    await updateLdUser(key, email, firstName, lastName, custom)
  }

  /** Gets authorizations from Auth API, verifies roles, and stores them. */
  private async checkAuth (): Promise<any> {
    // NB: will throw if API error
    const authRoles = await AuthServices.fetchNrAuthorizations(this.getTempId)
    // NB: roles array may contain 'view', 'edit', 'staff' or nothing
    if (authRoles && authRoles.length > 0) {
      this.setAuthRoles(authRoles)
    } else {
      throw new Error('Invalid auth roles')
    }
  }

  /** Called when $route property changes. Used to init app. */
  @Watch('$route', { immediate: true })
  private async onRouteChanged (): Promise<void> {
    const isSigninRoute = (this.$route.name === RouteNames.SIGN_IN)
    const isSignoutRoute = (this.$route.name === RouteNames.SIGN_OUT)

    // don't init if we are still on signin or signout route
    if (!isSigninRoute && !isSignoutRoute) {
      await this.assignIdentifier()
      this.setCurrentStep(this.$route.meta?.step)
      await this.startTokenService()

      // wait a moment for token to be available in session storage
      // and JS date to be fetched from server
      await Vue.nextTick()

      await this.fetchData(true)
    }

    if (this.$route.name === RouteNames.REVIEW_CONFIRM) {
      this.setShowErrors(true)
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
