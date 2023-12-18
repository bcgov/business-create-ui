<template>
  <v-app
    id="app"
    class="app-container"
  >
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

    <AccountContactMissingDialog
      attach="#app"
      :dialog="accountContactMissingDialog"
      @exit="goToDashboard(true)"
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

    <!-- FUTURE: pass actual filing name -->
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
      v-if="enableOldWebchat && getFilingType === FilingTypes.REGISTRATION"
      :axios="axios"
      :isMobile="isMobile"
      :webChatReason="window['webChatReason']"
      :webChatStatusUrl="window['webChatStatusUrl']"
      :webChatUrl="window['webChatUrl']"
    />

    <!-- Display the Genesys WebMessage for SP/GP registrations only -->
    <GenesysWebMessage
      v-if="enableGenesysWebMessage && getFilingType === FilingTypes.REGISTRATION"
      :genesysURL="window['genesysUrl']"
      :environmentKey="window['genesysEnv']"
      :deploymentKey="window['genesysId']"
    />

    <!-- Initial Page Load Transition -->
    <transition name="fade">
      <div
        v-show="!haveData && !isErrorDialog"
        class="loading-container"
      >
        <div class="loading__content">
          <v-progress-circular
            color="primary"
            size="50"
            indeterminate
          />
          <div class="loading-msg">
            Loading
          </div>
        </div>
      </div>
    </transition>

    <SbcHeader />

    <!-- Alert banner -->
    <v-alert
      v-if="bannerText"
      tile
      dense
      type="warning"
    >
      <div
        class="mb-0 text-center colour-dk-text"
        v-html="bannerText"
      />
    </v-alert>

    <div class="app-body">
      <!-- Don't show page if an error dialog is displayed. -->
      <main v-if="!isErrorDialog">
        <Breadcrumb :breadcrumbs="breadcrumbs" />

        <div id="entity-info-wrapper">
          <v-container class="py-5">
            <EntityInfo />
          </v-container>
        </div>

        <v-container
          id="container-main"
          class="py-8"
        >
          <v-row>
            <v-col
              cols="12"
              lg="9"
            >
              <header>
                <h1>{{ getFilingName }}</h1>
              </header>
              <p
                v-if="isFirmDissolution"
                class="mt-4"
              >
                Confirm the following information, select the dissolution date and certify
                your dissolution before filing.
              </p>

              <Stepper
                v-if="isStepperView"
                class="mt-10"
              />

              <!-- Sign in and sign out components -->
              <Signin v-if="isRouteName(RouteNames.SIGN_IN)" />
              <Signout v-if="isRouteName(RouteNames.SIGN_OUT)" />

              <!-- Render components only after data is loaded. -->
              <template v-if="haveData">
                <!-- Use v-show so all pages (steps) are initialized/rendered. -->
                <component
                  :is="step.component"
                  v-for="step in getSteps"
                  v-show="isRouteName(step.to)"
                  :key="step.step"
                />
              </template>
            </v-col>

            <v-col
              cols="12"
              lg="3"
            >
              <!-- Render fee summary only after data is loaded. -->
              <aside v-if="haveData">
                <affix
                  relative-element-selector=".col-lg-9"
                  :offset="{ top: 100, bottom: -100 }"
                >
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

    <SbcFooter :aboutText="aboutText" />
  </v-app>
</template>

