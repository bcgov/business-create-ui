<template>
  <div id="summary-business-home-jurisdiction">
    <section :class="{ 'invalid-section': !isContinuationInBusinessHomeValid }">
      <div
        v-if="!isContinuationInBusinessHomeValid"
        class="businessHomeStepErrorMessage"
      >
        <v-icon color="error">
          mdi-information-outline
        </v-icon>
        <span class="error-text mx-1">This step is unfinished.</span>

        <router-link
          :to="{ path: `/${RouteNames.CONTINUATION_IN_BUSINESS_HOME}` }"
        >
          <span>Return to this step to finish it</span>
        </router-link>
      </div>

      <div id="existing-business-information-summary">
        <!-- Home Jurisdiction -->
        <article class="section-container">
          <v-row no-gutters>
            <v-col
              cols="12"
              sm="3"
              class="pr-4"
            >
              <label>Home Jurisdiction</label>
            </v-col>
            <v-col
              cols="12"
              sm="9"
              class="pt-4 pt-sm-0"
            >
              <div id="home-jurisdiction">
                {{ homeJurisdiction || '[Unknown]' }}
              </div>
            </v-col>
          </v-row>
        </article>

        <!-- Registration Number in B.C. -->
        <article
          v-if="isLookup"
          class="section-container"
        >
          <v-row no-gutters>
            <v-col
              cols="12"
              sm="3"
              class="pr-4"
            >
              <label>Registration Number in B.C.</label>
            </v-col>
            <v-col
              cols="12"
              sm="9"
              class="pt-4 pt-sm-0"
            >
              <div id="registration-number-bc">
                {{ getExistingBusinessInfo?.businessIdentifier || '[Unknown]' }}
              </div>
            </v-col>
          </v-row>
        </article>

        <!-- Registered Name in B.C. -->
        <article
          v-if="isLookup"
          class="section-container"
        >
          <v-row no-gutters>
            <v-col
              cols="12"
              sm="3"
              class="pr-4"
            >
              <label>Registered Name in B.C.</label>
            </v-col>
            <v-col
              cols="12"
              sm="9"
              class="pt-4 pt-sm-0"
            >
              <div id="registered-name-bc">
                {{ getExistingBusinessInfo?.businessLegalName || '[Unknown]' }}
              </div>
            </v-col>
          </v-row>
        </article>

        <!-- Date of Registration in B.C. -->
        <article
          v-if="isLookup"
          class="section-container"
        >
          <v-row no-gutters>
            <v-col
              cols="12"
              sm="3"
              class="pr-4"
            >
              <label>Date of Registration in B.C.</label>
            </v-col>
            <v-col
              cols="12"
              sm="9"
              class="pt-4 pt-sm-0"
            >
              <div id="registration-date-bc">
                <!-- *** TODO: verify/fix format -->
                {{ getExistingBusinessInfo?.businessFoundingDate || '[Unknown]' }}
              </div>
            </v-col>
          </v-row>
        </article>

        <!-- Registered Name in Home Jurisdiction -->
        <article class="section-container">
          <v-row no-gutters>
            <v-col
              cols="12"
              sm="3"
              class="pr-4"
            >
              <label>Registered Name in Home Jurisdiction</label>
            </v-col>
            <v-col
              cols="12"
              sm="9"
              class="pt-4 pt-sm-0"
            >
              <div id="registered-name-home">
                {{ getExistingBusinessInfo?.legalName || '[Unknown]' }}
              </div>
            </v-col>
          </v-row>
        </article>

        <!-- Registration Number in Home Jurisdiction -->
        <article class="section-container">
          <v-row no-gutters>
            <v-col
              cols="12"
              sm="3"
              class="pr-4"
            >
              <label>Registration Number in Home Jurisdiction</label>
            </v-col>
            <v-col
              cols="12"
              sm="9"
              class="pt-4 pt-sm-0"
            >
              <div id="registration-number-home">
                {{ getExistingBusinessInfo?.identifier || '[Unknown]' }}
              </div>
            </v-col>
          </v-row>
        </article>

        <!-- Date of Incorporation, Continuation or Amalgamation in Foreign Jurisdiction -->
        <article class="section-container">
          <v-row no-gutters>
            <v-col
              cols="12"
              sm="3"
              class="pr-4"
            >
              <label>Date of Incorporation, Continuation or Amalgamation in Foreign Jurisdiction</label>
            </v-col>
            <v-col
              cols="12"
              sm="9"
              class="pt-4 pt-sm-0"
            >
              <div id="incorporation-date-home">
                {{ getExistingBusinessInfo?.incorporationDate || '[Unknown]' }}
              </div>
            </v-col>
          </v-row>
        </article>

        <!-- Business Number -->
        <article class="section-container">
          <v-row no-gutters>
            <v-col
              cols="12"
              sm="3"
              class="pr-4"
            >
              <label>Business Number</label>
            </v-col>
            <v-col
              cols="12"
              sm="9"
              class="pt-4 pt-sm-0"
            >
              <div id="business-number">
                {{ getExistingBusinessInfo?.taxId || '[Unknown]' }}
              </div>
            </v-col>
          </v-row>
        </article>
      </div>

      <v-divider class="mx-6" />

      <div id="continuation-authorization-summary">
        <!-- Continuation Authorization -->
        <article class="section-container">
          <v-row no-gutters>
            <v-col
              cols="12"
              sm="3"
              class="pr-4"
            >
              <label>Continuation Authorization</label>
            </v-col>
            <v-col
              cols="12"
              sm="9"
              class="pt-4 pt-sm-0"
            >
              <ul id="continuation-authorization-file">
                <li
                  v-for="item in getContinuationAuthorization?.files"
                  :key="item.fileKey"
                >
                  <v-icon color="green darken-2">
                    mdi-check
                  </v-icon>
                  <span>{{ item.fileName }}</span>
                </li>
              </ul>
            </v-col>
          </v-row>
        </article>

        <v-divider class="mx-6 mt-8 mb-3" />

        <!-- Authorization Date -->
        <article class="section-container">
          <v-row no-gutters>
            <v-col
              cols="12"
              sm="3"
              class="pr-4"
            >
              <label>Authorization Date</label>
            </v-col>
            <v-col
              cols="12"
              sm="9"
              class="pt-4 pt-sm-0"
            >
              <div id="authorization-date">
                {{ authorizationDate || '[Unknown]' }}
              </div>
            </v-col>
          </v-row>
        </article>

        <!-- Expiry Date -->
        <article class="section-container">
          <v-row no-gutters>
            <v-col
              cols="12"
              sm="3"
              class="pr-4"
            >
              <label>Expiry Date</label>
            </v-col>
            <v-col
              cols="12"
              sm="9"
              class="pt-4 pt-sm-0"
            >
              <div id="expiry-date">
                {{ expiryDate || '[Not entered]' }}
              </div>
            </v-col>
          </v-row>
        </article>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { Getter } from 'pinia-class'
