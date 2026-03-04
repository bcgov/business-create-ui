<template>
  <v-app
    id="app"
    class="app-container"
  >
    <!-- Dialogs -->
    <InvalidFilingDialog
      attach="#app"
      :dialog="invalidFilingDialog"
      :type="invalidFilingError"
      @okay="invalidFilingDialog = false"
      @redirect="goToDashboard(true)"
    />

    <NameRequestErrorDialog
      attach="#app"
      :dialog="nameRequestErrorDialog"
      :error="nameRequestError"
      @okay="nameRequestErrorDialog = false"
    />

    <FileAndPayInvalidNameRequestDialog
      attach="#app"
      :dialog="fileAndPayInvalidNameRequestDialog"
      @okay="fileAndPayInvalidNameRequestDialog = false"
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

    <FilingNotExistDialog
      attach="#app"
      :dialog="filingNotExistDialog"
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
      v-if="enableOldWebchat && isRegistrationFiling"
      :axios="axios"
      :isMobile="isMobile"
      :webChatReason="window['webChatReason']"
      :webChatStatusUrl="window['webChatStatusUrl']"
      :webChatUrl="window['webChatUrl']"
    />

    <!-- Display the Genesys WebMessage for SP/GP registrations only -->
    <GenesysWebMessage
      v-if="enableGenesysWebMessage && isRegistrationFiling"
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
      id="alert-banner"
      class="pa-0 ma-0"
      tile
    >
      <div class="container d-flex align-center py-3">
        <v-icon
          class="color-dk-text"
          size="28px"
        >
          mdi-information
        </v-icon>

        <div
          class="color-dk-text dark-gray-links font-14 pl-2"
          v-html="bannerText"
        />
      </div>
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
                <h1>{{ header }}</h1>
              </header>

              <p
                v-if="getPageBlurb"
                class="mt-4 font-18"
              >
                {{ getPageBlurb }}
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
              <aside v-if="haveData && !isContinuationInAuthorization">
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
import { GetFeatureFlag, GetKeycloakRoles, IsAuthorized, UpdateLdUser, Navigate, Sleep } from '@/utils'

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
import { CommonMixin, DateMixin, ErrorMessageMixin, FilingTemplateMixin, NameRequestMixin } from '@/mixins'
import { AccountInformationIF, AddressIF, BreadcrumbIF, BusinessIF, BusinessWarningIF, CompletingPartyIF,
  ConfirmDialogType, EmptyFees, FeesIF, FilingDataIF, NameRequestIF, OrgInformationIF, PartyIF, ResourceIF,
  StepIF } from '@/interfaces'
import { AmalgamationRegResources, AmalgamationShortResources, ContinuationInResources,
  DissolutionResources, IncorporationResources, RegistrationResources, RestorationResources,
  getBusinessDashboardBreadcrumb, getMyBusinessRegistryBreadcrumb, getBcRegistriesDashboardBreadcrumb,
  getSbcStaffDashboardBreadcrumb, getStaffDashboardBreadcrumb } from '@/resources'
import { AuthServices, LegalServices, PayServices } from '@/services/'

// Enums and Constants
import { NameRequestStates, NrRequestActionCodes } from '@bcrs-shared-components/enums'
import { AuthorizationRoles, AuthorizedActions, EntityStates, ErrorTypes, FilingCodes, FilingNames,
  FilingStatus, FilingTypes, RouteNames, StaffPaymentOptions } from '@/enums'