<script lang="ts">
// Libraries
import axios from 'axios'
import { Component, Mixins, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { useStore } from '@/store/store'
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
import SbcFeeSummary from 'sbc-common-components/src/components/SbcFeeSummary.vue'
import SbcFooter from 'sbc-common-components/src/components/SbcFooter.vue'
import SbcHeader from 'sbc-common-components/src/components/SbcHeader.vue'
import Stepper from '@/components/common/Stepper.vue'
import * as Dialogs from '@/dialogs'
import * as Views from '@/views'

// Mixins, interfaces, etc
import { CommonMixin, DateMixin, FilingTemplateMixin, NameRequestMixin } from '@/mixins'
import { AccountInformationIF, AddressIF, BreadcrumbIF, BusinessWarningIF, CompletingPartyIF,
  ConfirmDialogType, EmptyFees, FeesIF, FilingDataIF, NameRequestIF, OrgInformationIF, PartyIF, ResourceIF,
  StepIF } from '@/interfaces'
import { AmalgamationRegResources, DissolutionResources, IncorporationResources, RegistrationResources,
  RestorationResources, getEntityDashboardBreadcrumb, getMyBusinessRegistryBreadcrumb,
  getRegistryDashboardBreadcrumb, getSbcStaffDashboardBreadcrumb, getStaffDashboardBreadcrumb } from '@/resources'
import { AuthServices, LegalServices, PayServices } from '@/services/'

// Enums and Constants
import { EntityState, ErrorTypes, FilingCodes, FilingNames, FilingStatus, FilingTypes, NameRequestStates, RouteNames,
  StaffPaymentOptions } from '@/enums'
import { SessionStorageKeys } from 'sbc-common-components/src/util/constants'

@Component({
  components: {
    Actions,
    Breadcrumb,
    EntityInfo,
    GenesysWebMessage,
    SbcFeeSummary,
    SbcFooter,
    SbcHeader,
    Stepper,
    WebChat,
    ...Dialogs,
    ...Views
  }
})
export default class App extends Mixins(CommonMixin, DateMixin, FilingTemplateMixin, NameRequestMixin) {
  // Refs
  $refs!: {
    confirm: ConfirmDialogType
  }

  @Getter(useStore) getEntityIdentifier!: string
  @Getter(useStore) getFilingData!: Array<FilingDataIF>
  @Getter(useStore) getFilingName!: FilingNames
  @Getter(useStore) getFilingType!: FilingTypes
  @Getter(useStore) getHaveChanges!: boolean
  @Getter(useStore) getKeycloakRoles!: Array<string>
  @Getter(useStore) getOrgInformation!: OrgInformationIF
  @Getter(useStore) getSteps!: Array<StepIF>
  @Getter(useStore) getUserFirstName!: string
  @Getter(useStore) getUserLastName!: string
  @Getter(useStore) getUserEmail!: string
  @Getter(useStore) getUserPhone!: string
  @Getter(useStore) isAmalgamationFiling!: boolean
  @Getter(useStore) isDissolutionFiling!: boolean
  @Getter(useStore) isIncorporationFiling!: boolean
  @Getter(useStore) isMobile!: boolean
  @Getter(useStore) isRestorationFiling!: boolean
  @Getter(useStore) isSbcStaff!: boolean

  @Action(useStore) setAccountInformation!: (x: AccountInformationIF) => void
  @Action(useStore) setAdminFreeze!: (x: boolean) => void
  @Action(useStore) setBusinessId!: (x: string) => void
  @Action(useStore) setBusinessNumber!: (x: string) => void
  @Action(useStore) setCompletingParty!: (x: CompletingPartyIF) => void
  @Action(useStore) setCurrentDate!: (x: string) => void
  @Action(useStore) setCurrentJsDate!: (x: Date) => void
  @Action(useStore) setCurrentStep!: (x: number) => void
  @Action(useStore) setEntityState!: (x: EntityState) => void
  @Action(useStore) setFeePrices!: (x: Array<FeesIF>) => void
  @Action(useStore) setFilingType!: (x: FilingTypes) => void
  @Action(useStore) setGoodStanding!: (x: boolean) => void
  @Action(useStore) setIdentifier!: (x: string) => void
  @Action(useStore) setKeycloakGuid!: (x: string) => void
  @Action(useStore) setKeycloakRoles!: (x: Array<string>) => void
  @Action(useStore) setLastAddressChangeDate!: (x: string) => void
  @Action(useStore) setLastAnnualReportDate!: (x: string) => void
  @Action(useStore) setLastDirectorChangeDate!: (x: string) => void
  @Action(useStore) setNameRequest!: (x: NameRequestIF) => void
  @Action(useStore) setParties!: (x: Array<PartyIF>) => void
  @Action(useStore) setResources!: (x: ResourceIF) => void
  @Action(useStore) setUserAddress!: (x: AddressIF) => void
  @Action(useStore) setUserEmail!: (x: string) => void
  @Action(useStore) setUserFirstName!: (x: string) => void
  @Action(useStore) setUserLastName!: (x: string) => void
  @Action(useStore) setUserPhone!: (x: string) => void
  @Action(useStore) setHaveChanges!: (x: boolean) => void
  @Action(useStore) setOrgInformation!: (x: OrgInformationIF) => void
  @Action(useStore) setShowErrors!: (x: boolean) => void
  @Action(useStore) setTempId!: (x: string) => void
  @Action(useStore) setWarnings!: (x: Array<BusinessWarningIF>) => void
  @Action(useStore) setWindowWidth!: (x: number) => void

  // Local properties
  accountAuthorizationDialog = false
  accountContactMissingDialog = false
  fetchErrorDialog = false
  filingSurveyDialog = false
  invalidFilingDialog = false
  invalidRouteDialog = false
  paymentErrorDialog = false
  saveErrorDialog = false
  nameRequestInvalidErrorDialog = false
  nameRequestInvalidType = ''
  haveData = false
  saveErrors = []
  saveWarnings = []
  fileAndPayInvalidNameRequestDialog = false

  // Local constants
  readonly STAFF_ROLE = 'STAFF'
  readonly GOV_ACCOUNT_USER = 'GOV_ACCOUNT_USER'

  // declarations for template
  readonly RouteNames = RouteNames
  readonly FilingTypes = FilingTypes
  readonly axios = axios
  readonly window = window

  /** The Update Current JS Date timer id. */
  private updateCurrentJsDateId = null // may be number or NodeJS.Timeout

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
      this.accountContactMissingDialog ||
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
    const aboutApp = import.meta.env.ABOUT_APP
    const aboutSbc = import.meta.env.ABOUT_SBC
    return `${aboutApp}<br>${aboutSbc}`
  }

  /** Whether to use stepper view. */
  get isStepperView (): boolean {
    return !this.$route.meta.noStepper
  }

  /** The current IA survey id, or zero if empty. */
  get iaSurveyId (): number {
    return +sessionStorage.getItem('IA_SURVEY_ID')
  }

  /** Get banner text. */
  get bannerText (): string {
    const bannerText: string = GetFeatureFlag('banner-text')
    // remove spaces so that " " becomes falsy
    return bannerText?.trim() || null
  }

  /** Helper to check is the current route matches */
  isRouteName (routeName: RouteNames): boolean {
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
  goToManageBusinessDashboard (): void {
    this.fileAndPayInvalidNameRequestDialog = false
    const manageBusinessUrl = `${sessionStorage.getItem('AUTH_WEB_URL')}business`
    this.setHaveChanges(false)
    Navigate(manageBusinessUrl)
  }

  /** Called to navigate to entity's dashboard. */
  goToDashboard (force = false): void {
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
  launchFilingSurvey (): void {
    // safety check
    if (this.iaSurveyId > 0) {
      const url = `${sessionStorage.getItem('AUTH_WEB_URL')}?survey=${this.iaSurveyId}`
      this.window.open(url, '_blank', 'noreferrer')
    }
  }

  /** Called to update "do not show again" state. */
  doNotShowSurvey (doNotShow: boolean): void {
    // safety check
    if (this.iaSurveyId > 0) {
      if (doNotShow) {
        // save id of survey to hide
        localStorage.setItem('HIDE_SURVEY', this.iaSurveyId.toString())
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
  async fetchData (): Promise<void> {
    // reset errors in case this method is invoked more than once (ie, retry)
    this.resetFlags()

    // don't check FF during Vitest tests
    if (!this.isVitestRunning) {
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
          await this.handleDraftWithBusinessId(this.getBusinessId)
        }
        if (this.getTempId) {
          await this.handleDraftWithTempId(this.getTempId)
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

      // FUTURE: since we know what type of filing this is,
      // add staff check for certain filings (ie, restorations)

      // get user info
      const userInfo = await this.loadUserInfo().catch(error => {
        console.log('User info error =', error) // eslint-disable-line no-console
        if ([ErrorTypes.INVALID_USER_EMAIL, ErrorTypes.INVALID_USER_PHONE].includes(error.message)) {
          this.accountContactMissingDialog = true
        } else {
          this.accountAuthorizationDialog = true
        }
        throw error // go to catch()
      })

      // get Keycloak roles
      const keycloakRoles = await this.loadKeycloakRoles().catch(error => {
        console.log('Keycloak roles error =', error) // eslint-disable-line no-console
        this.accountAuthorizationDialog = true
        throw error // go to catch()
      })

      // update Launch Darkly
      await this.updateLaunchDarkly(userInfo, keycloakRoles).catch(error => {
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
          case FilingTypes.AMALGAMATION:
            this.$router.push(RouteNames.AMALG_REG_INFORMATION).catch(() => {})
            return
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
            certifiedBy: userInfo.firstname
              ? `${userInfo.firstname} ${userInfo.lastname}`
              : `${userInfo.lastname}`
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

  /**
   * Fetches draft Dissolution / Restoration and sets the resources.
   * (Only dissolutions/restorations have a Business ID.)
   */
  private async handleDraftWithBusinessId (businessId: string): Promise<void> {
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
        resources = DissolutionResources.find(x => x.entityType === this.getEntityType) as ResourceIF
        break
      case FilingTypes.RESTORATION:
        draftFiling = {
          ...this.buildRestorationFiling(),
          ...draftFiling
        }
        this.parseRestorationDraft(draftFiling)
        resources = RestorationResources.find(x => x.entityType === this.getEntityType) as ResourceIF
        break
      default:
        throw new Error(`handleDraftWithBusinessId(): invalid filing type = ${this.getFilingType}`)
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

  /**
   * Fetches draft Amalgamation / IA / Registration and sets the resources.
   * (Only amalgamations/incorporations/registrations have a Temp ID.)
   */
  private async handleDraftWithTempId (tempId: string): Promise<void> {
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
      case FilingTypes.AMALGAMATION:
        draftFiling = {
          ...this.buildAmalgamationFiling(),
          ...draftFiling
        }
        this.parseAmalgamationDraft(draftFiling)
        resources = AmalgamationRegResources.find(x => x.entityType === this.getEntityType) as ResourceIF
        break
      case FilingTypes.INCORPORATION_APPLICATION:
        draftFiling = {
          ...this.buildIncorporationFiling(),
          ...this.formatEmptyIncorporationApplication(draftFiling)
        }
        this.parseIncorporationDraft(draftFiling)
        resources = IncorporationResources.find(x => x.entityType === this.getEntityType) as ResourceIF
        break
      case FilingTypes.REGISTRATION:
        draftFiling = {
          ...this.buildRegistrationFiling(),
          ...this.formatEmptyRegistration(draftFiling)
        }
        this.parseRegistrationDraft(draftFiling)
        resources = RegistrationResources.find(x => x.entityType === this.getEntityType) as ResourceIF
        break
      default:
        throw new Error(`handleDraftWithTempId(): invalid filing type = ${this.getFilingType}`)
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
      const nrResponse = await LegalServices.fetchValidContactNr(nrNumber).catch(error => {
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
    this.accountContactMissingDialog = false
    this.fetchErrorDialog = false
    this.filingSurveyDialog = false
    this.paymentErrorDialog = false
    this.saveErrorDialog = false
    this.fileAndPayInvalidNameRequestDialog = false
    this.saveErrors = []
    this.saveWarnings = []
  }

  /**
   * Fetches user info, stores it, and returns it.
   * May also fetch and store auth info.
   */
  private async loadUserInfo (): Promise<any> {
    // fetch auth org info for dissolution/restoration only
    // do not set auth org/contact info for Restoration as it is likely to change
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

    // NB: will throw if API error
    const userInfo = await AuthServices.fetchUserInfo()
    if (!userInfo) throw new Error(ErrorTypes.INVALID_USER_INFO)

    if (userInfo.contacts?.length > 0 && userInfo.contacts[0].email) {
      // this is a BCSC user
      this.setUserEmail(userInfo.contacts[0].email)
    } else if (userInfo.email) {
      // this is an IDIR user
      this.setUserEmail(userInfo.email)
    } else if (userInfo.type !== this.STAFF_ROLE && userInfo.type !== this.GOV_ACCOUNT_USER) {
      throw new Error(ErrorTypes.INVALID_USER_EMAIL)
    }

    if (userInfo.contacts?.length > 0 && userInfo.contacts[0].phone) {
      // this is a BCSC user
      this.setUserPhone(userInfo.contacts[0].phone)
    } else if (userInfo.phone) {
      // this is an IDIR user
      this.setUserPhone(userInfo.phone)
    } else if (userInfo.type !== this.STAFF_ROLE && userInfo.type !== this.GOV_ACCOUNT_USER) {
      // not an error
      console.info('Invalid user phone') // eslint-disable-line no-console
    }

    if (!userInfo.lastname) throw new Error(ErrorTypes.INVALID_USER_LAST_NAME)

    this.setUserFirstName(userInfo.firstname)
    this.setUserLastName(userInfo.lastname)
    this.setKeycloakGuid(userInfo.keycloakGuid)

    return userInfo
  }

  /** Gets Keycloak roles, stores them, and returns them. */
  private async loadKeycloakRoles (): Promise<string[]> {
    const jwt = getJWT()
    const keycloakRoles = (jwt.roles || []) as Array<string>
    if (keycloakRoles.length < 1) throw new Error('Invalid Keycloak roles')
    this.setKeycloakRoles(keycloakRoles)
    return keycloakRoles

    /** Gets Keycloak JWT and parses it. */
    function getJWT (): any {
      // get KC token (JWT) from session storage
      const keycloakToken = sessionStorage.getItem(SessionStorageKeys.KeyCloakToken)
      if (!keycloakToken) throw new Error('Error getting Keycloak token')

      // decode and parse the JWT
      try {
        const base64Url = keycloakToken.split('.')[1]
        const base64 = decodeURIComponent(window.atob(base64Url).split('').map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        }).join(''))
        return JSON.parse(base64)
      } catch (error) {
        throw new Error('Error parsing JWT - ' + error)
      }
    }
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
   * Waits up to 5 sec for current account to be synced (typically by SbcHeader).
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

  /** Fetches org info and stores it and user's address. */
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
  private async updateLaunchDarkly (userInfo: any, keycloakRoles: string[]): Promise<void> {
    // since username is unique, use it as the user key
    const key: string = userInfo.username
    const email: string = userInfo.contacts[0]?.email || userInfo.email
    const firstName: string = userInfo.firstname
    const lastName: string = userInfo.lastname
    // store Keycloak roles in custom object
    const custom = { roles: keycloakRoles } as any

    await UpdateLdUser(key, email, firstName, lastName, custom)
  }

  /** Fetches and stores business info. */
  private async loadBusinessInfo (businessId: string): Promise<void> {
    const business = await LegalServices.fetchBusinessInfo(businessId).catch(() => {})

    if (!business) {
      throw new Error('Invalid business info')
    }

    // if (this.getBusinessId !== business.identifier) {
    //   throw new Error('Business identifier mismatch')
    // }

    // FUTURE: change this to a single setter/object?
    this.setAdminFreeze(business.adminFreeze)
    this.setLegalName(business.legalName)
    this.setEntityState(business.state)
    this.setBusinessNumber(business.taxId || null) // may be empty
    this.setIdentifier(business.identifier)
    this.setLastAnnualReportDate(business.lastAnnualReportDate) // may be empty
    this.setLastAddressChangeDate(business.lastAddressChangeDate) // may be empty
    this.setLastDirectorChangeDate(business.lastDirectorChangeDate) // may be empty
    this.setWarnings(Array.isArray(business.warnings) ? business.warnings : [])
    this.setGoodStanding(business.goodStanding)
    this.setBusinessStartDate(business.startDate)
  }

  /** Fetches authorizations and verifies roles. */
  private async checkAuth (id: string): Promise<any> {
    // NB: will throw if API error
    const authRoles = await AuthServices.fetchAuthorizations(id)

    // verify that array has at least one role
    // NB: roles array may contain 'view', 'edit', 'staff' or nothing
    if (!Array.isArray(authRoles) || authRoles.length < 1) {
      throw new Error('Invalid auth roles')
    }
  }

  /** Fetches and stores parties info . */
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
      this.isRouteName(RouteNames.AMALG_REG_REVIEW_CONFIRM) ||
      this.isRouteName(RouteNames.DISSOLUTION_REVIEW_CONFIRM) ||
      this.isRouteName(RouteNames.INCORPORATION_REVIEW_CONFIRM) ||
      this.isRouteName(RouteNames.REGISTRATION_REVIEW_CONFIRM) ||
      this.isRouteName(RouteNames.RESTORATION_REVIEW_CONFIRM)
    ) {
      this.setShowErrors(true)
    }
  }

  /** Whether the old webchat should be enabled. */
  get enableOldWebchat (): boolean {
    return !!GetFeatureFlag('enable-web-chat-boolean')
  }

  /** Whether the Genesys web message should be enabled. */
  get enableGenesysWebMessage (): boolean {
    return !!GetFeatureFlag('enable-genesys-web-message-boolean')
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
// override Vuetify's indentation of the ul
:deep(ul.fee-list) {
  padding-left: 0;
}
</style>
