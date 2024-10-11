<template>
  <div id="summary-extraprovincial-registration">
    <section :class="{ 'invalid-section': invalidSection }">
      <div
        v-if="invalidSection"
        class="business-bc-error-message pt-5 pl-5"
      >
        <v-icon color="error">
          mdi-information-outline
        </v-icon>
        <span class="error-text mx-1">This step is unfinished.</span>

        <router-link
          :to="{ path: `/${RouteNames.CONTINUATION_IN_BUSINESS_BC}` }"
        >
          <span>Return to this step to finish it</span>
        </router-link>
      </div>

      <!-- Registration Number in B.C. -->
      <article class="section-container">
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
              {{ getExistingBusinessInfo.bcRegistrationNumber || '[Unknown]' }}
            </div>
          </v-col>
        </v-row>
      </article>

      <!-- Registered Name in B.C.-->
      <article class="section-container">
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
            <div id="name-bc">
              {{ getExistingBusinessInfo.bcRegisteredName || '[Unknown]' }}
            </div>
          </v-col>
        </v-row>
      </article>

      <!-- Date of Registration in B.C. -->
      <article class="section-container">
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

      <!-- Confirmation -->
      <article class="section-container">
        <v-row no-gutters>
          <v-col
            cols="12"
            sm="3"
            class="pr-4"
          >
            <label>Confirmation</label>
          </v-col>
          <v-col
            cols="12"
            sm="9"
            class="pt-4 pt-sm-0 d-flex align-start"
          >
            <template v-if="getExistingBusinessInfo.exproConfirmation">
              <v-icon
                color="green darken-2"
              >
                mdi-check
              </v-icon>
              <span class="ml-2">I understand that the extraprovincial registration of this business in B.C.
                will be cancelled and made historical once I submit the continuation application.</span>
            </template>
            <span v-else>(Not entered)            </span>
          </v-col>
        </v-row>
      </article>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import { ExistingBusinessInfoIF } from '@/interfaces'
import { DateMixin } from '@/mixins'
import { RouteNames } from '@/enums'

@Component({})
export default class SummaryExtraprovincialRegistration extends Mixins(DateMixin) {
  // for template
  readonly RouteNames = RouteNames

  // Getters
  @Getter(useStore) getExistingBusinessInfo!: ExistingBusinessInfoIF

  /** Whether this section is invalid. */
  get invalidSection (): boolean {
    return !this.getExistingBusinessInfo.exproConfirmation
  }

  /** The formatted date of registration in BC. */
  get registrationDateBc (): string {
    return this.yyyyMmDdToPacificDate(this.getExistingBusinessInfo.bcRegistrationDate, true, false)
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

// reduce top whitespace for all articles except first one
article:not(:first-child) {
  padding-top: 1.25rem;
}

// clear bottom whitespace for all articles except last one
article:not(:last-child) {
  padding-bottom: 0;
}
</style>
