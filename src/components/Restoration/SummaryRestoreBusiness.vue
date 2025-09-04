<template>
  <div id="summary-restore-business">
    <section :class="{ 'invalid-section': !isRestoreBusinessNameValid }">
      <div
        v-if="!isRestoreBusinessNameValid"
        class="restore-business-step-error-message pt-5 pl-5"
      >
        <span>
          <v-icon color="error">mdi-information-outline</v-icon>
          <span class="error-text mx-1">This step is unfinished.</span>
          <router-link
            :to="{ path: `/${RouteNames.RESTORATION_BUSINESS_NAME}` }"
          >Return to this step to finish it</router-link>
        </span>
      </div>

      <article class="section-container">
        <!-- Name -->
        <v-row no-gutters>
          <v-col
            cols="12"
            sm="3"
            class="pr-4"
          >
            <label>Name</label>
          </v-col>

          <v-col
            cols="12"
            sm="9"
            class="pt-4 pt-sm-0"
          >
            <div id="company-name">
              {{ companyName }}
            </div>
            <div id="company-description">
              {{ entityDescription }}
            </div>
          </v-col>
        </v-row>

        <!-- Name Translation -->
        <v-row
          v-if="getNameTranslations && getNameTranslations.length > 0"
          no-gutters
          class="mt-6"
        >
          <v-col
            cols="12"
            sm="3"
            class="pr-4"
          >
            <label>Name Translation</label>
          </v-col>
          <v-col
            cols="12"
            sm="9"
          >
            <div
              v-for="(nameTranslation, index) in getNameTranslations"
              :key="`name-translation-${index}`"
              class="name-translation text-uppercase"
            >
              {{ nameTranslation.name }}
            </div>
          </v-col>
        </v-row>
      </article>

      <v-divider class="mx-6" />

      <article class="section-container">
        <!-- Restoration Type -->
        <v-row no-gutters>
          <v-col
            cols="12"
            sm="3"
            class="pr-4"
          >
            <label>Restoration Type</label>
          </v-col>

          <v-col
            cols="12"
            sm="9"
          >
            <template v-if="isLimitedRestorationFiling">
              <p id="limited-restoration">
                Limited Restoration
              </p>
              <p id="expires-on">
                Expires on {{ expiry }}
              </p>
            </template>
            <template v-else-if="isFullRestorationFiling">
              <p id="full-restoration">
                Full Restoration
              </p>
              <p id="applicants-relationships">
                Applicant's relationship(s): {{ relationships }}
              </p>
            </template>
            <template v-else>
              <p id="unknown-restoration-type">
                [Unknown]
              </p>
            </template>
          </v-col>
        </v-row>

        <!-- Approval Type -->
        <v-row
          no-gutters
          class="mt-6"
        >
          <v-col
            cols="12"
            sm="3"
            class="pr-4"
          >
            <label>Approval Type</label>
          </v-col>

          <v-col
            cols="12"
            sm="9"
          >
            <template v-if="getRestoration.approvalType === ApprovalTypes.VIA_COURT_ORDER">
              <label>Approved by Court Order</label><br>
              <p id="court-order-number">
                Court Order Number: {{ getRestoration.courtOrder.fileNumber }}
              </p>
            </template>

            <template v-else-if="getRestoration.approvalType === ApprovalTypes.VIA_REGISTRAR">
              <label>Approved by Registrar</label>
              <p id="notice-date">
                BC Gazette publish date: {{ noticeDate }}
              </p>
              <p id="application-date">
                Application for Restoration mailed date: {{ applicationDate }}
              </p>
            </template>

            <template v-else>
              <p id="unknown-approval-type">
                [Unknown]
              </p>
            </template>
          </v-col>
        </v-row>
      </article>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { DateMixin } from '@/mixins'
import { Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import { ApprovalTypes, RouteNames } from '@/enums'
import { CorrectNameOptions } from '@bcrs-shared-components/enums/'
import { NameTranslationIF, RestorationStateIF } from '@/interfaces'
import { CorpTypeCd, GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'

@Component({})
export default class SummaryRestoreBusiness extends Mixins(DateMixin) {
  @Getter(useStore) getEntityType!: CorpTypeCd
  @Getter(useStore) getCorrectNameOption!: CorrectNameOptions
  @Getter(useStore) getNameRequestApprovedName!: string
  @Getter(useStore) getNameTranslations!: NameTranslationIF[]
  @Getter(useStore) getRestoration!: RestorationStateIF
  @Getter(useStore) isRestoreBusinessNameValid!: boolean
  @Getter(useStore) isLimitedRestorationFiling!: boolean
  @Getter(useStore) isFullRestorationFiling!: boolean

  // for template
  readonly RouteNames = RouteNames
  readonly ApprovalTypes = ApprovalTypes

  /** The company name. */
  get companyName (): string {
    switch (this.getCorrectNameOption) {
      case CorrectNameOptions.CORRECT_NAME:
        break // not applicable to restoration
      case CorrectNameOptions.CORRECT_NAME_TO_NUMBER:
        return this.getNameRequestApprovedName
      case CorrectNameOptions.CORRECT_NEW_NR:
        return this.getNameRequestApprovedName
      case CorrectNameOptions.CORRECT_NEW_NR_STAFF:
        return this.getNameRequestApprovedName
    }
    return '[Unknown]'
  }

  /** The entity description. */
  get entityDescription (): string {
    return GetCorpFullDescription(this.getEntityType)
  }

  get expiry (): string {
    return this.yyyyMmDdToPacificDate(this.getRestoration.expiry)
  }

  get relationships (): string {
    return this.getRestoration.relationships.join(', ') || '[Unknown]'
  }

  get noticeDate (): string {
    return this.yyyyMmDdToPacificDate(this.getRestoration.noticeDate)
  }

  get applicationDate (): string {
    return this.yyyyMmDdToPacificDate(this.getRestoration.applicationDate)
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.v-icon.mdi-information-outline {
  margin-top: -2px;
}

#company-name {
  font-size: $px-22;
  font-weight: bold;
  color: $gray9;
}

p {
  margin-bottom: 0;
}

#limited-restoration,
#full-restoration {
  font-weight: bold;
  color: $gray9;
}

#company-description,
.name-translation,
#expires-on,
#applicants-relationships,
#court-order-number,
#notice-date,
#application-date,
#unknown-restoration-type,
#unknown-approval-type {
  color: $gray7;
}
</style>
