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

    <InvalidFilingDialog
      attach="#app"
      :dialog="invalidFilingDialog"
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

    <FilingSurveyDialog
      attach="#app"
      :dialog="filingSurveyDialog"
      @no="filingSurveyDialog = false"
      @yes="filingSurveyDialog = false; launchFilingSurvey()"
      @doNotShow="doNotShowSurvey($event)"
    />

    <PaymentErrorDialog
      attach="#app"
      filingName="Application"
      :dialog="paymentErrorDialog"
      :errors="saveErrors"
      :warnings="saveWarnings"
      @exit="goToDashboard(true)"
      @okay="paymentErrorDialog = false"
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

    <!-- Display WebChat for SP/GP registrations only -->
    <WebChat
      v-if="getFilingType === FilingTypes.REGISTRATION"
      :axios="axios"
      :isMobile="isMobile"
      :webChatReason="window['webChatReason']"
      :webChatStatusUrl="window['webChatStatusUrl']"
      :webChatUrl="window['webChatUrl']"
    />

    <!-- Display the Genesys WebMessage for SP/GP registrations only -->
    <GenesysWebMessage
      v-if="getFilingType === FilingTypes.REGISTRATION"
      genesysURL="https://apps.cac1.pure.cloud/genesys-bootstrap/genesys.min.js"
      environmentKey="cac1"
      deploymentKey="42ed05f4-d545-436b-ba2c-94b66ed3396f"
    />

    <!-- Initial Page Load Transition -->
    <transition name="fade">
      <div class="loading-container" v-show="!haveData && !isErrorDialog">
        <div class="loading__content">
          <v-progress-circular color="primary" size="50" indeterminate />
          <div class="loading-msg">Loading</div>
        </div>
      </div>
    </transition>

    <SbcHeader />

    <PaySystemAlert />

    <div class="app-body">
      <!-- Don't show page if an error dialog is displayed. -->
      <main v-if="!isErrorDialog">
        <Breadcrumb :breadcrumbs="breadcrumbs" />

        <div id="entity-info-wrapper">
          <v-container class="py-5">
            <EntityInfo />
          </v-container>
        </div>

        <v-container id="container-main" class="py-8">
          <v-row>
            <v-col cols="12" lg="9">
              <header>
                <h1>{{ getFilingName }}</h1>
              </header>
              <p class="mt-4" v-if="isFirmDissolution">
                Confirm the following information, select the dissolution date and certify
                your dissolution before filing.
              </p>

              <Stepper class="mt-10" v-if="isStepperView" />

              <!-- Sign in and sign out components -->
              <Signin v-if="isRouteName(RouteNames.SIGN_IN)" />
              <Signout v-if="isRouteName(RouteNames.SIGN_OUT)" />

              <!-- Render components only after data is loaded. -->
              <template v-if="haveData">
                <!-- Use v-show so all pages (steps) are initialized/rendered. -->
                <component
                  v-for="step in getSteps"
                  v-show="isRouteName(step.to)"
                  :is="step.component"
                  :key="step.step"
                />
              </template>
            </v-col>

            <v-col cols="12" lg="3">
              <!-- Render fee summary only after data is loaded. -->
              <aside v-if="haveData">
                <affix relative-element-selector=".col-lg-9" :offset="{ top: 100, bottom: -100 }">
                  <SbcFeeSummary
                    :filingData="feeFilingData"
                    :payURL="payApiUrl"
                    :filingLabel="filingLabel"
                  />
                </affix>
              </aside>
            </v-col>
          </v-row>
        </v-container>

        <div id="actions-wrapper">
          <v-container class="py-8">
            <Actions
              :key="$route.path"
              @goToDashboard="goToDashboard()"
            />
          </v-container>
        </div>
      </main>
    </div>

    <SbcFooter :aboutText=aboutText />
  </v-app>
</template>

<script lang="ts">
// Libraries
import Vue from 'vue'
import axios from 'axios'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import * as Sentry from '@sentry/browser'
import { GetFeatureFlag, UpdateLdUser, Navigate, Sleep } from '@/utils'

// Components, dialogs and views
import Actions from '@/components/common/Actions.vue'
import { Breadcrumb } from '@bcrs-shared-components/breadcrumb'
import { GenesysWebMessage } from '@bcrs-shared-components/genesys-web-message'
import { WebChat } from '@bcrs-shared-components/web-chat'
import EntityInfo from '@/components/common/EntityInfo.vue'
import PaySystemAlert from 'sbc-common-components/src/components/PaySystemAlert.vue'
import SbcFeeSummary from 'sbc-common-components/src/components/SbcFeeSummary.vue'
import SbcFooter from 'sbc-common-components/src/components/SbcFooter.vue'
import SbcHeader from 'sbc-common-components/src/components/SbcHeader.vue'
import Stepper from '@/components/common/Stepper.vue'
import * as Dialogs from '@/dialogs'
import * as Views from '@/views'

