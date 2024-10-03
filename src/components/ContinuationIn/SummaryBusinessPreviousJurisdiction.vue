<template>
  <div id="summary-business-previous-jurisdiction">
    <GenericErrorDialog
      attach="#summary-business-previous-jurisdiction"
      :dialog="errorDialog"
      :text="errorDialogText"
      :title="errorDialogTitle"
      @close="errorDialog = false"
    />

    <section>
      <div id="existing-business-information-summary">
        <!-- Previous Jurisdiction -->
        <article class="section-container">
          <v-row no-gutters>
            <v-col
              cols="12"
              sm="3"
              class="pr-4"
            >
              <label>Previous Jurisdiction</label>
            </v-col>
            <v-col
              cols="12"
              sm="9"
              class="pt-4 pt-sm-0"
            >
              <div id="home-jurisdiction">
                {{ previousJurisdiction || '[Unknown]' }}
              </div>
            </v-col>
          </v-row>
        </article>

        <!-- Incorporation Number -->
        <article class="section-container">
          <v-row no-gutters>
            <v-col
              cols="12"
              sm="3"
              class="pr-4"
            >
              <label>Incorporation Number</label>
            </v-col>
            <v-col
              cols="12"
              sm="9"
              class="pt-4 pt-sm-0"
            >
              <div id="identifying-number-home">
                {{ getExistingBusinessInfo?.prevIncorporationNumber || '[Unknown]' }}
              </div>
            </v-col>
          </v-row>
        </article>

        <!-- Registered Name -->
        <article class="section-container">
          <v-row no-gutters>
            <v-col
              cols="12"
              sm="3"
              class="pr-4"
            >
              <label>Registered Name</label>
            </v-col>
            <v-col
              cols="12"
              sm="9"
              class="pt-4 pt-sm-0"
            >
              <div id="name-home">
                {{ getExistingBusinessInfo?.prevBusinessName || '[Unknown]' }}
              </div>
            </v-col>
          </v-row>
        </article>

        <!-- Business Number in Previous Jurisdiction -->
        <article class="section-container">
          <v-row no-gutters>
            <v-col
              cols="12"
              sm="3"
              class="pr-4"
            >
              <label>Business Number in Previous Jurisdiction</label>
            </v-col>
            <v-col
              cols="12"
              sm="9"
              class="pt-4 pt-sm-0"
            >
              <div id="business-number">
                {{ getExistingBusinessInfo?.businessNumber || '[Not Entered]' }}
              </div>
            </v-col>
          </v-row>
        </article>

        <!-- Date of Incorporation, Continuation, or Amalgamation -->
        <article class="section-container">
          <v-row no-gutters>
            <v-col
              cols="12"
              sm="3"
              class="pr-4"
            >
              <label>Date of Incorporation, Continuation, or Amalgamation</label>
            </v-col>
            <v-col
              cols="12"
              sm="9"
              class="pt-4 pt-sm-0"
            >
              <div id="incorporation-date">
                {{ prevIncorporationDate || '[Unknown]' }}
              </div>
            </v-col>
          </v-row>
        </article>
      </div>

      <v-divider class="mx-6" />

      <div id="proof-of-authorization-summary">
        <!-- Proof of Authorization -->
        <article class="section-container">
          <v-row no-gutters>
            <v-col
              cols="12"
              sm="3"
              class="pr-4"
            >
              <label>Proof of Authorization</label>
            </v-col>
            <v-col
              cols="12"
              sm="9"
              class="file-buttons pt-2 pt-sm-0"
            >
              <!-- the director's affidavit file -->
              <template v-if="isContinuationInAffidavitRequired">
                <v-btn
                  v-if="getExistingBusinessInfo.affidavitFileName"
                  text
                  color="primary"
                  class="download-affidavit-btn mt-sm-n2 d-block px-2 ml-n2"
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
                v-for="item in getContinuationInAuthorizationProof?.files"
                :key="item.fileKey"
                text
                color="primary"
                class="download-authorization-btn d-block px-2 ml-n2"
                :disabled="isDownloading"
                :loading="isDownloading"
                @click="downloadAuthorizationDocument(item)"
              >
                <v-icon>mdi-file-pdf-outline</v-icon>
                <span>{{ item.fileName }}</span>
              </v-btn>
              <div
                v-if="!getContinuationInAuthorizationProof?.files?.length"
                class="pl-4"
              >
                <v-icon color="error">
                  mdi-close
                </v-icon>
                <span class="pl-2">Missing Authorization File(s)</span>
              </div>

              <!-- *** TODO: add approval checkbox here -->
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
import { AuthorizationProofIF, ExistingBusinessInfoIF } from '@/interfaces'
import { DateMixin, DocumentMixin } from '@/mixins'
import { CanJurisdictions, IntlJurisdictions, UsaJurisdiction } from '@bcrs-shared-components/jurisdiction/list-data'
import { JurisdictionLocation } from '@bcrs-shared-components/enums'

@Component({
  components: {
    GenericErrorDialog
  }
})
export default class SummaryBusinessPreviousJurisdiction extends Mixins(DateMixin, DocumentMixin) {
  // Getters
  @Getter(useStore) getContinuationInAuthorizationProof!: AuthorizationProofIF
  @Getter(useStore) getExistingBusinessInfo!: ExistingBusinessInfoIF
  @Getter(useStore) isContinuationInAffidavitRequired!: boolean

  // local variables
  errorDialog = false
  errorDialogText = ''
  errorDialogTitle = ''
  isDownloading = false

  /** The text version of the previous jurisdiction. */
  get previousJurisdiction (): string {
    const jurisdiction = this.getExistingBusinessInfo?.previousJurisdiction // may be undefined or null

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

  /** The formatted date of incorporation, continuation, or amalgamation in the previous jurisdiction. */
  get prevIncorporationDate (): string {
    return this.yyyyMmDdToPacificDate(this.getExistingBusinessInfo?.prevIncorporationDate, true, false)
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

// reduce top whitespace for all articles except first one
article:not(:first-child) {
  padding-top: 1.25rem;
}

// clear bottom whitespace for all articles except last one
article:not(:last-child) {
  padding-bottom: 0;
}

// vertically align file buttons with label
.file-buttons {
  margin-top: -6px !important;
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
