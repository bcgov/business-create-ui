<template>
  <div id="authorization-information">
    <GenericErrorDialog
      attach="#authorization-information"
      :dialog="errorDialog"
      :text="errorDialogText"
      :title="errorDialogTitle"
      @close="errorDialog = false"
    />

    <v-card
      flat
      class="py-8 px-6"
    >
      <!-- Extraprovincial Registration in B.C. -->
      <v-row
        v-if="isExpro"
        no-gutters
      >
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
          <ul class="pl-1">
            <li>
              <strong>Registration Number in B.C.:</strong>
              <span class="pl-2">{{ getExistingBusinessInfo.bcRegistrationNumber || '[Unknown]' }}</span>
            </li>
            <li>
              <strong>Registered Name in B.C.:</strong>
              <span class="pl-2">{{ getExistingBusinessInfo.bcRegisteredName || '[Unknown]' }}</span>
            </li>
            <li>
              <strong>Date of Registration in B.C.:</strong>
              <span class="pl-2">{{ registrationDateBc || '[Unknown]' }}</span>
            </li>
          </ul>
        </v-col>
      </v-row>

      <v-divider
        v-if="isExpro"
        class="my-6"
      />

      <!-- Previous Jurisdiction Information -->
      <v-row no-gutters>
        <v-col
          cols="12"
          sm="3"
          class="pr-4"
        >
          <label>Previous Jurisdiction Information</label>
        </v-col>

        <v-col
          cols="12"
          sm="9"
          class="pt-4 pt-sm-0"
        >
          <ul class="pl-1">
            <li>
              <strong>Previous Jurisdiction:</strong>
              <span class="pl-2">{{ previousJurisdiction || '[Unknown]' }}</span>
            </li>
            <li>
              <strong>Identifying Number:</strong>
              <span class="pl-2">{{ getExistingBusinessInfo.prevIncorporationNumber || '[Unknown]' }}</span>
            </li>
            <li>
              <strong>Registered Name:</strong>
              <span class="pl-2">{{ getExistingBusinessInfo.prevBusinessName || '[Unknown]' }}</span>
            </li>
            <li>
              <strong>Business Number:</strong>
              <span class="pl-2">{{ getExistingBusinessInfo.businessNumber || '[Unknown]' }}</span>
            </li>
            <li>
              <strong>Date of Incorporation, Continuation, or Amalgamation:</strong>
              <span class="pl-2">{{ prevIncorporationDate || '[Unknown]' }}</span>
            </li>
          </ul>
        </v-col>
      </v-row>

      <v-divider class="my-6" />

      <!-- Proof of Authorization -->
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
          class="mt-2 mt-sm-n1"
        >
          <!-- the proof of authorization file(s) -->
          <v-btn
            v-for="item in getContinuationInAuthorizationProof?.files"
            :key="item.fileKey"
            text
            color="primary"
            class="download-authorization-btn d-block pa-2 ml-n2 mt-n1"
            :disabled="isDownloading"
            :loading="isDownloading"
            @click="downloadAuthorizationDocument(item)"
          >
            <v-icon>mdi-file-pdf-outline</v-icon>
            <span>{{ item.fileName }}</span>
          </v-btn>
        </v-col>
      </v-row>

      <v-divider class="my-6" />

      <!-- Unlimited Liability Corporation Information -->
      <v-row
        v-if="getExistingBusinessInfo.affidavitFile"
        no-gutters
      >
        <v-col
          cols="12"
          sm="3"
          class="pr-4"
        >
          <label>Unlimited Liability Corporation Information</label>
        </v-col>

        <v-col
          cols="12"
          sm="9"
          class="mt-2 mt-sm-n1"
        >
          <!-- the affidavit / court order file -->
          <v-btn
            v-if="getExistingBusinessInfo.affidavitFileName"
            text
            color="primary"
            class="download-affidavit-btn d-block pa-2 ml-n2 mt-n1"
            :disabled="isDownloading"
            :loading="isDownloading"
            @click="downloadAffidavitDocument()"
          >
            <v-icon>mdi-file-pdf-outline</v-icon>
            <span>{{ getExistingBusinessInfo.affidavitFileName }}</span>
          </v-btn>
        </v-col>
      </v-row>

      <v-divider
        v-if="getExistingBusinessInfo.affidavitFile"
        class="my-6"
      />

      <!-- Confirmation -->
      <v-row
        v-if="isExpro"
        no-gutters
      >
        <v-col
          cols="12"
          sm="3"
          class="pr-4"
        >
          <label :class="{ 'error-text': (showErrors && !isValid) }">Confirmation</label>
        </v-col>

        <v-col
          cols="12"
          sm="9"
          class="pt-4 pt-sm-0"
        >
          <v-checkbox
            v-model="getExistingBusinessInfo.exproConfirmation"
            class="pt-0 mt-0"
            hide-details
          >
            <template #label>
              <span :class="{ 'error-text': (showErrors && !isValid) }">
                I understand that the extraprovincial registration of this business in B.C. will be
                cancelled and made historical once I submit the continuation application.
              </span>
            </template>
          </v-checkbox>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Prop, Watch } from 'vue-property-decorator'
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
export default class AuthorizationInformation extends Mixins(DateMixin, DocumentMixin) {
  @Prop({ default: false }) readonly showErrors!: boolean