// Mixins, interfaces, etc
import { CommonMixin, DateMixin, FilingTemplateMixin, NameRequestMixin } from '@/mixins'
import { AccountInformationIF, ActionBindingIF, AddressIF, BreadcrumbIF, BusinessIF, CompletingPartyIF,
  ConfirmDialogType, EmptyFees, FilingDataIF, OrgInformationIF, ResourceIF, StepIF } from '@/interfaces'
import { DissolutionResources, IncorporationResources, RegistrationResources, RestorationResources,
  getEntityDashboardBreadcrumb, getMyBusinessRegistryBreadcrumb, getRegistryDashboardBreadcrumb,
  getSbcStaffDashboardBreadcrumb, getStaffDashboardBreadcrumb } from '@/resources'
import { AuthServices, LegalServices, PayServices } from '@/services/'

// Enums and Constants
import { FilingCodes, FilingNames, FilingStatus, FilingTypes, NameRequestStates, RouteNames, StaffPaymentOptions }
  from '@/enums'
import { CorpTypeCd } from '@bcrs-shared-components/enums/'
import { SessionStorageKeys } from 'sbc-common-components/src/util/constants'

@Component({
  components: {
    Actions,
    Breadcrumb,
    EntityInfo,
    GenesysWebMessage,
    PaySystemAlert,
    SbcFeeSummary,
    SbcFooter,
    SbcHeader,
    Stepper,
    WebChat,
    ...Dialogs,
    ...Views
  },
  mixins: [
    CommonMixin,
    DateMixin,
    FilingTemplateMixin,
    NameRequestMixin
  ]
})
export default class App extends Vue {
  // Refs
  $refs!: {
    confirm: ConfirmDialogType
  }

  @Getter getEntityIdentifier!: string
  @Getter getHaveChanges!: boolean
  @Getter getFilingData!: Array<FilingDataIF>
  @Getter getFilingType!: FilingTypes
  @Getter getFilingName!: FilingNames
  @Getter isDissolutionFiling!: boolean
  @Getter isRestorationFiling!: boolean
  @Getter isIncorporationFiling!: boolean
  @Getter getSteps!: Array<StepIF>
  @Getter isSbcStaff!: boolean
  @Getter getUserFirstName!: string
  @Getter getUserLastName!: string
  @Getter getUserPhone!: string
  @Getter getUserEmail!: string
  @Getter getOrgInformation!: OrgInformationIF
  @Getter isMobile!: boolean

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
  @Action setHaveChanges!: ActionBindingIF
  @Action setAccountInformation!: ActionBindingIF
  @Action setOrgInformation!: ActionBindingIF
  @Action setTempId!: ActionBindingIF
  @Action setShowErrors!: ActionBindingIF
  @Action setFeePrices!: ActionBindingIF
  @Action setFilingType!: ActionBindingIF
  @Action setNameRequest!: ActionBindingIF
  @Action setNameRequestApprovedName!: ActionBindingIF
  @Action setCompletingParty!: ActionBindingIF
  @Action setParties!: ActionBindingIF
  @Action setAdminFreeze!: ActionBindingIF
  @Action setBusinessNumber!: ActionBindingIF
  @Action setIdentifier!: ActionBindingIF
  @Action setEntityName!: ActionBindingIF
  @Action setEntityState!: ActionBindingIF
  @Action setEntityFoundingDate!: ActionBindingIF
  @Action setLastAnnualReportDate!: ActionBindingIF
  @Action setLastAddressChangeDate!: ActionBindingIF
  @Action setLastDirectorChangeDate!: ActionBindingIF
  @Action setWarnings!: ActionBindingIF
  @Action setGoodStanding!: ActionBindingIF
  @Action setWindowWidth!: ActionBindingIF

  // Local properties
  protected accountAuthorizationDialog = false
  protected fetchErrorDialog = false
  protected filingSurveyDialog = false
  protected invalidFilingDialog = false
  protected invalidRouteDialog = false
  protected paymentErrorDialog = false
  protected saveErrorDialog = false
  protected nameRequestInvalidErrorDialog = false
  protected nameRequestInvalidType = ''
  protected haveData = false
  protected saveErrors = []
  protected saveWarnings = []
  protected fileAndPayInvalidNameRequestDialog = false

  // Local constants
  readonly STAFF_ROLE = 'STAFF'
  readonly GOV_ACCOUNT_USER = 'GOV_ACCOUNT_USER'

