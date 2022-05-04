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
        <BreadCrumb :breadcrumbs="breadcrumbs" />

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
              <p class="mt-4" v-if="getFilingSubtitle">
                {{ getFilingSubtitle }}
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
              <aside>
                <affix relative-element-selector=".col-lg-9" :offset="{ top: 100, bottom: -100 }">
                  <SbcFeeSummary
                    :filingData="feeFilingData"
                    :payURL="payApiUrl"
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
import { Component, Mixins, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { PAYMENT_REQUIRED } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import * as Sentry from '@sentry/browser'
import { getFeatureFlag, updateLdUser, navigate, sleep } from '@/utils'

// Components, dialogs and views
import Actions from '@/components/common/Actions.vue'
import { BreadCrumb } from '@bcrs-shared-components/bread-crumb'
import EntityInfo from '@/components/common/EntityInfo.vue'
import PaySystemAlert from 'sbc-common-components/src/components/PaySystemAlert.vue'
import SbcFeeSummary from 'sbc-common-components/src/components/SbcFeeSummary.vue'
import SbcFooter from 'sbc-common-components/src/components/SbcFooter.vue'
import SbcHeader from 'sbc-common-components/src/components/SbcHeader.vue'
import Stepper from '@/components/common/Stepper.vue'
import * as Dialogs from '@/dialogs'
import * as Views from '@/views'

// Mixins, interfaces, etc
import {
  CommonMixin,
  DateMixin,
  EnumMixin,
  FilingTemplateMixin,
  NameRequestMixin
} from '@/mixins'
import {
  AccountInformationIF,
  ActionBindingIF,
  AddressIF,
  BreadcrumbIF,
  ConfirmDialogType,
  DissolutionResourceIF,
  EmptyFees,
  FilingDataIF,
  OrgInformationIF,
  ResourceIF,
  StepIF
} from '@/interfaces'
import {
  DissolutionResources,
  getEntityDashboardBreadcrumb,
  getMyBusinessRegistryBreadcrumb,
  getRegistryDashboardBreadcrumb,
  getSbcStaffDashboardBreadcrumb,
  getStaffDashboardBreadcrumb,
  getStaffRegistryBreadcrumb,
  IncorporationResources,
  RegistrationResources
} from '@/resources'
import { AuthServices, LegalServices, PayServices } from '@/services'

// Enums and Constants
import {
  CorpTypeCd,
  FilingCodes,
  FilingNames,
  FilingStatus,
  FilingTypes,
  NameRequestStates,
  RouteNames,
  StaffPaymentOptions
} from '@/enums'
import { SessionStorageKeys } from 'sbc-common-components/src/util/constants'

@Component({
  components: {
    Actions,
    BreadCrumb,
    EntityInfo,
    PaySystemAlert,
    SbcFeeSummary,
    SbcFooter,
    SbcHeader,
    Stepper,
    ...Dialogs,
    ...Views
  }
})
export default class App extends Mixins(
  CommonMixin,
  DateMixin,
  EnumMixin,
  FilingTemplateMixin,
  NameRequestMixin
) {
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
  @Getter getSteps!: Array<StepIF>
  @Getter getAccountInformation!: AccountInformationIF
  @Getter getOrgInformation!: OrgInformationIF
  @Getter isSbcStaff!: boolean
  @Getter getFilingSubtitle!: string

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
  @Action setNameRequestState!: ActionBindingIF

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

  // Local const
  private readonly STAFF_ROLE = 'STAFF'
  private readonly GOV_ACCOUNT_USER = 'GOV_ACCOUNT_USER'

  // Enum for template
  readonly RouteNames = RouteNames

  /** The Update Current JS Date timer id. */
  private updateCurrentJsDateId = 0

  /** The route breadcrumbs list. */
  private get breadcrumbs (): Array<BreadcrumbIF> {
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
      crumbs.unshift(getStaffDashboardBreadcrumb(), getStaffRegistryBreadcrumb())
    } else {
      // set Home and Dashboard crumbs
      crumbs.unshift(getRegistryDashboardBreadcrumb(), getMyBusinessRegistryBreadcrumb())
    }

    return crumbs
  }

  /** Data for fee summary component. */
  private get feeFilingData (): Array<FilingDataIF> {
    let filingData: Array<FilingDataIF> = []
    if (this.getFilingData) {
      filingData = cloneDeep(this.getFilingData)
      if (this.isTypeCoop && this.getFilingData.length > 0) {
        // Only set Future Effective and Priority to Special Resolution Fee
        const specialResolutionFilingData = filingData.find(x => x.filingTypeCode === FilingCodes.SPECIAL_RESOLUTION)
        if (specialResolutionFilingData) {
          if (this.getStaffPaymentStep.staffPayment.option === StaffPaymentOptions.NO_FEE) {
            filingData.forEach(x => {
              x.waiveFees = true
            })
          } else {
            specialResolutionFilingData.futureEffective = this.getEffectiveDateTime.isFutureEffective
            specialResolutionFilingData.priority = this.getStaffPaymentStep.staffPayment.isPriority
          }
        }
      } else if (this.getFilingData[0]) {
        // Avoid waiveFee with priority or futureEffective in the same request
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
      case FilingTypes.INCORPORATION_APPLICATION: return 'Application'
      case FilingTypes.REGISTRATION: return 'Registration'
      case FilingTypes.VOLUNTARY_DISSOLUTION: return 'Filing'
    }
  }
  // check to use stepper view or not
  get isStepperView (): boolean {
    return !this.$route.meta.noStepper
  }

  /** Helper to check is the current route matches */
  private isRouteName (routeName: RouteNames): boolean {
    return (this.$route.name === routeName)
  }

  /** Called when component is created. */
  async created (): Promise<void> {
    // update Current Js Date now and every 1 minute thereafter
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

    // init app
    this.onRouteChanged()
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
    if (id?.startsWith('CP') || id?.startsWith('BC') || id?.startsWith('FM')) {
      this.setBusinessId(id)
      this.setFilingType(FilingTypes.VOLUNTARY_DISSOLUTION)
    } else {
      // Assign temp reg number
      this.setTempId(id)
    }
  }

  private goToManageBusinessDashboard (): void {
    this.fileAndPayInvalidNameRequestDialog = false
    const manageBusinessUrl = `${sessionStorage.getItem('AUTH_WEB_URL')}business`
    this.setHaveChanges(false)
    navigate(manageBusinessUrl)
  }

  /** Called to navigate to dashboard. */
  private goToDashboard (force: boolean = false): void {
    // check if there are no data changes
    if (!this.getHaveChanges || force) {
      // navigate to dashboard
      const dashboardUrl = sessionStorage.getItem('DASHBOARD_URL')
      navigate(dashboardUrl + this.getEntityIdentifier)
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
      navigate(dashboardUrl + this.getEntityIdentifier)
    })
  }

  /** Fetches NR data and fetches draft filing. */
  private async fetchData (routeChanged: boolean = false): Promise<void> {
    // only fetch data on first route change
    if (routeChanged && this.haveData) return

    // reset errors in case this method is invoked more than once (ie, retry)
    this.resetFlags()

    // check that current route matches a supported filing type
    const supportedFilings = await getFeatureFlag('supported-filings')
    if (!supportedFilings?.includes(this.$route.meta.filingType)) {
      window.alert('This filing type is not available at the moment. Please check again later.')
      this.goToDashboard(true)
      return
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

      // load account information
      await this.loadAccountInformation().catch(error => {
        console.log('Account info error =', error) // eslint-disable-line no-console
        this.accountAuthorizationDialog = true
        throw error // go to catch()
      })

      // update Launch Darkly
      await this.updateLaunchDarkly(userInfo).catch(error => {
        // just log the error -- no need to halt app
        console.log('Launch Darkly update error =', error) // eslint-disable-line no-console
      })

      // fetch the draft filing and resources
      try {
        if (this.getBusinessId) {
          // this is a Dissolution filing
          // (only dissolutions have a business id)
          const resources = await this.handleDraftDissolution()
          if (!resources) {
            // go to catch()
            throw new Error(`Invalid dissolution resources, entity type = ${this.getEntityType}`)
          }
          this.setResources(resources)
        } else {
          // this is an Incorporation or Registration filing
          // (only incorporations and registrations have a temp id)
          const resources = await this.handleDraftApplication()
          if (!resources) {
            // go to catch()
            throw new Error(`Invalid ${this.getFilingType} resources, entity type = ${this.getEntityType}`)
          }
          this.setResources(resources)
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

      // if user is on a route not valid for the current filing type
      // then try to re-route them
      if (this.$route.meta.filingType !== this.getFilingType) {
        switch (this.getFilingType) {
          case FilingTypes.VOLUNTARY_DISSOLUTION:
            if (this.isTypeSoleProp) {
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
          default:
            this.invalidRouteDialog = true
            throw new Error(`Invalid filing type = ${this.getFilingType}`) // go to catch()
        }
      }

      // fetch and set the fee prices to display in the text
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

  /** Fetches draft dissolution and returns the resources. */
  private async handleDraftDissolution (): Promise<DissolutionResourceIF> {
    // ensure user is authorized to use this business
    await this.checkAuth(this.getBusinessId).catch(error => {
      console.log('Auth error =', error) // eslint-disable-line no-console
      this.accountAuthorizationDialog = true
      throw error
    })

    // fetch draft filing
    // NB: will throw if API error
    let draftFiling = await LegalServices.fetchDraftDissolution(this.getBusinessId)

    // check if filing is in a valid state to be edited
    this.invalidDissolutionDialog = !this.hasValidFilingState(draftFiling)
    if (this.invalidDissolutionDialog) return null

    // merge draft properties into empty filing so all properties are initialized
    const emptyFiling = this.buildDissolutionFiling()
    draftFiling = { ...emptyFiling, ...draftFiling }

    // parse draft filing into the store
    if (draftFiling) {
      this.parseDissolutionDraft(draftFiling)
    }

    // return the resources
    return DissolutionResources.find(x => x.entityType === this.getEntityType)
  }

  /** Fetches draft incorporation or registration and returns the resources. */
  private async handleDraftApplication (): Promise<ResourceIF> {
    // ensure user is authorized to use this IA
    await this.checkAuth(this.getTempId).catch(error => {
      console.log('Auth error =', error) // eslint-disable-line no-console
      this.accountAuthorizationDialog = true
      throw error
    })

    // fetch draft filing
    // NB: will throw if API error
    let draftFiling = await LegalServices.fetchDraftApplication(this.getTempId)

    this.setFilingType(draftFiling.header.name) // either IA or reg

    // check if filing is in a valid state to be edited
    if (!this.hasValidFilingState(draftFiling)) return null

    // merge draft properties into empty filing so all properties are initialized
    let resources: any
    let parseFiling: Function
    switch (this.getFilingType) {
      case FilingTypes.INCORPORATION_APPLICATION:
        draftFiling = { ...this.buildIncorporationFiling(), ...draftFiling }
        resources = IncorporationResources
        parseFiling = this.parseIncorporationDraft
        break
      case FilingTypes.REGISTRATION:
        draftFiling = { ...this.buildRegistrationFiling(), ...draftFiling }
        resources = RegistrationResources
        parseFiling = this.parseRegistrationDraft
        break
      default:
        throw new Error(`Invalid filing type = ${this.getFilingType}`)
    }

    // parse draft filing into the store
    if (draftFiling) {
      parseFiling(draftFiling)
    }

    // verify nameRequest object
    const nameRequest = draftFiling[draftFiling.header?.name]?.nameRequest
    if (!nameRequest) throw new Error('Missing Name Request object')

    // Fetches and validates the NR and sets the data to the store. This method is different
    // from the validateNameRequest method in Actions.vue. This method sets the data to
    // the store shows a specific message for different invalid states and redirection is to the
    // Filings Dashboard.
    if (nameRequest?.nrNumber) {
      await this.processNameRequest(draftFiling)
    }

    // return the resources
    return resources.find(x => x.entityType === this.getEntityType)
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
      if (!this.isNrValid(nrResponse)) {
        console.log('NR is not valid') // eslint-disable-line no-console
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

    // get auth org info for dissolution only
    // (this data is not available for an IA)
    if (this.isDissolutionFiling) {
      let { contacts, folioNumber } = await AuthServices.fetchAuthInfo(this.getBusinessId)
      if (contacts?.length > 0) {
        this.setBusinessContact(contacts[0])
      }
      // for a dissolution, set folio number from auth info
      // (for an incorporation, it is set in IncorporationDefineCompany.vue)
      // (for a registration, it is set in RegistrationDefineBusiness.vue)
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
   * Gets current account from object in session storage.
   * Wait up to 10 sec for current account to be synced (typically by SbcHeader).
   */
  private async getCurrentAccount (): Promise<any> {
    let account: any
    for (let i = 0; i < 100; i++) {
      const currentAccount = sessionStorage.getItem(SessionStorageKeys.CurrentAccount)
      account = JSON.parse(currentAccount)
      if (account) break
      await sleep(100)
    }
    return account
  }

  /** Gets account info and stores it. */
  private async loadAccountInformation (): Promise<any> {
    // NB: staff don't have current account (but SBC Staff do)
    if (!this.isRoleStaff) {
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
        await this.getSaveOrgInfo(accountInfo?.id)
      }
    }
  }

  /** Gets and stores org info and user's address. */
  private async getSaveOrgInfo (orgId: number): Promise<void> {
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

    await updateLdUser(key, email, firstName, lastName, custom)
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

  /** Called when $route property changes. */
  @Watch('$route', { immediate: false })
  private async onRouteChanged (): Promise<void> {
    // init only if we are not on signin or signout route
    if (!this.isRouteName(RouteNames.SIGN_IN) && !this.isRouteName(RouteNames.SIGN_OUT)) {
      this.assignIdentifier()
      this.setCurrentStep(this.$route.meta?.step || 1)
      await this.fetchData(true)
    }

    if (
      this.isRouteName(RouteNames.DISSOLUTION_REVIEW_CONFIRM) ||
      this.isRouteName(RouteNames.INCORPORATION_REVIEW_CONFIRM) ||
      this.isRouteName(RouteNames.REGISTRATION_REVIEW_CONFIRM)
    ) {
      this.setShowErrors(true)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

// display drop-down menu on top of stepper and fee summary
::v-deep .app-header {
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
