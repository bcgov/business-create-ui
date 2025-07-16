<template>
  <div
    v-if="getExistingBusinessInfo"
    id="unlimited-liability-corporation-information"
  >
    <!-- Upload Files -->
    <v-card
      flat
      class="py-8 px-6"
      :class="{ 'invalid-section': getShowErrors && !componentValid }"
    >
      <!-- Upload File -->
      <v-row no-gutters>
        <v-col
          cols="12"
          sm="3"
          class="pr-4"
        >
          <label class="font-weight-bold colour-dk-text">Upload File</label>
        </v-col>

        <v-col
          cols="12"
          sm="9"
          class="pt-4 pt-sm-0"
        >
          <p :class="{ 'error-text': getShowErrors && !componentValid }">
            You are required to provide either a <strong>Director's Affidavit</strong> or a
            <strong>Court Order</strong>. This will be reviewed by BC Registries.
          </p>

          <ul>
            <li>Use a white background and a legible font with contrasting font colour</li>
            <li>PDF file type (maximum 30 MB file size)</li>
          </ul>

          <v-btn
            id="add-affidavit-button"
            outlined
            color="primary"
            class="btn-outlined-primary mt-4"
            :disabled="componentValid"
            :loading="isDocumentLoading"
            @click="onClickAddDocumentButton()"
          >
            <v-icon>mdi-plus</v-icon>
            <span>Add a Document</span>
          </v-btn>

          <p
            v-if="customErrorMessage"
            class="error-text mt-4 mb-0"
          >
            {{ customErrorMessage }}
          </p>

          <FileUploadPreview
            ref="fileUploadPreview"
            class="d-none"
            :maxSize="MAX_FILE_SIZE"
            :customErrorMessage.sync="customErrorMessage"
            :isRequired="false"
            @fileValidity="onFileValidity($event)"
            @fileSelected="onFileSelected($event)"
          />

          <div
            v-if="getExistingBusinessInfo.affidavitFile"
            class="dk-gray-background rounded d-flex justify-space-between align-center mt-5 px-2 py-2"
          >
            <v-icon>mdi-paperclip</v-icon>
            <div class="document-details mr-auto pl-2">
              {{ getExistingBusinessInfo.affidavitFile.name }}
              <span class="pl-2">({{ friendlyFileSize(getExistingBusinessInfo.affidavitFile) }})</span>
            </div>
            <v-btn
              class="remove-document-button"
              text
              color="primary"
              @click="onRemoveClicked()"
            >
              <span>Remove</span>
              <v-icon dense>
                mdi-close
              </v-icon>
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { StatusCodes } from 'http-status-codes'
import { useStore } from '@/store/store'
import { DateMixin, DocumentMixin } from '@/mixins'
import { ExistingBusinessInfoIF, PresignedUrlIF } from '@/interfaces'
import FileUploadPreview from '../common/FileUploadPreview.vue'
import { LegalServices } from '@/services'

@Component({
  components: {
    FileUploadPreview
  }
})
export default class UnlimitedLiabilityCorporationInformation extends Mixins(DateMixin, DocumentMixin) {
  // Refs
  $refs!: {
    fileUploadPreview: FileUploadPreview
  }

  @Getter(useStore) getCurrentDate!: string
  @Getter(useStore) getExistingBusinessInfo!: ExistingBusinessInfoIF
  @Getter(useStore) getKeycloakGuid!: string
  @Getter(useStore) getShowErrors!: boolean

  @Action(useStore) setExistingBusinessInfo!: (x: ExistingBusinessInfoIF) => void
  @Action(useStore) setHaveChanges!: (x: boolean) => void

  // Local properties
  customErrorMessage = ''
  fileValidity = false
  isDocumentLoading = false

  /** Whether this component is valid. */
  get componentValid (): boolean {
    // assume valid if file object is present
    return !!this.getExistingBusinessInfo.affidavitFile
  }

  /** When user has clicked the Add button, opens the file selection dialog. */
  onClickAddDocumentButton (): void {
    this.$refs.fileUploadPreview.clickFileInput()
  }

  /**
   * Called when FileUploadPreview tells us whether a file is valid.
   * This is called right before the File Selected event.
   */
  onFileValidity (valid: boolean): void {
    this.fileValidity = valid
  }

  /**
   * Called when FileUploadPreview tells us about a new or cleared file.
   * This is called right after the File Validity event.
   * @param file the file to add
   */
  async onFileSelected (file: File): Promise<void> {
    /** Returns True if given string contains only Latin 1 (ie, ISO8859-1) characters. */
    function isValidLatin1 (str: string): boolean {
      // eslint-disable-next-line no-control-regex
      return !/[^\u0000-\u00ff]/g.test(str)
    }

    // verify that file is specified and is valid
    if (file && this.fileValidity) {
      // verify file name encoding
      if (!isValidLatin1(file.name)) {
        // set error message
        this.customErrorMessage = 'Invalid character in file name.'
        return // don't add to array
      }

      // try to upload to Minio
      let psu: PresignedUrlIF
      try {
        this.isDocumentLoading = true
        psu = await LegalServices.getPresignedUrl(file.name)
        const res = await LegalServices.uploadToUrl(psu.preSignedUrl, file, psu.key, this.getKeycloakGuid)
        if (!res || res.status !== StatusCodes.OK) throw new Error()
      } catch {
        // set error message
        this.customErrorMessage = this.UPLOAD_FAILED_MESSAGE
        return // don't add to array
      } finally {
        this.isDocumentLoading = false
      }

      // add properties reactively to business object
      this.$set(this.getExistingBusinessInfo, 'affidavitFile', {
        name: file.name,
        lastModified: file.lastModified,
        size: file.size
      } as File)
      this.$set(this.getExistingBusinessInfo, 'affidavitFileKey', psu.key)
      this.$set(this.getExistingBusinessInfo, 'affidavitFileName', file.name)

      // user has changed something
      this.setHaveChanges(true)
    }
  }

  /**
   * Called when user clicks Remove button.
   * May also be called by parent component to remove the file info.
   */
  onRemoveClicked (): void {
    // delete file from Minio, not waiting for response and ignoring errors
    LegalServices.deleteDocument(this.getExistingBusinessInfo.affidavitFileKey).catch(() => null)

    // delete properties reactively
    this.$delete(this.getExistingBusinessInfo, 'affidavitFile')
    this.$delete(this.getExistingBusinessInfo, 'affidavitFileKey')
    this.$delete(this.getExistingBusinessInfo, 'affidavitFileName')

    // clear any existing error message
    this.customErrorMessage = ''

    // user has changed something
    this.setHaveChanges(true)
  }

  /** Watches for changes to affidavit file object and emits form validity. */
  @Watch('getExistingBusinessInfo.affidavitFile', { deep: true, immediate: true })
  @Emit('valid')
  private onComponentValid (): boolean {
    return this.componentValid
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

// style the bullets
ul {
  list-style: none;
  color: $gray7;

  li::before {
    content: "\2022";
    display: inline-block;
    width: 1.25em;
    margin-left: -1.5em;
    padding-left: 0.25rem;
  }

  li {
    color: $gray7;
  }
}

// align the remove icon with the button label
.v-icon.mdi-close {
  padding-top: 1px;
}
</style>