import { SessionStorageKeys } from 'sbc-common-components/src/util/constants'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'
import { ContinuationInStepsAuthorization } from './resources/ContinuationIn/steps'

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
export default class App extends Mixins(
  CommonMixin, DateMixin, ErrorMessageMixin, FilingTemplateMixin, NameRequestMixin
) {
  // Refs
  $refs!: {
    confirm: ConfirmDialogType
  }

  @Getter(useStore) getAuthRoles!: Array<AuthorizationRoles>
  @Getter(useStore) getCurrentAccount!: AccountInformationIF
  @Getter(useStore) getEntityIdentifier!: string
  @Getter(useStore) getFilingData!: Array<FilingDataIF>
  @Getter(useStore) getFilingName!: FilingNames
  @Getter(useStore) getFilingStatus!: FilingStatus
  @Getter(useStore) getFilingType!: FilingTypes
  @Getter(useStore) getHaveChanges!: boolean
  @Getter(useStore) getKeycloakGuid!: string
  @Getter(useStore) getLoginSource!: string
  @Getter(useStore) getOrgInformation!: OrgInformationIF
  @Getter(useStore) getPageBlurb!: string
  @Getter(useStore) getSteps!: Array<StepIF>
  @Getter(useStore) getUserFirstname!: string
  @Getter(useStore) getUserLastname!: string
  @Getter(useStore) getUserEmail!: string
  @Getter(useStore) getUserPhone!: string
  @Getter(useStore) isAmalgamationFiling: boolean
  // @Getter(useStore) isAmalgamationFilingHorizontal!: boolean
  // @Getter(useStore) isAmalgamationFilingRegular!: boolean
  // @Getter(useStore) isAmalgamationFilingVertical!: boolean
  @Getter(useStore) isAuthorizationStatus!: boolean
  // @Getter(useStore) isContinuationInAuthorization!: boolean
  @Getter(useStore) isContinuationInFiling!: boolean
  @Getter(useStore) isDissolutionFiling!: boolean
  @Getter(useStore) isFirmDissolutionFiling!: boolean
  @Getter(useStore) isIncorporationFiling!: boolean
  @Getter(useStore) isOtherDissolutionFiling!: boolean
  @Getter(useStore) isRegistrationFiling!: boolean
  @Getter(useStore) isRestorationFiling!: boolean
  @Getter(useStore) isMobile!: boolean

  @Action(useStore) setAuthRoles!: (x: Array<AuthorizationRoles>) => void
  @Action(useStore) setAdminFreeze!: (x: boolean) => void
  @Action(useStore) setAlternateName!: (x: string) => void
  @Action(useStore) setAuthorizedActions!: (x: Array<AuthorizedActions>) => void
  @Action(useStore) setBusinessId!: (x: string) => void
  @Action(useStore) setBusinessNumber!: (x: string) => void
  @Action(useStore) setCompletingParty!: (x: CompletingPartyIF) => void
  @Action(useStore) setCurrentAccount!: (x: AccountInformationIF) => void
  @Action(useStore) setCurrentDate!: (x: string) => void
  @Action(useStore) setCurrentJsDate!: (x: Date) => void
  @Action(useStore) setCurrentStep!: (x: number) => void
  @Action(useStore) setEntityState!: (x: EntityStates) => void
  @Action(useStore) setFeePrices!: (x: Array<FeesIF>) => void
  @Action(useStore) setFilingStatus!: (x: FilingStatus) => void
  @Action(useStore) setFilingType!: (x: FilingTypes) => void
  @Action(useStore) setGoodStanding!: (x: boolean) => void
  @Action(useStore) setIdentifier!: (x: string) => void
  @Action(useStore) setLastAddressChangeDate!: (x: string) => void
  @Action(useStore) setLastAnnualReportDate!: (x: string) => void
  @Action(useStore) setLastDirectorChangeDate!: (x: string) => void
  // @Action(useStore) setNameRequest!: (x: NameRequestIF) => void
  @Action(useStore) setParties!: (x: Array<PartyIF>) => void
  // @Action(useStore) setResources!: (x: ResourceIF) => void
  @Action(useStore) setUserInfo!: (x: any) => void
  @Action(useStore) setUserAddress!: (x: AddressIF) => void
  @Action(useStore) setUserEmail!: (x: string) => void
  @Action(useStore) setUserPhone!: (x: string) => void
  @Action(useStore) setHaveChanges!: (x: boolean) => void
  // @Action(useStore) setOfficeAddresses!: (x: RegisteredRecordsAddressesIF) => void
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
  filingNotExistDialog = false
  invalidRouteDialog = false
  paymentErrorDialog = false
  saveErrorDialog = false
  invalidFilingDialog = false
  invalidFilingError = null as NameRequestStates
  nameRequestError = ''
  nameRequestErrorDialog = false
  haveData = false
  saveErrors = []
  saveWarnings = []
  fileAndPayInvalidNameRequestDialog = false

  // Local constants
  readonly STAFF_ROLE = 'STAFF'
  readonly GOV_ACCOUNT_USER = 'GOV_ACCOUNT_USER'

  // declarations for template
  readonly RouteNames = RouteNames
  readonly axios = axios
  readonly window = window

  /** The Update Current JS Date timer id. */
  private updateCurrentJsDateId = null // may be number or NodeJS.Timeout

  /** The route breadcrumbs list. */
  get breadcrumbs (): Array<BreadcrumbIF> {
    const crumbs: Array<BreadcrumbIF> = [
      getBusinessDashboardBreadcrumb(),
      {
        text: this.getFilingName,
        to: { name: this.$route.name }
      }
    ]

    // set base crumbs based on authorizations
    if (IsAuthorized(AuthorizedActions.SBC_BREADCRUMBS)) {
      // set SbcStaffDashboard as home crumb
      crumbs.unshift(getSbcStaffDashboardBreadcrumb())
    } else if (IsAuthorized(AuthorizedActions.STAFF_BREADCRUMBS)) {
      // set StaffDashboard as home crumb
      crumbs.unshift(getStaffDashboardBreadcrumb())
    } else {
      // set BCROS and BRD crumbs
      crumbs.unshift(getBcRegistriesDashboardBreadcrumb(), getMyBusinessRegistryBreadcrumb())
    }

    return crumbs
  }

  /** The page header (title). */
  get header (): string {
    if (this.isAmalgamationFilingRegular) {
      return `${this.getFilingName} (Regular)`
    } else if (this.isAmalgamationFilingHorizontal) {
      return `${this.getFilingName} (Horizontal Short-form)`
    } else if (this.isAmalgamationFilingVertical) {
      return `${this.getFilingName} (Vertical Short-form)`
    } else if (this.isContinuationInAuthorization) {
      return 'Continuation Authorization'
    }
    return this.getFilingName
  }

  /** Data for fee summary component. */
  get feeFilingData (): Array<FilingDataIF> {
    let filingData = [] as Array<FilingDataIF>

    if (this.getFilingData) {
      filingData = cloneDeep(this.getFilingData)

      if (this.isEntityCoop && this.isDissolutionFiling) {
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
      this.invalidFilingDialog ||
      this.fetchErrorDialog ||
      this.filingSurveyDialog ||
      this.filingNotExistDialog ||
      this.invalidRouteDialog ||
      this.paymentErrorDialog ||
      this.saveErrorDialog ||
      this.fileAndPayInvalidNameRequestDialog
    )
  }

  /** The (optional) fee summary filing label. */
  get filingLabel (): string {
    // special case for firm dissolutions
    if (this.isFirmDissolutionFiling) return 'Dissolution'
    // otherwise, no special label
    return null
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
      this.saveErrors = error?.response?.data?.rootCause?.errors || []
      this.saveWarnings = error?.response?.data?.rootCause?.warnings || []
      const filing = error?.response?.data?.rootCause?.filing || {}

      // on HTTP 400 or 422, decode error messages for display in dialog
      if ([StatusCodes.BAD_REQUEST, StatusCodes.UNPROCESSABLE_ENTITY].includes(error?.response?.status)) {
        this.saveErrors.forEach(err => {
          err.error = this.decodeErrorMessage(err, filing)
        })
      }

      if (error?.response?.status === StatusCodes.PAYMENT_REQUIRED) {
        // changes were saved if a 402 is received, so clear flag
        this.setHaveChanges(false)
        this.paymentErrorDialog = true
      } else {
        this.saveErrorDialog = true
      }
    })

    this.$root.$on('name-request-invalid-error', async error => {
      console.log('Invalid NR during File and Pay =', error) // eslint-disable-line no-console
      this.fileAndPayInvalidNameRequestDialog = true
    })

    this.$root.$on('name-request-retrieve-error', async () => {
      console.log('Error fetching NR during File and Pay') // eslint-disable-line no-console
      this.nameRequestError = 'An unexpected error has occurred. Please try your action again.'
      this.nameRequestErrorDialog = true
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

  /** Called to navigate to Business Dashboard. */
  goToDashboard (force = false): void {
    const businessId = this.getEntityIdentifier
    const dashboardUrl = sessionStorage.getItem('BUSINESS_DASH_URL') + businessId

    // check if there are no data changes
    if (!this.getHaveChanges || force) {
      // navigate to dashboard
      Navigate(dashboardUrl)
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
      Navigate(dashboardUrl)
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

    // do this except if we are authorized to skip it
    if (!IsAuthorized(AuthorizedActions.BLANK_COMPLETING_PARTY)) {
      completingParty = {
        firstName: this.getUserFirstname,
        middleName: '',
        lastName: this.getUserLastname,
        mailingAddress: {
          addressCity: (this.getOrgInformation?.mailingAddress?.city ?? ''),
          addressCountry: (this.getOrgInformation?.mailingAddress?.country ?? ''),
          addressRegion: (this.getOrgInformation?.mailingAddress?.region ?? ''),
          postalCode: (this.getOrgInformation?.mailingAddress?.postalCode ?? ''),
          streetAddress: (this.getOrgInformation?.mailingAddress?.street ?? ''),
          streetAddressAdditional: (this.getOrgInformation?.mailingAddress?.streetAdditional ?? '')
        },
        email: this.getUserEmail,
        phone: this.getUserPhone
      }
    } else {
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
    // reset errors in case this method is called more than once (ie, retry)
    this.resetFlags()

    try {
      // set current date from "real-time" date from server
      this.setCurrentDate(this.dateToYyyyMmDd(this.getCurrentJsDate))

      // load account info
      // it's important to load this first as it waits for CURRENT_ACCOUNT to be set
      await this.loadAccountInfo().catch(error => {
        console.log('Account info error =', error) // eslint-disable-line no-console
        this.accountAuthorizationDialog = true
        throw error // go to catch()
      })

      // load org info
      await this.loadOrgInfo().catch(error => {
        console.log('Org info error =', error) // eslint-disable-line no-console
        this.accountAuthorizationDialog = true
        throw error // go to catch()
      })

      // load authorized actions (aka permissions)
      // must be called after we have current account info
      await this.loadAuthorizedActions().catch(error => {
        console.log('Authorized actions error =', error) // eslint-disable-line no-console
        this.accountAuthorizationDialog = true
        throw error // go to catch()
      })

      // load auth roles
      try {
        this.loadAuthRoles()
      } catch (error) {
        console.log('Auth roles error =', error) // eslint-disable-line no-console
        this.accountAuthorizationDialog = true
        throw error // go to catch()
      }

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
        console.log('Fetch error =', error) // eslint-disable-line no-console
        // show fetch error dialog if there isn't another dialog showing
        this.fetchErrorDialog = !this.isErrorDialog
        throw error // go to catch()
      }

      // get user info
      // must be called after we know filing type
      const userInfo = await this.loadUserInfo().catch(error => {
        console.log('User info error =', error) // eslint-disable-line no-console
        if ([ErrorTypes.INVALID_USER_EMAIL, ErrorTypes.INVALID_USER_PHONE].includes(error.message)) {
          this.accountContactMissingDialog = true
        } else {
          this.accountAuthorizationDialog = true
        }
        throw error // go to catch()
      })

      // update Launch Darkly with user info, account info and auth roles
      // NOTE: this allows targeted feature flags
      await this.updateLaunchDarkly().catch(error => {
        // just log the error -- no need to halt app
        console.log('Launch Darkly update error =', error) // eslint-disable-line no-console
      })

      // load user address
      // must be called after we have LD info since it checks a FF
      try {
        this.loadUserAddress()
      } catch (error) {
        this.accountAuthorizationDialog = true
        throw error // go to catch()
      }

      // check that current route matches a supported filing type
      // only check FF when not in Vitest tests
      // must be called after LD is updated
      if (import.meta.env.VITEST === undefined) {
        const supportedFilings = await GetFeatureFlag('supported-filings')
        if (!supportedFilings?.includes(this.$route.meta.filingType)) {
          window.alert('This filing type is not available at the moment. Please check again later.')
          this.goToDashboard(true)
          return
        }
      }

      // check if authorized
      // must be called after we know what type of filing this is
      // must be called after we know what the user's permissions are
      if (this.isAmalgamationFiling && !IsAuthorized(AuthorizedActions.AMALGAMATION_FILING)) {
        this.accountAuthorizationDialog = true
        throw new Error('You are not authorized to access Amalgamation filings.')
      }
      if (this.isContinuationInFiling && !IsAuthorized(AuthorizedActions.CONTINUATION_IN_FILING)) {
        this.accountAuthorizationDialog = true
        throw new Error('You are not authorized to access Continuation In filings.')
      }
      if (this.isFirmDissolutionFiling && !IsAuthorized(AuthorizedActions.FIRM_DISSOLUTION_FILING)) {
        this.accountAuthorizationDialog = true
        throw new Error('You are not authorized to access Firm Dissolution filings.')
      }
      if (this.isIncorporationFiling && !IsAuthorized(AuthorizedActions.INCORPORATION_APPLICATION_FILING)) {
        this.accountAuthorizationDialog = true
        throw new Error('You are not authorized to access Incorporation Application filings.')
      }
      if (this.isRegistrationFiling && !IsAuthorized(AuthorizedActions.REGISTRATION_FILING)) {
        this.accountAuthorizationDialog = true
        throw new Error('You are not authorized to access Registration filings.')
      }
      if (this.isRestorationFiling && !IsAuthorized(AuthorizedActions.RESTORATION_REINSTATEMENT_FILING)) {
        this.accountAuthorizationDialog = true
        throw new Error('You are not authorized to access Restoration filings.')
      }
      if (this.isOtherDissolutionFiling && !IsAuthorized(AuthorizedActions.VOLUNTARY_DISSOLUTION_FILING)) {
        this.accountAuthorizationDialog = true
        throw new Error('You are not authorized to access Voluntary Dissolution filings.')
      }

      // set completing party
      this.setCompletingParty(this.getCompletingParties())

      // load parties only for SP/GP businesses
      if (this.isEntityFirm && this.getBusinessId) {
        await this.loadPartiesInformation(this.getBusinessId)
      }

      // load office addresses only for restorations and voluntary dissolutions
      if (this.isRestorationFiling || this.isOtherDissolutionFiling) {
        await this.loadOfficeAddresses(this.getBusinessId)
      }

      // special route checks for Continuation In filing
      if (this.isContinuationInFiling) {
        if (this.isAuthorizationStatus) {
          // make sure user is on the Continuation In Authorization route
          if (this.$route.name !== RouteNames.CONTINUATION_IN_AUTHORIZATION) {
            this.$router.replace(RouteNames.CONTINUATION_IN_AUTHORIZATION).catch(() => {})
            return
          }
        } else {
          // make sure user is on Continuation In Business BC route
          if (this.$route.name !== RouteNames.CONTINUATION_IN_BUSINESS_BC) {
            this.$router.replace(RouteNames.CONTINUATION_IN_BUSINESS_BC).catch(() => {})
            return
          }
        }
      }

      // default route check:
      // if user is on a route not valid for the current filing type then try to re-route them
      if (this.$route.meta.filingType !== this.getFilingType) {
        switch (true) {
          case this.isAmalgamationFiling:
            if (this.isAmalgamationFilingRegular) {
              this.$router.replace(RouteNames.AMALG_REG_INFORMATION).catch(() => {})
            } else if (this.isAmalgamationFilingHorizontal || this.isAmalgamationFilingVertical) {
              this.$router.replace(RouteNames.AMALG_SHORT_INFORMATION).catch(() => {})
            } else {
              throw new Error('Invalid amalgamation filing type')
            }
            return
          case this.isContinuationInFiling:
            // should never get here -- already handled above
            throw new Error('Invalid code path for Continuation In')
          case this.isFirmDissolutionFiling:
            this.$router.replace(RouteNames.DISSOLUTION_FIRM).catch(() => {})
            return
          case this.isIncorporationFiling:
            this.$router.replace(RouteNames.INCORPORATION_DEFINE_COMPANY).catch(() => {})
            return
          case this.isOtherDissolutionFiling:
            this.$router.replace(RouteNames.DISSOLUTION_DEFINE_DISSOLUTION).catch(() => {})
            return
          case this.isRegistrationFiling:
            this.$router.replace(RouteNames.REGISTRATION_DEFINE_BUSINESS).catch(() => {})
            return
          case this.isRestorationFiling:
            this.$router.replace(RouteNames.RESTORATION_BUSINESS_NAME).catch(() => {})
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
        try {
          const ff = await PayServices.fetchFilingFees(filingData.filingTypeCode, filingData.entityType, true)
          filingFees.push(ff)
        } catch (error) {
          console.log('Failed to fetch filing fees, error =', error) // eslint-disable-line no-console
          // return a valid fees structure
          filingFees.push(cloneDeep(EmptyFees))
        }
      }
      this.setFeePrices(filingFees)

      // pre-populate Certified By field
      // except if we are authorized to skip it
      // except if the field is already populated
      if (
        userInfo && // safety check
        !IsAuthorized(AuthorizedActions.BLANK_CERTIFY_STATE) &&
        !this.getCertifyState.certifiedBy
      ) {
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
      // log error to console
      console.log(error) // eslint-disable-line no-console
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
    // load business info
    await this.loadBusinessInfo(businessId)

    // fetch draft filing
    // NB: will throw if API error
    let draftFiling = await LegalServices.fetchFirstTask(businessId)

    // set filing type and status
    this.setFilingType(draftFiling.header.name)
    this.setFilingStatus(draftFiling.header.status)

    // check if filing is in a valid state to be edited
    this.filingNotExistDialog = (draftFiling?.header?.status !== FilingStatus.DRAFT)
    if (this.filingNotExistDialog) return null // don't continue

    // parse draft filing into the store and get the resources
    let resources: ResourceIF
    switch (true) {
      case this.isDissolutionFiling:
        draftFiling = {
          ...this.buildDissolutionFiling(),
          ...draftFiling
        }
        this.parseDissolutionDraft(draftFiling)
        resources = DissolutionResources.find(x => x.entityType === this.getEntityType) as ResourceIF
        break
      case this.isRestorationFiling:
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

    // NB - for some reason, need to call this here so the store updates this getter
    const dummy = this.getFilingData // eslint-disable-line

    // Fetch and validate the NR (if present) and set the data to the store.
    const nrNumber = draftFiling[draftFiling.header?.name]?.nameRequest?.nrNumber
    if (nrNumber) {
      await this.processNameRequest(draftFiling)
    }
  }

  /**
   * Fetches draft Amalgamation / Continuation In / IA / Registration and sets the resources.
   * (Only amalgamations/continuation ins/incorporations/registrations have a Temp ID.)
   */
  private async handleDraftWithTempId (tempId: string): Promise<void> {
    // fetch draft filing
    // NB: will throw if API error
    let draftFiling = await LegalServices.fetchFirstOrOnlyFiling(tempId)

    // set filing type and status
    this.setFilingType(draftFiling.header.name)
    this.setFilingStatus(draftFiling.header.status)

    // check if filing is in a valid state to be edited
    this.filingNotExistDialog = (
      draftFiling?.header?.status !== FilingStatus.DRAFT &&
      draftFiling?.header?.status !== FilingStatus.CHANGE_REQUESTED &&
      draftFiling?.header?.status !== FilingStatus.APPROVED
    )
    if (this.filingNotExistDialog) return null // don't continue

    // parse draft filing into the store and get the resources
    let resources: ResourceIF
    switch (true) {
      case this.isAmalgamationFiling:
        draftFiling = {
          ...this.buildAmalgamationFiling(),
          ...draftFiling
        }
        await this.parseAmalgamationDraft(draftFiling)
        if (this.isAmalgamationFilingRegular) {
          resources = AmalgamationRegResources.find(x => x.entityType === this.getEntityType) as ResourceIF
        } else if (this.isAmalgamationFilingHorizontal || this.isAmalgamationFilingVertical) {
          resources = AmalgamationShortResources.find(x => x.entityType === this.getEntityType) as ResourceIF
        } else {
          throw new Error('Invalid amalgamation filing type')
        }
        break
      case this.isContinuationInFiling:
        draftFiling = {
          ...this.buildContinuationInFiling(),
          ...draftFiling
        }
        this.parseContinuationInDraft(draftFiling)
        resources = ContinuationInResources.find(x => x.entityType === this.getEntityType) as ResourceIF
        // special case for Continuation In Authorizations
        if (this.isAuthorizationStatus) {
          resources.steps = ContinuationInStepsAuthorization
        }
        break
      case this.isIncorporationFiling:
        draftFiling = {
          ...this.buildIncorporationFiling(),
          ...this.formatEmptyIncorporationApplication(draftFiling)
        }
        this.parseIncorporationDraft(draftFiling)
        resources = IncorporationResources.find(x => x.entityType === this.getEntityType) as ResourceIF
        break
      case this.isRegistrationFiling:
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

    // Fetch and validate the NR (if present) and set the data to the store.
    if (nameRequest?.nrNumber) {
      await this.processNameRequest(draftFiling)
    }
  }

  /**
   * Fetches NR, validates it, and stores the data.
   * This method is different from _validateNameRequest() in Actions.vue. On error, this method displays
   * a dialog with messages for different invalid conditions and then redirects to the Entity Dashboard.
   */
  private async processNameRequest (filing: any): Promise<void> {
    try {
      // safety check
      if (!filing.header?.name) {
        console.log('Invalid filing name') // eslint-disable-line no-console
        this.invalidFilingError = null // unexpected error
        this.invalidFilingDialog = true
        return
      }

      // Fetch NR data using saved applicant phone or email (eg, restoration or amalgamation).
      // NB - if NR is affiliated to the current account (eg, IA or registration) then phone and email
      // don't matter.
      const nrNumber = filing[filing.header.name].nameRequest.nrNumber
      const applicantPhone = filing[filing.header.name].nameRequest.applicantPhone // may be undefined
      const applicantEmail = filing[filing.header.name].nameRequest.applicantEmail // may be undefined
      let nrResponse: NameRequestIF
      try {
        nrResponse = await LegalServices.fetchNameRequest(nrNumber, applicantPhone, applicantEmail)
      } catch (error) {
        console.log('Failed to fetch NR, error =', error) // eslint-disable-line no-console
        nrResponse = null
      }

      //
      // The NR checks below are sort-of a duplicate of code in NameRequestMixin::validateNameRequest()
      // but we assume the other checks passed if the user was able to add the NR to this filing, so
      // these checks should be sufficient.
      //

      // ensure NR was found
      if (!nrResponse) {
        this.invalidFilingError = NameRequestStates.NOT_FOUND
        this.invalidFilingDialog = true
        return
      }

      // ensure NR is valid
      const error = this.isNrInvalid(nrResponse)
      if (error) {
        console.log(error) // eslint-disable-line no-console
        this.invalidFilingError = NameRequestStates.INVALID
        this.invalidFilingDialog = true
        return
      }

      // match action code
      if (
        (this.isAmalgamationFiling && nrResponse.request_action_cd !== NrRequestActionCodes.AMALGAMATE) ||
        (this.isContinuationInFiling && nrResponse.request_action_cd !== NrRequestActionCodes.MOVE) ||
        (this.isIncorporationFiling && nrResponse.request_action_cd !== NrRequestActionCodes.NEW_BUSINESS) ||
        (this.isRegistrationFiling && nrResponse.request_action_cd !== NrRequestActionCodes.NEW_BUSINESS) ||
        (this.isRestorationFiling && nrResponse.request_action_cd !== NrRequestActionCodes.RESTORE)
      ) {
        console.log('NR request action code doesn\'t match filing type') // eslint-disable-line no-console
        this.invalidFilingError = NameRequestStates.INVALID
        this.invalidFilingDialog = true
        return
      }

      // match legal type
      if ((nrResponse.legalType as unknown as CorpTypeCd) !== this.getEntityType) {
        console.log('NR legal type doesn\'t match entity type') // eslint-disable-line no-console
        this.invalidFilingError = NameRequestStates.INVALID
        this.invalidFilingDialog = true
        return
      }

      // store the NR
      this.setNameRequest(nrResponse)

      // store the approved name
      const approvedName = this.getNrApprovedName(nrResponse)
      this.setNameRequestApprovedName(approvedName)

      // ensure NR is consumable
      // do this after storing data so filing displays correctly
      // this error will be caught again on File and Pay
      const state = this.getNrState(nrResponse)
      if (state !== NameRequestStates.APPROVED && state !== NameRequestStates.CONDITIONAL) {
        console.log('NR is not consumable') // eslint-disable-line no-console
        this.invalidFilingError = state || NameRequestStates.INVALID
        this.invalidFilingDialog = true
        return
      }
    } catch (error) {
      // errors should be handled above
      console.error('Unhandled error in processNameRequest() =', error) // eslint-disable-line no-console
    }
  }

  /** Resets all error flags/states. */
  private resetFlags (): void {
    this.haveData = false
    this.invalidFilingDialog = false
    this.filingNotExistDialog = false
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

  /** Fetches auth and user info, stores it, and returns it. */
  private async loadUserInfo (): Promise<any> {
    // fetch auth org info for dissolution/restoration only
    // do not set auth org/contact info for Restoration as it is likely to change
    // (this data is not available for an incorporation/registration)
    if (this.isDissolutionFiling) {
      const { contacts, folioNumber } = await AuthServices.fetchAuthInfo(this.getBusinessId)
      if (contacts?.length > 0) {
        this.setBusinessContact(contacts[0])
      }
      // set Folio Number from auth info
      // (for an incorporation, this is set in IncorporationDefineCompany.vue)
      // (for a registration, this is set in RegistrationDefineBusiness.vue)
      if (folioNumber) this.setFolioNumber(folioNumber)
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

    this.setUserInfo(userInfo)

    return userInfo
  }

  /** Fetches and stores account info. */
  private async loadAccountInfo (): Promise<void> {
    const routeAccountId = +this.$route.query.accountid || 0
    const currentAccount = await loadCurrentAccount()

    if (!currentAccount) {
      throw new Error('Failed to load current account info')
    }

    this.setCurrentAccount(currentAccount)

    /**
     * Gets current account from object in session storage.
     * Waits up to 5 sec for current account to be synced (typically by SbcHeader).
     */
    async function loadCurrentAccount (): Promise<AccountInformationIF> {
      let account = null
      for (let i = 0; i < 50; i++) {
        const currentAccountJson = sessionStorage.getItem(SessionStorageKeys.CurrentAccount)
        account = JSON.parse(currentAccountJson)
        // if there's no route account id, check for account to be set
        if (!routeAccountId && account) break
        // check for current account id to match route account id
        if (account?.id === routeAccountId) break
        await Sleep(100)
      }
      return account
    }
  }

  /** Fetches and stores authorized actions (aka permissions). */
  private async loadAuthorizedActions (): Promise<void> {
    // NB: will throw if API error
    const authorizedActions = await LegalServices.fetchAuthorizedActions()

    // verify we have _some_ authorized actions
    if (!Array.isArray(authorizedActions) || authorizedActions.length < 1) {
      throw new Error('Invalid or missing authorized actions')
    }

    this.setAuthorizedActions(authorizedActions)
  }

  /** Fetches and stores org info, and stores user's address. */
  private async loadOrgInfo (): Promise<void> {
    const orgId = this.getCurrentAccount.id

    // NB: will throw if API error
    const orgInfo = await AuthServices.fetchOrgInfo(orgId)
    if (!orgInfo) throw new Error('Invalid org info')

    this.setOrgInformation(orgInfo)
  }

  private loadUserAddress (): void {
    const mailingAddress = this.getOrgInformation.mailingAddress // may be undefined
    if (!mailingAddress && !GetFeatureFlag('allow-empty-account-mailing-address')) {
      throw new Error('Invalid mailing address')
    }

    const userAddress: AddressIF = {
      addressCity: (mailingAddress?.city ?? ''),
      addressCountry: (mailingAddress?.country ?? ''),
      addressRegion: (mailingAddress?.region ?? ''),
      postalCode: (mailingAddress?.postalCode ?? ''),
      streetAddress: (mailingAddress?.street ?? ''),
      streetAddressAdditional: (mailingAddress?.streetAdditional ?? '')
    }
    this.setUserAddress(userAddress)
  }

  /** Updates Launch Darkly with current user info. */
  private async updateLaunchDarkly (): Promise<void> {
    // don't run when Vitest is running the code
    if (import.meta.env.VITEST) return

    const userContext = this.getKeycloakGuid && {
      kind: 'user',
      key: this.getKeycloakGuid,
      roles: this.getAuthRoles,
      appSource: import.meta.env.APP_NAME,
      loginSource: this.getLoginSource,
      lastName: this.getUserLastname,
      firstName: this.getUserFirstname,
      email: this.getUserEmail
    }

    const orgContext = this.getCurrentAccount.id && {
      kind: 'org',
      key: this.getCurrentAccount.id.toString(),
      type: this.getCurrentAccount.type,
      accountStatus: this.getCurrentAccount.accountStatus,
      accountType: this.getCurrentAccount.accountType,
      appSource: import.meta.env.APP_NAME,
      label: this.getCurrentAccount.label
    }

    await UpdateLdUser(userContext, orgContext)
  }

  /** Fetches and stores business info. */
  private async loadBusinessInfo (businessId: string): Promise<void> {
    let business: BusinessIF
    try {
      business = await LegalServices.fetchBusinessInfo(businessId)
    } catch (error) {
      console.log('Failed to fetch business info, error =', error) // eslint-disable-line no-console
      business = null
    }

    if (!business) {
      throw new Error('Invalid business info')
    }

    // if (this.getBusinessId !== business.identifier) {
    //   throw new Error('Business identifier mismatch')
    // }

    // FUTURE: change this to a single setter/object?
    this.setAdminFreeze(business.adminFreeze)
    {
      // store alternate name if it exists (only used for firms atm)
      const alternateName = business.alternateNames?.find(x => x.identifier === business.identifier)
      if (alternateName) this.setAlternateName(alternateName.name)
    }
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

  /** Loads auth roles. */
  private loadAuthRoles (): void {
    // get roles from KC token
    const authRoles = GetKeycloakRoles()

    // safety check
    if (!Array.isArray(authRoles)) {
      throw new Error('Invalid roles')
    }

    this.setAuthRoles(authRoles)
  }

  /** Fetches and stores parties info . */
  private async loadPartiesInformation (businessId: string): Promise<void> {
    // NB: will throw if API error
    const parties = await LegalServices.fetchParties(businessId)

    if (parties?.parties?.length > 0) {
      this.setParties(parties.parties)
    } else {
      throw new Error('Invalid parties')
    }
  }

  /** Fetches and stores office addresses. */
  private async loadOfficeAddresses (businessId: string): Promise<void> {
    // NB: will throw if API error
    const addresses = await LegalServices.fetchAddresses(businessId)

    if (addresses) {
      this.setOfficeAddresses(addresses)
    } else {
      // do not throw error -- empty addresses are OK
      console.info('Empty office addresses') // eslint-disable-line no-console
    }
  }

  /**
   * Called when $route property changes (ie, on step changes).
   * Is also called initially without needing { immediate: true }.
   */
  @Watch('$route', { immediate: false })
  private async onRouteChanged (): Promise<void> {
    // init only if we are not on signin or signout route
    if (!this.isRouteName(RouteNames.SIGN_IN) && !this.isRouteName(RouteNames.SIGN_OUT)) {
      this.setCurrentStep(this.$route.meta?.step || 1)

      // avoid duplicate assignment/fetches
      if (!this.haveData) {
        // assign the business id or temp id
        const id = this.$route.query?.id as string
        if (id?.startsWith('CP') || id?.startsWith('BC') || id?.startsWith('FM') || id?.startsWith('C')) {
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
      this.isRouteName(RouteNames.AMALG_SHORT_REVIEW_CONFIRM) ||
      this.isRouteName(RouteNames.CONTINUATION_IN_REVIEW_CONFIRM) ||
      this.isRouteName(RouteNames.DISSOLUTION_REVIEW_CONFIRM) ||
      this.isRouteName(RouteNames.INCORPORATION_REVIEW_CONFIRM) ||
      this.isRouteName(RouteNames.REGISTRATION_REVIEW_CONFIRM) ||
      this.isRouteName(RouteNames.RESTORATION_REVIEW_CONFIRM)
    ) {
      this.setShowErrors(true)
    }

    // enable validation right away if user is editing a submitted filing
    // used for continuation in filings only atm
    if (this.getFilingStatus === FilingStatus.CHANGE_REQUESTED) {
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

#alert-banner {
  background-color: $BCgovGold5;
  border-color: $BCgovGold5;
  :deep(.dark-gray-links a) {
    color: $gray9 !important;
  }
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
