<template>
  <div id="summary-extraprovincial-registration">
    <section>
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
              {{ getExistingBusinessInfo?.bcRegistrationNumber || '[Unknown]' }}
            </div>
          </v-col>
        </v-row>
      </article>

      <!-- Registered Name in B.C.-->
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
            <label>Registered Name in B.C.</label>
          </v-col>
          <v-col
            cols="12"
            sm="9"
            class="pt-4 pt-sm-0"
          >
            <div id="name-bc">
              {{ getExistingBusinessInfo?.bcRegisteredName || '[Unknown]' }}
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

      <!-- *** TODO: add confirmation checkbox here -->
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import { ExistingBusinessInfoIF } from '@/interfaces'
import { DateMixin } from '@/mixins'

@Component({})
export default class SummaryExtraprovincialRegistration extends Mixins(DateMixin) {
  // Getters
  @Getter(useStore) getExistingBusinessInfo!: ExistingBusinessInfoIF

  /** Whether the existing business is an extrapro. */
  get isExpro (): boolean {
    return this.getExistingBusinessInfo?.mode === 'EXPRO'
  }

  /** The formatted date of registration in BC. */
  get registrationDateBc (): string {
    return this.yyyyMmDdToPacificDate(this.getExistingBusinessInfo?.bcRegistrationDate, true, false)
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
