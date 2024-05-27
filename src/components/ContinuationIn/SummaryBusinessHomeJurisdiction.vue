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
          v-if="isExpro"
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
                {{ getExistingBusinessInfo?.bcIdentifier || '[Unknown]' }}
              </div>
            </v-col>
          </v-row>
        </article>

        <!-- Name in B.C. -->
        <article
          v-if="isExpro"
          class="section-container"
        >
          <v-row no-gutters>
            <v-col
              cols="12"
              sm="3"
              class="pr-4"
            >
              <label>Name in B.C.</label>
            </v-col>
            <v-col
              cols="12"
              sm="9"
              class="pt-4 pt-sm-0"
            >
              <div id="name-bc">
                {{ getExistingBusinessInfo?.bcLegalName || '[Unknown]' }}
              </div>
            </v-col>
          </v-row>
        </article>

        <!-- Date of Registration in B.C. -->
        <article
          v-if="isExpro"
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
                {{ registrationDateBc || '[Unknown]' }}
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
                {{ getExistingBusinessInfo?.homeIdentifier || '[Unknown]' }}
              </div>
            </v-col>
          </v-row>
        </article>

        <!-- Name in Home Jurisdiction -->
        <article class="section-container">
          <v-row no-gutters>
            <v-col
              cols="12"
              sm="3"
              class="pr-4"
            >
              <label>Name in Home Jurisdiction</label>
            </v-col>
            <v-col
              cols="12"
              sm="9"
              class="pt-4 pt-sm-0"
            >
              <div id="name-home">
                {{ getExistingBusinessInfo?.homeLegalName || '[Unknown]' }}
              </div>
            </v-col>
          </v-row>
        </article>

        <!-- Date of Incorporation, Continuation or Amalgamation in Home Jurisdiction -->
        <article class="section-container">
          <v-row no-gutters>
            <v-col
              cols="12"
              sm="3"
              class="pr-4"
            >
              <label>Date of Incorporation, Continuation or Amalgamation in Home Jurisdiction</label>
            </v-col>
            <v-col
              cols="12"
              sm="9"
              class="pt-4 pt-sm-0"
            >
              <div id="incorporation-date-home">
                {{ incorporationDateHome || '[Unknown]' }}
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
                {{ getExistingBusinessInfo?.taxId || '[Not Entered]' }}
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
                <!-- the director's affidavit file -->
                <li v-if="isContinuationInAffidavitRequired">
                  <template v-if="getExistingBusinessInfo.affidavitFileName">
                    <v-icon color="primary">
                      mdi-file-pdf-outline
                    </v-icon>
                    <span>{{ getExistingBusinessInfo.affidavitFileName }}</span>
                  </template>
                  <template v-else>
                    <v-icon color="error">
                      mdi-close
                    </v-icon>
                    <span>Missing Affidavit</span>
                  </template>
                </li>

                <!-- the proof of authorization files -->
                <li
                  v-for="item in getContinuationAuthorization?.files"
                  :key="item.fileKey"
                >
                  <v-icon color="primary">
                    mdi-file-pdf-outline
                  </v-icon>
                  <span>{{ item.fileName }}</span>
                </li>
                <li v-if="!getContinuationAuthorization?.files?.length">
                  <v-icon color="error">
                    mdi-close
                  </v-icon>
                  <span>Missing Authorization Files</span>
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
import { useStore } from '@/store/store'
import { RouteNames } from '@/enums'
import { ContinuationAuthorizationIF, ExistingBusinessInfoIF } from '@/interfaces'
import { DateMixin } from '@/mixins'
import { CanJurisdictions, IntlJurisdictions, UsaJurisdiction } from '@bcrs-shared-components/jurisdiction/list-data'
import { JurisdictionLocation } from '@bcrs-shared-components/enums'

@Component({})
export default class SummaryBusinessHomeJurisdiction extends Mixins(DateMixin) {
  // for template
  readonly RouteNames = RouteNames

  // Getters
  @Getter(useStore) getContinuationAuthorization!: ContinuationAuthorizationIF
  @Getter(useStore) getExistingBusinessInfo!: ExistingBusinessInfoIF
  @Getter(useStore) isContinuationInAffidavitRequired!: boolean
  @Getter(useStore) isContinuationInBusinessHomeValid!: boolean

  /** Whether the existing business is an extrapro. */
  get isExpro (): boolean {
    return this.getExistingBusinessInfo?.mode === 'EXPRO'
  }

  /** The text version of the home jurisdiction. */
  get homeJurisdiction (): string {
    const jurisdiction = this.getExistingBusinessInfo?.homeJurisdiction // may be undefined or null

    if (jurisdiction?.country === JurisdictionLocation.CA) {
      if (jurisdiction?.region === 'FEDERAL') return 'Federal'
      return CanJurisdictions.find(can => can.value === jurisdiction?.region)?.text || 'Canada'
    }

    if (jurisdiction?.country === JurisdictionLocation.US) {
      const state = UsaJurisdiction.find(usa => usa.value === jurisdiction?.region)?.text
      return (state ? `${state}, US` : 'USA')
    }

    return IntlJurisdictions.find(intl => intl.value === jurisdiction?.country)?.text || null
  }

  /** The formatted date of registration in BC. */
  get registrationDateBc (): string {
    return this.yyyyMmDdToPacificDate(this.getExistingBusinessInfo?.bcFoundingDate, true, false)
  }

  /** The formatted date of incorporation in the home jurisdiction. */
  get incorporationDateHome (): string {
    return this.yyyyMmDdToPacificDate(this.getExistingBusinessInfo?.homeIncorporationDate, true, false)
  }

  /** The formatted authorization date. */
  get authorizationDate (): string {
    return this.yyyyMmDdToPacificDate(this.getContinuationAuthorization?.date, true, false)
  }

  /** The formatted expiry date. */
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

    li:not(:first-child) {
      margin-top: 0.25rem;
    }

    li > i {
      margin-left: -2rem;
      padding-right: 10px;
    }
  }
}
</style>
