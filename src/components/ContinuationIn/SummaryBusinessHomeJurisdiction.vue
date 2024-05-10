<template>
  <div id="summary-business-home-jurisdiction">
    <section :class="{ 'invalid-section': !isContinuationInBusinessHomeValid }">
      <div
        v-if="!isContinuationInBusinessHomeValid"
        class="businessHomeStepErrorMessage"
      >
        <span>
          <v-icon color="error">mdi-information-outline</v-icon>
          <span class="error-text mx-1">This step is unfinished.</span>

          <router-link
            :to="{ path: `/${RouteNames.CONTINUATION_IN_BUSINESS_HOME}` }"
          >Return to this step to finish it</router-link>
        </span>
      </div>

      <div class="existing-business-information-summary">
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

        <!-- Identifying Number in Home Jurisdiction -->
        <article class="section-container">
          <v-row no-gutters>
            <v-col
              cols="12"
              sm="3"
              class="pr-4"
            >
              <label>Identifying Number in Home Jurisdiction</label>
            </v-col>
            <v-col
              cols="12"
              sm="9"
              class="pt-4 pt-sm-0"
            >
              <div id="identifying-number">
                {{ identifier || '[Unknown]' }}
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
              <div id="name">
                {{ name || '[Unknown]' }}
              </div>
            </v-col>
          </v-row>
        </article>

        <!-- Incorporation Date in Home Jurisdiction -->
        <article class="section-container">
          <v-row no-gutters>
            <v-col
              cols="12"
              sm="3"
              class="pr-4"
            >
              <label>Incorporation Date in Home Jurisdiction</label>
            </v-col>
            <v-col
              cols="12"
              sm="9"
              class="pt-4 pt-sm-0"
            >
              <div id="incorporation-date">
                {{ incorporationDate || '[Unknown]' }}
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
                {{ businessNumber || '[Unknown]' }}
              </div>
            </v-col>
          </v-row>
        </article>

        <!-- Extraprovincial Registration in B.C. -->
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
              <label>Extraprovincial Registration in B.C.</label>
            </v-col>
            <v-col
              cols="12"
              sm="9"
              class="pt-4 pt-sm-0"
            >
              <div id="extrapro-registration">
                {{ extraproRegistration }}
              </div>
            </v-col>
          </v-row>
        </article>
      </div>

      <v-divider class="mx-6" />

      <div class="continuation-authorization-summary">
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

              <ul
                id="continuation-authorization-confirm"
                class="mt-4"
              >
                <li>
                  <v-icon
                    v-if="getContinuationAuthorization?.isConfirmed"
                    color="green darken-2"
                  >
                    mdi-check
                  </v-icon>
                  <v-icon
                    v-else
                    color="error"
                  >
                    mdi-close
                  </v-icon>
                  <span>I confirm that I have current and valid authorization to continue this business
                    into B.C.</span>
                </li>
              </ul>
            </v-col>
          </v-row>
        </article>

        <v-divider class="mx-6 mt-8 mb-3" />

        <!-- Authority Name -->
        <article class="section-container">
          <v-row no-gutters>
            <v-col
              cols="12"
              sm="3"
              class="pr-4"
            >
              <label>Authority Name</label>
            </v-col>
            <v-col
              cols="12"
              sm="9"
              class="pt-4 pt-sm-0"
            >
              <div id="authority-name">
                {{ getContinuationAuthorization?.authorityName || '[Unknown]' }}
              </div>
            </v-col>
          </v-row>
        </article>

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
                {{ expiryDate || '[Unknown]' }}
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
export default class SummaryDefineCompany extends Mixins(DateMixin) {
  // for template
  readonly RouteNames = RouteNames

  // Getters
  @Getter(useStore) getContinuationAuthorization!: ContinuationAuthorizationIF
  @Getter(useStore) getExistingBusinessInfo!: ExistingBusinessInfoIF
  @Getter(useStore) isContinuationInBusinessHomeValid!: boolean

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

  /** The identifier in the home jurisdiction. */
  get identifier (): string {
    return this.getExistingBusinessInfo?.identifier
  }

  /** The name in the home jurisdiction. */
  get name (): string {
    return this.getExistingBusinessInfo?.legalName
  }

  /** The incorporation date in the home jurisdiction. */
  get incorporationDate (): string {
    return this.getExistingBusinessInfo?.incorporationDate
  }

  /** The business number (aka tax id). */
  get businessNumber (): string {
    return this.getExistingBusinessInfo?.taxId
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
.continuation-authorization-summary {
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