  // declarations for template
  readonly RouteNames = RouteNames
  readonly FilingTypes = FilingTypes
  readonly axios = axios
  readonly window = window

  /** The Update Current JS Date timer id. */
  private updateCurrentJsDateId = 0

  /** The route breadcrumbs list. */
  get breadcrumbs (): Array<BreadcrumbIF> {
    const crumbs: Array<BreadcrumbIF> = [
      getEntityDashboardBreadcrumb(),
      {
        text: this.getFilingName,
        to: { name: this.$route.name }
      }
    ]

    // set base crumbs based on user type
    if (this.isSbcStaff) {
      // set SbcStaffDashboard as Home crumb
      crumbs.unshift(getSbcStaffDashboardBreadcrumb())
    } else if (this.isRoleStaff) {
      // set StaffDashboard as Home crumb
      crumbs.unshift(getStaffDashboardBreadcrumb())
    } else {
      // set Home and Dashboard crumbs
      crumbs.unshift(getRegistryDashboardBreadcrumb(), getMyBusinessRegistryBreadcrumb())
    }

    return crumbs
  }

  /** Data for fee summary component. */
  get feeFilingData (): Array<FilingDataIF> {
    let filingData = [] as Array<FilingDataIF>

    if (this.getFilingData) {
      filingData = cloneDeep(this.getFilingData)

      if (this.isTypeCoop && this.isDissolutionFiling) {
        const specialResolutionFilingData =
          filingData.find(x => x.filingTypeCode === FilingCodes.SPECIAL_RESOLUTION)

        if (this.getStaffPaymentStep.staffPayment.option === StaffPaymentOptions.NO_FEE) {
          filingData.forEach(x => { x.waiveFees = true })
        } else if (specialResolutionFilingData) {
          // update futureEffective/priority on Special Resolution data only
          specialResolutionFilingData.futureEffective = this.getEffectiveDateTime.isFutureEffective
          specialResolutionFilingData.priority = this.getStaffPaymentStep.staffPayment.isPriority
        }
      } else if (filingData[0]) {
        // avoid waiveFee with futureEffective/priority in the same request
        if (this.getStaffPaymentStep.staffPayment.option === StaffPaymentOptions.NO_FEE) {
          filingData[0].waiveFees = true
        } else {
          filingData[0].futureEffective = this.getEffectiveDateTime.isFutureEffective
          filingData[0].priority = this.getStaffPaymentStep.staffPayment.isPriority
        }
      }
    }

    return filingData
  }

  /** The URL of the Pay API. */
  get payApiUrl (): string {
    return sessionStorage.getItem('PAY_API_URL')
  }

  /** True if an error dialog is displayed. */
  get isErrorDialog (): boolean {
    return (
      this.accountAuthorizationDialog ||
      this.nameRequestInvalidErrorDialog ||
      this.fetchErrorDialog ||
      this.filingSurveyDialog ||
      this.invalidFilingDialog ||
      this.invalidRouteDialog ||
      this.paymentErrorDialog ||
      this.saveErrorDialog ||
      this.fileAndPayInvalidNameRequestDialog
    )
  }

  /** Whether the current filing is a firm dissolution. */
  get isFirmDissolution (): boolean {
    return (this.isTypeFirm && this.isDissolutionFiling)
  }

  /** The fee summary filing label. */
  get filingLabel (): string {
    // text override for firm dissolutions
    return this.isFirmDissolution ? 'Dissolution' : null
  }

  /** The About text. */
  get aboutText (): string {
    return process.env.ABOUT_TEXT
  }

  /** The header name for the Save Error Dialog. */
  get saveErrorDialogName (): string {
    switch (this.getFilingType) {
      case FilingTypes.INCORPORATION_APPLICATION: return 'Application'
      case FilingTypes.REGISTRATION: return 'Registration'
      case FilingTypes.RESTORATION: return 'Restoration'
      case FilingTypes.DISSOLUTION: return 'Filing'
    }
  }

  /** Whether to use stepper view. */
  get isStepperView (): boolean {
    return !this.$route.meta.noStepper
  }

  /** The current IA survey id, or zero if empty. */
  get iaSurveyId (): number {
    return +sessionStorage.getItem('IA_SURVEY_ID')
  }

  /** Helper to check is the current route matches */
  private isRouteName (routeName: RouteNames): boolean {
    return (this.$route.name === routeName)
  }