  // Getters
  @Getter(useStore) getContinuationInAuthorizationProof!: AuthorizationProofIF
  @Getter(useStore) getExistingBusinessInfo!: ExistingBusinessInfoIF

  // local variables
  errorDialog = false
  errorDialogText = ''
  errorDialogTitle = ''
  isDownloading = false

  /** Whether the existing business is an extrapro. */
  get isExpro (): boolean {
    return (this.getExistingBusinessInfo.mode === 'EXPRO')
  }

  /** The formatted date of registration in BC. */
  get registrationDateBc (): string {
    return this.yyyyMmDdToPacificDate(this.getExistingBusinessInfo.bcRegistrationDate, true, false)
  }

  /** The text version of the previous jurisdiction. */
  get previousJurisdiction (): string {
    const jurisdiction = this.getExistingBusinessInfo.previousJurisdiction // may be undefined or null

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
    return this.yyyyMmDdToPacificDate(this.getExistingBusinessInfo.prevIncorporationDate, true, false)
  }

  /** Whether this component is valid. */
  get isValid (): boolean {
    // valid if this isn't an expro (ie, don't need confirmation)
    // or valid if we have confirmation (NB: may be undefined)
    return (!this.isExpro || (this.getExistingBusinessInfo.exproConfirmation === true))
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
    const documentClass = 'CORP'
    try {
      const docUrl: string = await this.getDownloadLink(documentKey, documentName, documentClass)
      const link = document.createElement('a')
      link.href = docUrl
      link.download = documentName
      link.target = '_blank' // This opens the link in a new browser tab

      // Append to the document and trigger the download
      document.body.appendChild(link)
      link.click()

      // Remove the link after the download is triggered
      document.body.removeChild(link)
      this.isDownloading = false
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('downloadDocument() error =', error)
      this.errorDialogTitle = 'Unable to download document'
      this.errorDialogText = 'An error occurred while downloading the document. Please try again.'
      this.errorDialog = true
    }
  }

  @Watch('isValid', { immediate: true })
  @Emit('valid')
  private onValidChanged (): boolean {
    return this.isValid
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

label {
  font-weight: bold;
  color: $gray9;
}

ul {
  font-size: $px-15;
  margin: 0;
  padding: 0;
  list-style-type: none;

  li:not(:first-child) {
    margin-top: 8px;
  }
}

.download-affidavit-btn,
.download-authorization-btn {
  // set button height for multi-line filenames
  height: auto !important;

  .v-icon {
    // minimum width of icons (to align them)
    min-width: 24px;
  }
  span {
    // make button text larger than default
    font-size: $px-16;
    // wrap long filenames
    text-wrap: wrap;
  }
}

// align the checkbox with the label
:deep(.v-input--checkbox .v-input__slot) {
  align-items: flex-start;
}
</style>
