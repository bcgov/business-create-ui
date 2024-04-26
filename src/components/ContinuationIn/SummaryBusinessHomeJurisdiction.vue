<template>
  <div id="summary-business-home-jurisdiction">
    <section :class="{ 'invalid-section': !isContinuationInStep1Valid }">
      <div
        v-if="!isContinuationInStep1Valid"
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
                {{ identifyingNumber || '[Unknown]' }}
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
              <div id="business-name">
                {{ businessName || '[Unknown]' }}
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
        <template v-if="extraproRegistration">
          <article class="section-container">
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
        </template>
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
              <div id="continuation-authorization">
                {{ continuationAuthorization || '[Unknown]' }}
              </div>
            </v-col>
          </v-row>
        </article>

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
                {{ authorityName || '[Unknown]' }}
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
import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'pinia-class'
import { getName } from 'country-list'
import { useStore } from '@/store/store'
import { RouteNames } from '@/enums'

@Component({})
export default class SummaryDefineCompany extends Vue {
  // for template
  readonly RouteNames = RouteNames

  // Getters
  @Getter(useStore) getContinuationInBusinessInfo!: any
  @Getter(useStore) isContinuationInStep1Valid!: boolean

  get homeJurisdiction (): string {
    const hj = this.getContinuationInBusinessInfo?.homeJurisdiction
    if (hj?.country) {
      const country = getName(hj.country)
      const region = (hj.region === 'FEDERAL' ? 'Federal' : hj.region)
      if (region) return `${region}, ${country}`
      return country
    }
    return null
  }

  get identifyingNumber (): string {
    return this.getContinuationInBusinessInfo?.homeIdentifier
  }

  get businessName (): string {
    return this.getContinuationInBusinessInfo?.homeName
  }

  get incorporationDate (): string {
    return this.getContinuationInBusinessInfo?.registrationDate
  }

  get businessNumber (): string {
    return this.getContinuationInBusinessInfo?.bn
  }

  get extraproRegistration (): string {
    if (this.getContinuationInBusinessInfo?.mode === 'LOOKUP') {
      const identifier = this.getContinuationInBusinessInfo?.identifier
      const name = this.getContinuationInBusinessInfo?.name
      if (identifier && name) return `${identifier} - ${name}`
    }
    return null
  }

  get continuationAuthorization (): string {
    return null // FUTURE: implement this
  }

  get authorityName (): string {
    return null // FUTURE: implement this
  }

  get authorizationDate (): string {
    return null // FUTURE: implement this
  }

  get expiryDate (): string {
    return null // FUTURE: implement this
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
</style>