  /** Called when component is created. */
  async created (): Promise<void> {
    // update Current Js Date now and every 1 minute thereafter
    // FUTURE: use a web worker to fetch once an hour instead?
    await this.updateCurrentJsDate()
    this.updateCurrentJsDateId = setInterval(this.updateCurrentJsDate, 60000)

    // add handler to prompt user if there are changes, before unloading this page
    window.onbeforeunload = (event) => {
      if (this.getHaveChanges) {
        event.preventDefault()
        // NB: custom text is not supported in all browsers
        event.returnValue = 'You have unsaved changes. Do you want to exit?'
      }
    }

    // listen for changes to the window size to create responsive reactivity
    window.addEventListener('resize', () => this.setWindowWidth(window.innerWidth))

    // listen for save error event
    this.$root.$on('save-error-event', async error => {
      // save errors/warnings
      this.saveErrors = error?.response?.data?.errors || []
      this.saveWarnings = error?.response?.data?.warnings || []

      if (error?.response?.status === StatusCodes.PAYMENT_REQUIRED) {
        // changes were saved if a 402 is received, so clear flag
        this.setHaveChanges(false)
        this.paymentErrorDialog = true
      } else {
        console.log('Save error =', error) // eslint-disable-line no-console
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

    // init app
    this.onRouteChanged()
  }

  /** Fetches and stores the current JS date. */
  private async updateCurrentJsDate (): Promise<void> {
    const jsDate = await this.getServerDate()
    this.setCurrentJsDate(jsDate)
  }

  /** Called before component is destroyed. */
  beforeDestroy (): void {
    // stop Update Current Js Date timer
    clearInterval(this.updateCurrentJsDateId)

    // stop listening for save error event
    this.$root.$off('save-error-event')
    this.$root.$off('name-request-invalid-errort')
    this.$root.$off('name-request-retrieve-error')
  }

  /** Called to navigate to My Business Registry. */
  private goToManageBusinessDashboard (): void {
    this.fileAndPayInvalidNameRequestDialog = false
    const manageBusinessUrl = `${sessionStorage.getItem('AUTH_WEB_URL')}business`
    this.setHaveChanges(false)
    Navigate(manageBusinessUrl)
  }

  /** Called to navigate to entity's dashboard. */
  private goToDashboard (force = false): void {
    // check if there are no data changes
    if (!this.getHaveChanges || force) {
      // navigate to dashboard
      const dashboardUrl = sessionStorage.getItem('DASHBOARD_URL')
      Navigate(dashboardUrl + this.getEntityIdentifier)
      return
    }

    // open confirmation dialog and wait for response
    this.$refs.confirm.open(
      'Unsaved Changes',
      'You have unsaved changes. Do you want to exit?',
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
      // navigate to dashboard
      const dashboardUrl = sessionStorage.getItem('DASHBOARD_URL')
      Navigate(dashboardUrl + this.getEntityIdentifier)
    })
  }

  /** Opens Auth Web in a new tab with the survey query param. */
  protected launchFilingSurvey (): void {
    // safety check
    if (this.iaSurveyId > 0) {
      const url = `${sessionStorage.getItem('AUTH_WEB_URL')}?survey=${this.iaSurveyId}`
      this.window.open(url, '_blank', 'noreferrer')
    }
  }

  /** Called to update "do not show again" state. */
  protected doNotShowSurvey (doNotShow: boolean): void {
    // safety check
    if (this.iaSurveyId > 0) {
      if (doNotShow) {
        // save id of survey to hide
        localStorage.setItem('HIDE_SURVEY', this.iaSurveyId)
      } else {
        localStorage.removeItem('HIDE_SURVEY')
      }
    }
  }

  /** The list of completing parties. */
  private getCompletingParties (): CompletingPartyIF {
    let completingParty = null as CompletingPartyIF
    if (!this.isRoleStaff && !this.isSbcStaff) { // if not staff
      completingParty = {
        firstName: this.getUserFirstName,
        middleName: '',
        lastName: this.getUserLastName,
        mailingAddress: {
          addressCity: this.getOrgInformation?.mailingAddress.city,
          addressCountry: this.getOrgInformation?.mailingAddress.country,
          addressRegion: this.getOrgInformation?.mailingAddress.region,
          postalCode: this.getOrgInformation?.mailingAddress.postalCode,
          streetAddress: this.getOrgInformation?.mailingAddress.street,
          streetAddressAdditional: this.getOrgInformation?.mailingAddress.streetAdditional
        },
        email: this.getUserEmail,
        phone: this.getUserPhone
      }
    } else {
      // if staff role then set blank completing party
      completingParty = {
        firstName: '',
        lastName: '',
        mailingAddress: null
      }
    }

    return completingParty
  }

  /** Fetches user info, draft filing, NR data, etc. */
  private async fetchData (): Promise<void> {
    // reset errors in case this method is invoked more than once (ie, retry)
    this.resetFlags()

    // don't check FF during Jest tests
    if (!this.isJestRunning) {
      // check that current route matches a supported filing type
      const supportedFilings = await GetFeatureFlag('supported-filings')
      if (!supportedFilings?.includes(this.$route.meta.filingType)) {
        window.alert('This filing type is not available at the moment. Please check again later.')
        this.goToDashboard(true)
        return
      }
    }

    try {
      // set current date from "real time" date from server
      this.setCurrentDate(this.dateToYyyyMmDd(this.getCurrentJsDate))

      // load account information
      await this.loadAccountInformation().catch(error => {
        console.log('Account info error =', error) // eslint-disable-line no-console
        this.accountAuthorizationDialog = true
        throw error // go to catch()
      })

      // handle the filing according to whether we have a business id or temp id
      try {
        // safety checks
        if (this.getBusinessId && this.getTempId) throw new Error('Both business id and temp id exist')
        if (!this.getBusinessId && !this.getTempId) throw new Error('Neither business id nor temp id exist')

        if (this.getBusinessId) {
          // this should be a Dissolution or Restoration filing
          // (only dissolutions/restorations have a business id)
          await this.handleDissolutionOrRestoration(this.getBusinessId)
        }
        if (this.getTempId) {
          // this should be an Incorporation or Registration filing
          // (only incorporations/registrations have a temp id)
          await this.handleIaOrRegistration(this.getTempId)
        }
      } catch (error) {
        // Log exception to Sentry due to incomplete business data.
        // At this point the system doesn't know why it's incomplete.
        // Since it's not an expected behaviour, it is better to report it.
        Sentry.captureException(error)
        console.log('Fetch error =', error) // eslint-disable-line no-console
        // show fetch error dialog if there isn't another dialog showing
        this.fetchErrorDialog = !this.isErrorDialog
        throw error // go to catch()
      }

      // FUTURE:
      // by now, we know what type of filing this is
      // add staff check for certain filings (ie, restorations)

      // get user info
      const userInfo = await this.loadUserInfo().catch(error => {
        console.log('User info error =', error) // eslint-disable-line no-console
        this.accountAuthorizationDialog = true
        throw error // go to catch()
      })

      // update Launch Darkly
      await this.updateLaunchDarkly(userInfo).catch(error => {
        // just log the error -- no need to halt app
        console.log('Launch Darkly update error =', error) // eslint-disable-line no-console
      })

      // set completing party
      this.setCompletingParty(this.getCompletingParties())

      // load parties only for SP/GP businesses
      if (this.isTypeFirm && this.getBusinessId) {
        await this.loadPartiesInformation(this.getBusinessId)
      }

      // if user is on a route not valid for the current filing type
      // then try to re-route them
      if (this.$route.meta.filingType !== this.getFilingType) {
        switch (this.getFilingType) {
          case FilingTypes.DISSOLUTION:
            if (this.isTypeFirm) {
              this.$router.push(RouteNames.DISSOLUTION_FIRM).catch(() => {})
            } else {
              this.$router.push(RouteNames.DISSOLUTION_DEFINE_DISSOLUTION).catch(() => {})
            }
            return
          case FilingTypes.INCORPORATION_APPLICATION:
            this.$router.push(RouteNames.INCORPORATION_DEFINE_COMPANY).catch(() => {})
            return
          case FilingTypes.REGISTRATION:
            this.$router.push(RouteNames.REGISTRATION_DEFINE_BUSINESS).catch(() => {})
            return
          case FilingTypes.RESTORATION:
            this.$router.push(RouteNames.RESTORATION_BUSINESS_NAME).catch(() => {})
            return
          default:
            this.invalidRouteDialog = true
            throw new Error(`fetchData(): invalid filing type = ${this.getFilingType}`) // go to catch()
        }
      }

      // fetch and set the fee prices to display in the text
      // (currently used for dissolution filings only)
      const filingFees = []
      for (const filingData of this.getFilingData) {
        await PayServices.fetchFilingFees(filingData.filingTypeCode, filingData.entityType, true)
          .then(res => filingFees.push(res))
          .catch(error => {
            console.log('Failed to fetch filing fees, error =', error) // eslint-disable-line no-console
            // return a valid fees structure
            filingFees.push(cloneDeep(EmptyFees))
          })
      }
      this.setFeePrices(filingFees)

      // set current profile name to store for field pre population
      // do this only if we are not staff
      if (userInfo && !this.isRoleStaff && !this.isSbcStaff) {
        // pre-populate Certified By name
        this.setCertifyState(
          {
            valid: this.getCertifyState.valid,
            certifiedBy: `${userInfo.firstname} ${userInfo.lastname}`
          }
        )
      }

      // good to go - hide spinner and render components
      this.haveData = true
    } catch (error) {
      // errors should be handled above
      // just fall through to finally()
    } finally {
      // wait for things to stabilize, then reset flag
      this.$nextTick(() => this.setHaveChanges(false))
    }
  }

  /** Fetches draft Dissolution or Restoration and sets the resources. */
  private async handleDissolutionOrRestoration (businessId: string): Promise<void> {
    // ensure user is authorized to use this business
    await this.checkAuth(businessId).catch(error => {
      console.log('Auth error =', error) // eslint-disable-line no-console
      this.accountAuthorizationDialog = true
      throw error
    })

    // load business info
    await this.loadBusinessInfo(businessId)

    // fetch draft filing
    // NB: will throw if API error
    let draftFiling = await LegalServices.fetchFirstTask(businessId)

    this.setFilingType(draftFiling.header.name)

    // check if filing is in a valid state to be edited
    this.invalidFilingDialog = !this.hasValidFilingState(draftFiling)
    if (this.invalidFilingDialog) return null

    // parse draft filing into the store and get the resources
    let resources: ResourceIF
    switch (this.getFilingType) {
      case FilingTypes.DISSOLUTION:
        draftFiling = {
          ...this.buildDissolutionFiling(),
          ...draftFiling
        }
        this.parseDissolutionDraft(draftFiling)
        resources = DissolutionResources.find(x => x.entityType === this.getEntityType)
        break
      case FilingTypes.RESTORATION:
        draftFiling = {
          ...this.buildRestorationFiling(),
          ...draftFiling
        }
        this.parseRestorationDraft(draftFiling)
        resources = RestorationResources.find(x => x.entityType === this.getEntityType)
        break
      default:
        throw new Error(`handleDissolutionOrRestoration(): invalid filing type = ${this.getFilingType}`)
    }

    // set the resources
    if (!resources) throw new Error(`Invalid ${this.getEntityType} resources`)
    this.setResources(resources)

    // Fetch and validate the NR and set the data to the store. This method is different
    // from the validateNameRequest method in Actions.vue. This method sets the data to
    // the store shows a specific message for different invalid states and redirection is
    // to the Filings Dashboard.
    const nrNumber = draftFiling[draftFiling.header?.name]?.nameRequest?.nrNumber
    if (nrNumber) {
      await this.processNameRequest(draftFiling)
    }
  }

  /** Fetches draft IA or Registration and sets the resources. */
  private async handleIaOrRegistration (tempId: string): Promise<void> {
    // ensure user is authorized to use this IA
    await this.checkAuth(tempId).catch(error => {
      console.log('Auth error =', error) // eslint-disable-line no-console
      this.accountAuthorizationDialog = true
      throw error
    })

    // fetch draft filing
    // NB: will throw if API error
    let draftFiling = await LegalServices.fetchFirstOrOnlyFiling(tempId)

    this.setFilingType(draftFiling.header.name)

    // check if filing is in a valid state to be edited
    this.invalidFilingDialog = !this.hasValidFilingState(draftFiling)
    if (this.invalidFilingDialog) return null

    // parse draft filing into the store and get the resources
    let resources: ResourceIF
    switch (this.getFilingType) {
      case FilingTypes.INCORPORATION_APPLICATION:
        draftFiling = {
          ...this.buildIncorporationFiling(),
          ...this.formatEmptyIncorporationApplication(draftFiling)
        }
        this.parseIncorporationDraft(draftFiling)
        resources = IncorporationResources.find(x => x.entityType === this.getEntityType)
        break
      case FilingTypes.REGISTRATION:
        draftFiling = {
          ...this.buildRegistrationFiling(),
          ...this.formatEmptyRegistration(draftFiling)
        }
        this.parseRegistrationDraft(draftFiling)
        resources = RegistrationResources.find(x => x.entityType === this.getEntityType)
        break
      default:
        throw new Error(`handleIaOrRegistration(): invalid filing type = ${this.getFilingType}`)
    }

    // set the resources
    if (!resources) throw new Error(`Invalid ${this.getEntityType} resources`)
    this.setResources(resources)

    // verify nameRequest object
    const nameRequest = draftFiling[draftFiling.header?.name]?.nameRequest
    if (!nameRequest) throw new Error('Missing Name Request object')

    // Fetch and validate the NR and set the data to the store. This method is different
    // from the validateNameRequest method in Actions.vue. This method sets the data to
    // the store shows a specific message for different invalid states and redirection is
    // to the Filings Dashboard.
    if (nameRequest?.nrNumber) {
      await this.processNameRequest(draftFiling)
    }
  }

  /** Used to check if the filing is in a valid state for changes. */
  private hasValidFilingState (filing: any): boolean {
    const filingStatus = filing?.header?.status
    return (filingStatus === FilingStatus.DRAFT)
  }

  /** Fetches NR and validates it. */
  private async processNameRequest (filing: any): Promise<void> {
    try {
      const nrNumber = filing[filing.header?.name].nameRequest.nrNumber

      // fetch NR data
      const nrResponse = await LegalServices.fetchNameRequest(nrNumber).catch(error => {
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
      const error = this.isNrInvalid(nrResponse)
      if (error) {
        console.log(error) // eslint-disable-line no-console
        this.nameRequestInvalidType = NameRequestStates.INVALID
        this.nameRequestInvalidErrorDialog = true
        return
      }

      // ensure types match
      if (nrResponse.legalType !== this.getEntityType) {
        console.log('NR legal type doesn\'t match entity type') // eslint-disable-line no-console
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

      // save the NR
      this.setNameRequest(nrResponse)

      // save the approved name
      const approvedName = this.getNrApprovedName(nrResponse)
      this.setNameRequestApprovedName(approvedName)
    } catch (error) {
      // errors should be handled above
      console.error('Unhandled error in processNameRequest() =', error) // eslint-disable-line no-console
    }
  }

  /** Resets all error flags/states. */
  private resetFlags (): void {
    this.haveData = false
    this.nameRequestInvalidErrorDialog = false
    this.invalidFilingDialog = false
    this.accountAuthorizationDialog = false
    this.fetchErrorDialog = false
    this.filingSurveyDialog = false
    this.paymentErrorDialog = false
    this.saveErrorDialog = false
    this.fileAndPayInvalidNameRequestDialog = false
    this.saveErrors = []
    this.saveWarnings = []
  }

  /** Gets user info and stores user's email, first name and last name. */
  private async loadUserInfo (): Promise<any> {
    // NB: will throw if API error
    const userInfo = await AuthServices.fetchUserInfo()

    // get auth org info for dissolution/restoration only
    // do not need to set auth org/contact info for Restoration as it is likely to change hence left empty
    // (this data is not available for an incorporation/registration)
    if (this.isDissolutionFiling) {
      const { contacts, folioNumber } = await AuthServices.fetchAuthInfo(this.getBusinessId)
      if (contacts?.length > 0) {
        this.setBusinessContact(contacts[0])
      }
      // set folio number from auth info
      // (for an incorporation, this is set in IncorporationDefineCompany.vue)
      // (for a registration, this is set in RegistrationDefineBusiness.vue)
      this.setFolioNumber(folioNumber)
    }
    if (!userInfo) throw new Error('Invalid user info')

    if (userInfo.contacts?.length > 0 && userInfo.contacts[0].email) {
      // this is a BCSC user
      this.setUserEmail(userInfo.contacts[0].email)
    } else if (userInfo.email) {
      // this is an IDIR user
      this.setUserEmail(userInfo.email)
    } else if (userInfo.type !== this.STAFF_ROLE && userInfo.type !== this.GOV_ACCOUNT_USER) {
      throw new Error('Invalid user email')
    }

    if (userInfo.contacts?.length > 0 && userInfo.contacts[0].phone) {
      // this is a BCSC user
      this.setUserPhone(userInfo.contacts[0].phone)
    } else if (userInfo.phone) {
      // this is an IDIR user
      this.setUserPhone(userInfo.phone)
    } else if (userInfo.type !== this.STAFF_ROLE && userInfo.type !== this.GOV_ACCOUNT_USER) {
      console.info('Invalid user phone')
    }

    if (!userInfo.firstname) throw new Error('Invalid user first name')
    if (!userInfo.lastname) throw new Error('Invalid user last name')

    this.setUserFirstName(userInfo.firstname)
    this.setUserLastName(userInfo.lastname)
    this.setUserKeycloakGuid(userInfo.keycloakGuid)

    return userInfo
  }

  /**
   * Gets account info and stores it.
   * Among other things, this is how we find out if this is a staff account.
   */
  private async loadAccountInformation (): Promise<any> {
    const currentAccount = await this.getCurrentAccount()
    if (currentAccount) {
      const accountInfo: AccountInformationIF = {
        accountType: currentAccount.accountType,
        id: currentAccount.id,
        label: currentAccount.label,
        type: currentAccount.type
      }
      this.setAccountInformation(accountInfo)

      // get org info
      await this.loadOrgInfo(accountInfo?.id)
    }
  }

  /**
   * Gets current account from object in session storage.
   * Wait up to 5 sec for current account to be synced (typically by SbcHeader).
   */
  private async getCurrentAccount (): Promise<any> {
    let account = null
    for (let i = 0; i < 50; i++) {
      const currentAccount = sessionStorage.getItem(SessionStorageKeys.CurrentAccount)
      account = JSON.parse(currentAccount)
      if (account) break
      await Sleep(100)
    }
    return account
  }

  /** Gets org info and user's address and stores it. */
  private async loadOrgInfo (orgId: number): Promise<void> {
    if (!orgId) throw new Error('Invalid org id')

    // NB: will throw if API error
    const orgInfo = await AuthServices.fetchOrgInfo(orgId)
    if (!orgInfo) throw new Error('Invalid org info')

    this.setOrgInformation(orgInfo)

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

    await UpdateLdUser(key, email, firstName, lastName, custom)
  }

  /** Gets and stores business info. */
  private async loadBusinessInfo (businessId: string): Promise<void> {
    const response = await LegalServices.fetchBusinessInfo(businessId)

    const business = response?.data?.business as BusinessIF

    if (!business) {
      throw new Error('Invalid business info')
    }

    // if (this.getBusinessId !== business.identifier) {
    //   throw new Error('Business identifier mismatch')
    // }

    // FUTURE: change this to a single setter/object?
    this.setAdminFreeze(business.adminFreeze)
    this.setEntityName(business.legalName)
    this.setEntityState(business.state)
    this.setBusinessNumber(business.taxId || null) // may be empty
    this.setIdentifier(business.identifier)
    this.setLastAnnualReportDate(business.lastAnnualReportDate) // may be empty
    this.setLastAddressChangeDate(business.lastAddressChangeDate) // may be empty
    this.setLastDirectorChangeDate(business.lastDirectorChangeDate) // may be empty
    this.setWarnings(Array.isArray(business.warnings) ? business.warnings : [])
    this.setGoodStanding(business.goodStanding)
  }

  /** Gets authorizations from Auth API, verifies roles, and stores them. */
  private async checkAuth (id: string): Promise<any> {
    // NB: will throw if API error
    const authRoles = await AuthServices.fetchAuthorizations(id)

    // NB: roles array may contain 'view', 'edit', 'staff' or nothing
    if (authRoles && authRoles.length > 0) {
      this.setAuthRoles(authRoles)
    } else {
      throw new Error('Invalid auth roles')
    }
  }

  /** Gets and stores parties info . */
  private async loadPartiesInformation (businessId: string): Promise<any> {
    // NB: will throw if API error
    const parties = await LegalServices.fetchParties(businessId)

    if (parties?.parties?.length > 0) {
      this.setParties(parties.parties)
    } else {
      throw new Error('Invalid parties')
    }
  }

  /** Called initially and when $route property changes (ie, on step changes). */
  @Watch('$route', { immediate: false })
  private async onRouteChanged (): Promise<void> {
    // init only if we are not on signin or signout route
    if (!this.isRouteName(RouteNames.SIGN_IN) && !this.isRouteName(RouteNames.SIGN_OUT)) {
      this.setCurrentStep(this.$route.meta?.step || 1)

      // avoid duplicate assignment/fetches
      if (!this.haveData) {
        // assign the business id or temp id
        const id = this.$route.query?.id as string
        if (id?.startsWith('CP') || id?.startsWith('BC') || id?.startsWith('FM')) {
          this.setBusinessId(id)
        } else {
          this.setTempId(id)
        }

        // fetch the data
        await this.fetchData()

        // show survey dialog...
        // - if this is an Incorporation Application filing
        // - if the IA Survey ID is configured
        // - if the survey id hasn't been saved
        if (this.isIncorporationFiling) {
          if (this.iaSurveyId > 0) {
            const savedId = +localStorage.getItem('HIDE_SURVEY')
            if (savedId !== this.iaSurveyId) {
              this.filingSurveyDialog = true
            }
          }
        }
      }
    }

    // enable validation when review pages are shown
    if (
      this.isRouteName(RouteNames.DISSOLUTION_REVIEW_CONFIRM) ||
      this.isRouteName(RouteNames.INCORPORATION_REVIEW_CONFIRM) ||
      this.isRouteName(RouteNames.REGISTRATION_REVIEW_CONFIRM) ||
      this.isRouteName(RouteNames.RESTORATION_REVIEW_CONFIRM)
    ) {
      this.setShowErrors(true)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

// display drop-down menu on top of stepper and fee summary
:deep(.app-header) {
  z-index: 3;
}

#entity-info-wrapper,
#actions-wrapper {
  background-color: $BCgovInputBG;
}

aside {
  position: relative;
  z-index: 2; // on top of stepper
}

.vue-affix {
  width: 282px;
}
</style>
