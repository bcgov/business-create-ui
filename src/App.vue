<template>
  <v-app class="app-container" id="app">
    <!-- Dialogs -->
    <NameRequestInvalidErrorDialog
      :dialog="nameRequestInvalidErrorDialog"
      @okay="nrOkay()"
      @redirect="redirectToBusinessUrl()"
      :type="nameRequestInvalidType"
      attach="#app"
    />

    <AccountAuthorizationDialog
      :dialog="accountAuthorizationErrorDialog"
      @exit="redirectToBusinessUrl()"
      @retry="evaluateNRPreconditions()"
      attach="#app"
    />

    <!-- Initial Page Load Transition -->
    <transition name="fade">
      <div class="loading-container" v-show="evaluatingPreconditions">
        <div class="loading__content">
          <v-progress-circular color="primary" size="50" indeterminate />
          <div class="loading-msg">Loading...</div>
        </div>
      </div>
    </transition>

    <sbc-header ref="sbcHeader" />

    <main class="app-body">
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

    <sbc-footer />
  </v-app>
</template>

<script lang="ts">
// Libraries
import { Component, Vue, Watch, Mixins } from 'vue-property-decorator'
import { Action, State } from 'vuex-class'
import axios from '@/utils/axios-auth'

// Components
import SbcHeader from 'sbc-common-components/src/components/SbcHeader.vue'
import SbcFooter from 'sbc-common-components/src/components/SbcFooter.vue'
import SbcFeeSummary from 'sbc-common-components/src/components/SbcFeeSummary.vue'
import { EntityInfo, Stepper, Actions } from '@/components/common'

// Dialogs
import { AccountAuthorizationDialog, NameRequestInvalidErrorDialog } from '@/components/dialogs'

// Mixins
import { DateMixin, FilingTemplateMixin, LegalApiMixin, NameXApiMixin } from '@/mixins'

// Interfaces
import { FilingDataIF, ActionBindingIF, StateModelIF, IncorporationFilingIF } from '@/interfaces'

import { CertifyStatementResource } from '@/resources'

// Enums
import { EntityTypes, FilingCodes, NameRequestStates } from '@/enums'

// Enums for Keycloak
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
    AccountAuthorizationDialog
  }
})
export default class App extends Mixins(DateMixin, FilingTemplateMixin, LegalApiMixin, NameXApiMixin) {
  // Global state
  @State stateModel!: StateModelIF
  @State(state => state.stateModel.tombstone.authenticated)
  readonly authenticated: boolean

  // Global actions
  @Action setCurrentStep!: ActionBindingIF
  @Action setCurrentDate!: ActionBindingIF
  @Action setCertifyStatementResource!: ActionBindingIF
  @Action setNameRequestState!: ActionBindingIF
  @Action setAuthRoles: ActionBindingIF
  @Action setAuthenticated: ActionBindingIF

  // Local Properties
  private filingData: Array<FilingDataIF> = []
  private draftFiling: IncorporationFilingIF

  private accountAuthorizationErrorDialog: boolean = false
  private nameRequestInvalidErrorDialog: boolean = false
  private nameRequestInvalidType: string = ''
  private evaluatingPreconditions: boolean = true

  private async created (): Promise<void> {
    // Check for keycloak token to see if authenticated
    // (Keycloak service does not seem to be always ready here, so we check session storage )
    // Fresh logins will initiate fetch data through the sign in component
    // and the authenticated flag via vuex. This is required for when a user refreshes the page
    // and they are already authenticated, so the data is refetched since the watcher for authenticated
    // does not get re-triggered
    if (sessionStorage.getItem(SessionStorageKeys.KeyCloakToken)) {
      await this.fetchData()
    }
  }