import { getName } from 'country-list'
import { useStore } from '@/store/store'
import { RouteNames } from '@/enums'
import { ContinuationAuthorizationIF, ExistingBusinessInfoIF } from '@/interfaces'
import { DateMixin } from '@/mixins'

@Component({})
export default class SummaryBusinessHomeJurisdiction extends Mixins(DateMixin) {
  // for template
  readonly RouteNames = RouteNames

  // Getters
  @Getter(useStore) getContinuationAuthorization!: ContinuationAuthorizationIF
  @Getter(useStore) getExistingBusinessInfo!: ExistingBusinessInfoIF
  @Getter(useStore) isContinuationInBusinessHomeValid!: boolean

  // *** data from COLIN looks like this:
  // 'business': {
  //     'businessNumber': self.business_number,
  //     'corpState': self.corp_state,
  //     'corpStateClass': self.corp_state_class,
  //     'email': self.email,
  //     'foundingDate': self.founding_date,
  //     'goodStanding': self.good_standing,
  //     'identifier': self.corp_num,
  //     'jurisdiction': self.jurisdiction,
  //     'homeRecognitionDate': self.home_recogn_dt,
  //     'homeJurisdictionNumber': self.home_juris_num,
  //     'homeCompanyName': self.home_company_nme,
  //     'lastAgmDate': self.last_agm_date,
  //     'lastArDate': self.last_ar_date,
  //     'lastLedgerTimestamp': self.last_ledger_timestamp,
  //     'legalName': self.corp_name,
  //     'legalType': self.corp_type,
  //     'status': self.status
  // }

  /** Whether the existing business data was looked up (ie, is an extrapro). */
  get isLookup (): boolean {
    return this.getExistingBusinessInfo?.mode === 'LOOKUP'
  }

  // NOT NEEDED ATM
  // /** Whether the existing business data was manually entered. */
  // get isManual (): boolean {
  //   return this.getExistingBusinessInfo?.mode === 'MANUAL'
  // }

  /** The home jurisdiction. */
  get homeJurisdiction (): string {
    const hj = this.getExistingBusinessInfo?.homeJurisdiction
    if (hj?.country) {
      const country = getName(hj.country)
      const region = (hj.region === 'FEDERAL' ? 'Federal' : hj.region)
      if (region) return `${region}, ${country}`
      return country
    }
    return null
  }

  /** The expro identifier and name (in BC). */
  get extraproRegistration (): string {
    const identifier = this.getExistingBusinessInfo?.businessIdentifier
    const name = this.getExistingBusinessInfo?.businessLegalName
    if (identifier && name) return `${identifier} - ${name}`
    return null
  }

  get authorizationDate (): string {
    return this.yyyyMmDdToPacificDate(this.getContinuationAuthorization?.date, true, false)
  }

  get expiryDate (): string {
    return this.yyyyMmDdToPacificDate(this.getContinuationAuthorization?.expiryDate, true, false)
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.businessHomeStepErrorMessage {
  padding-top: 1.25rem;
  padding-left: 1.25rem;
  color: $app-red;
}

.v-icon.mdi-information-outline {
  margin-top: -2px;
}

// reduce top whitespace for all articles except first one
article:not(:first-child) {
  padding-top: 1.25rem;
}

// clear bottom whitespace for all articles except last one
article:not(:last-child) {
  padding-bottom: 0;
}

// align the list v-icons and text
#continuation-authorization-summary {
  ul {
    list-style: none;
    margin-left: 2rem;
    padding-left: 0;

    li > i {
      margin-left: -2rem;
      padding-right: 10px;
    }
  }
}
</style>
