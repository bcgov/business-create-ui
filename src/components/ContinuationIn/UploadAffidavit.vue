<template>
  <div id="upload-affidavit">
    <!-- Upload Affidavit -->
    <p :class="{ 'error-text': getShowErrors && !affivaditFileValid }">
      Upload the affidavit from the directors.
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
      :disabled="affivaditFileValid"
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
      v-if="affivaditFileValid"
      class="dk-gray-background rounded d-flex justify-space-between align-center mt-5 px-2 py-2"
    >
      <v-icon>mdi-paperclip</v-icon>
      <div class="document-details mr-auto pl-2">
        {{ business.affidavitFile.name }}
        <span class="pl-2">({{ friendlyFileSize(business.affidavitFile) }})</span>
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
  </div>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Prop, Watch } from 'vue-property-decorator'
import { Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import { StatusCodes } from 'http-status-codes'
import { DateMixin, DocumentMixin } from '@/mixins'
import { ExistingBusinessInfoIF, PresignedUrlIF } from '@/interfaces'
import FileUploadPreview from '@/components/common/FileUploadPreview.vue'
@Component({
  components: {
    FileUploadPreview
  }
})
export default class UploadAffidavit extends Mixins(DateMixin, DocumentMixin) {
  // Refs
  $refs!: {
    fileUploadPreview: FileUploadPreview
  }

  @Getter(useStore) getKeycloakGuid!: string
  @Getter(useStore) getShowErrors!: boolean

  // The business is the same object that the parent is working with
  @Prop({ default: null }) readonly business!: ExistingBusinessInfoIF

  // Local properties
  customErrorMessage = ''
  fileValidity = false
  isDocumentLoading = false

  /** Whether the affidavit file is valid. */
  get affivaditFileValid (): boolean {
    // assume valid if file object is present
    return !!this.business.affidavitFile
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
        psu = await this.getPresignedUrl(file.name)
        const res = await this.uploadToUrl(psu.preSignedUrl, file, psu.key, this.getKeycloakGuid)
        if (!res || res.status !== StatusCodes.OK) throw new Error()
      } catch {
        // set error message
        this.customErrorMessage = this.UPLOAD_FAILED_MESSAGE
        return // don't add to array
      } finally {
        this.isDocumentLoading = false
      }

      // add properties reactively to business object
      // (it is the same object the parent is working with)
      this.$set(this.business, 'affidavitFile', {
        name: file.name,
        lastModified: file.lastModified,
        size: file.size
      } as File)
      this.$set(this.business, 'affidavitFileKey', psu.key)
      this.$set(this.business, 'affidavitFileName', file.name)
    }
  }

  /** Called when user clicks a Remove button. */
  onRemoveClicked (): void {
    // delete file from Minio, not waiting for response and ignoring errors
    this.deleteDocument(this.business.affidavitFileKey).catch(() => null)
    // delete properties reactively
    this.$delete(this.business, 'affidavitFile')
    this.$delete(this.business, 'affidavitFileKey')
    this.$delete(this.business, 'affidavitFileName')
    // clear any existing error message
    this.customErrorMessage = ''
  }

  @Watch('affivaditFileValid', { immediate: true })
  @Emit('valid')
  private onComponentValid (): boolean {
    return this.affivaditFileValid
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

li {
  color: $gray7;
}

// style the upload affidavit bullets
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
}

// align the remove icon with the button label
.v-icon.mdi-close {
  padding-top: 1px;
}
</style>