  /**
   * Fetch data required for NR and draft filing
   */
  private async fetchData (): Promise<void> {
    // Evaluate name request pre conditions
    const nameRequest = await this.evaluateNRPreconditions()
    if (nameRequest && nameRequest.nrNum && nameRequest.isConsumable) {
      // TODO: Handling different NR Formats & accept the EntityType dynamically once Namex provides it.
      // Will probably change once we proxy through legal API with a consistent format
      this.setNameRequestState(
        { nrNumber: nameRequest.nrNum,
          // TODO: Implement this check when POST-MVP: entityType: nameRequest.requestTypeCd,
          entityType: EntityTypes.BCOMP,
          filingId: null })
      this.setCurrentDate(this.dateToUsableString(new Date()))

      try {
        // Retrieve draft filing if it exists for the nrNumber specified
        this.draftFiling = await this.fetchDraft()

        // Parse the draft data into the store if it exists
        this.draftFiling && this.parseDraft(this.draftFiling)
      } catch (e) {
        // TODO: Catch a flag from the api, if there is an error to be handled.
      }
    }
    this.evaluatingPreconditions = false
  }

  /**
   * Redirect to business URL
   */
  private redirectToBusinessUrl (): void {
    const businessUrl: string = sessionStorage.getItem('BUSINESSES_URL') || ''
    window.location.assign(businessUrl)
  }

  /** The URL of the Auth API. */
  private get authApiUrl (): string | null {
    return sessionStorage.getItem('AUTH_API_URL')
  }

  /**
   * Fetch Authorizations by NR number
   */
  private getNRAuthorizations (nrNumber: string): Promise<any> {
    const url = nrNumber + '/authorizations'
    const config = {
      baseURL: this.authApiUrl + 'entities/'
    }
    return axios.get(url, config)
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
   * Evaluate Name Request pre conditions
   */
  private async evaluateNRPreconditions (): Promise<any> {
    // Clear error conditions in the event this is invoked more than one time (retry)
    this.nameRequestInvalidErrorDialog = false
    this.accountAuthorizationErrorDialog = false

    const queryNrNumber : string = this.$route.query.nrNumber as string
    // Name request not found, show error dialog
    if (!queryNrNumber) {
      this.nameRequestInvalidType = NameRequestStates.NOTFOUND
      this.nameRequestInvalidErrorDialog = true
      return
    }

    return this.getNRAuthorizations(queryNrNumber).then(async data => {
      this.storeAuthRoles(data) // throws if no role
      await this.intializeNameXToken() // TODO : temporary token retrieval code
      const nrResponse = await this.queryNameRequest(queryNrNumber)

      // NR not found
      if (!nrResponse) {
        this.nameRequestInvalidType = NameRequestStates.NOTFOUND
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

  /** The URL of the Pay API. */
  private get payApiUrl (): string | null {
    return sessionStorage.getItem('PAY_API_URL')
  }

  /**
   * Method called when $route property changes.
   */
  @Watch('$route', { immediate: true })
  private onRouteChanged (): void {
    this.setCurrentStep(this.$route.meta.step)
  }

  /**
   * Method called when the authenticated state changes.
   * Used to determine if we are ready to go evaluate all preconditions and fetch required data
   */
  @Watch('authenticated')
  private onAuthenticatedChange (): void {
    if (this.authenticated) {
      this.fetchData()
    }
  }

  @Watch('stateModel.nameRequest.entityType')
  private onEntityTypeChanged (val: string | null): void {
    switch (val) {
      case EntityTypes.BCOMP:
        this.filingData.push({ filingTypeCode: FilingCodes.INCORPORATION_BC, entityType: EntityTypes.BCOMP })
        break
      case EntityTypes.COOP:
        this.filingData.push({ filingTypeCode: FilingCodes.INCORPORATION_CP, entityType: EntityTypes.COOP })
        break
      default:
        this.filingData = []
    }

    this.setCertifyStatementResource(val ? CertifyStatementResource.find(x => x.entityType === val) : null)
  }

  // FOR FUTURE USE TO SUPPORT EXIT IN ERROR DIALOGS
  private onClickExit (): void {
    (this.$refs.form as Vue & { logout: () => void }).logout()
  }

  private nrOkay (): void {
    this.nameRequestInvalidErrorDialog = false
  }
}
</script>

<style lang="scss" scoped>
.app-header {
  z-index: 1000;
}
</style>
