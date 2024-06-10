<template>
  <div id="summary-business-home-jurisdiction">
    <GenericErrorDialog
      attach="#summary-business-home-jurisdiction"
      :dialog="errorDialog"
      :text="errorDialogText"
      :title="errorDialogTitle"
      @close="errorDialog = false"
    />

    <section :class="{ 'invalid-section': !isContinuationInBusinessHomeValid }">
      <div
        v-if="!isContinuationInBusinessHomeValid"
        class="business-home-step-error-message pt-5 pl-5"
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
              <div id="identifying-number-home">
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

        <!-- Date of Incorporation -->
        <article class="section-container">
          <v-row no-gutters>
            <v-col
              cols="12"
              sm="3"
              class="pr-4"
            >
              <label>Date of Incorporation</label>
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
            >
              <!-- the director's affidavit file -->
              <template v-if="isContinuationInAffidavitRequired">
                <v-btn
                  v-if="getExistingBusinessInfo.affidavitFileName"
                  text
                  color="primary"
                  class="download-affidavit-btn mt-sm-n2 d-block"
                  :disabled="isDownloading"
                  :loading="isDownloading"
                  @click="downloadAffidavitDocument()"
                >
                  <v-icon>mdi-file-pdf-outline</v-icon>
                  <span>{{ getExistingBusinessInfo.affidavitFileName }}</span>
                </v-btn>
                <div
                  v-else
                  class="pl-4"
                >
                  <v-icon color="error">
                    mdi-close
                  </v-icon>
                  <span class="pl-2">Missing Affidavit</span>
                </div>
              </template>

              <!-- the proof of authorization file(s) -->
              <v-btn
                v-for="item in getContinuationAuthorization?.files"
                :key="item.fileKey"
                text
                color="primary"
                class="download-authorization-btn d-block"
                :disabled="isDownloading"
                :loading="isDownloading"
                @click="downloadAuthorizationDocument(item)"
              >
                <v-icon>mdi-file-pdf-outline</v-icon>
                <span>{{ item.fileName }}</span>
              </v-btn>
              <div
                v-if="!getContinuationAuthorization?.files?.length"
                class="pl-4"
              >
                <v-icon color="error">
                  mdi-close
                </v-icon>
                <span class="pl-2">Missing Authorization File(s)</span>
              </div>
            </v-col>
          </v-row>
        </article>

        <v-divider class="mx-6 mt-6 mb-3" />

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
import { GenericErrorDialog } from '@/dialogs/'
import { RouteNames } from '@/enums'
import { ContinuationAuthorizationIF, ExistingBusinessInfoIF } from '@/interfaces'
import { DateMixin, DocumentMixin } from '@/mixins'
import { CanJurisdictions, IntlJurisdictions, UsaJurisdiction } from '@bcrs-shared-components/jurisdiction/list-data'
import { JurisdictionLocation } from '@bcrs-shared-components/enums'

@Component({
  components: {
    GenericErrorDialog
  }
})
export default class SummaryBusinessHomeJurisdiction extends Mixins(DateMixin, DocumentMixin) {
  // for template
  readonly RouteNames = RouteNames

  // Getters
  @Getter(useStore) getContinuationAuthorization!: ContinuationAuthorizationIF
  @Getter(useStore) getExistingBusinessInfo!: ExistingBusinessInfoIF
  @Getter(useStore) isContinuationInAffidavitRequired!: boolean
  @Getter(useStore) isContinuationInBusinessHomeValid!: boolean

  // local variables
  errorDialog = false
  errorDialogText = ''
  errorDialogTitle = ''
  isDownloading = false

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

  /** Downloads the director affidavit document. */
  async downloadAffidavitDocument (): Promise<void> {
    await this.download(this.getExistingBusinessInfo.affidavitFileKey,
      this.getExistingBusinessInfo.affidavitFileName)
  }

  /** Downloads the specified authorization document. */
  async downloadAuthorizationDocument (item: { fileKey: string, fileName: string }): Promise<void> {
    await this.download(item.fileKey, item.fileName)
  }

  private async download (documentKey: string, documentName: string): Promise<void> {
    if (!documentKey || !documentName) return // safety check

    this.isDownloading = true
    await this.downloadDocument(documentKey, documentName).catch(error => {
      // eslint-disable-next-line no-console
      console.log('fetchDocument() error =', error)
      this.errorDialogTitle = 'Unable to download document'
      this.errorDialogText = 'We were unable to download your document. If this error persists, please contact us.'
      this.errorDialog = true
    })
    this.isDownloading = false
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

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

.download-affidavit-btn,
.download-authorization-btn {
  // nudge icon down a bit to line up with text
  .v-icon {
    margin-top: 2px;
  }
  // make button text larger than default
  span {
    font-size: $px-16;
  }
}
</style>
