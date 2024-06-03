<template>
  <div>
    <!-- Upload Affidavit -->
    <p>
      Upload the affidavit from the directors.
    </p>

    <ul>
      <li>Use a white background and a legible font with contrasting font colour</li>
      <li>PDF file type (maximum 30 MB file size)</li>
    </ul>

    <FileUploadPreview
      class="mt-4"
      inputFileLabel="Affidavit from directors"
      :maxSize="MAX_FILE_SIZE"
      :pdfPageSize="PdfPageSize.LETTER_SIZE"
      :hint="business.affidavitFile ? 'File uploaded' : undefined"
      :inputFile="business.affidavitFile"
      :showErrors="getShowErrors"
      :customErrorMessage.sync="customErrorMessage"
      :isRequired="getShowErrors"
      @fileValidity="onFileValidity($event)"
      @fileSelected="onFileSelected($event)"
    />
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator'
import { Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import { StatusCodes } from 'http-status-codes'
import { DateMixin, DocumentMixin } from '@/mixins'
import { ExistingBusinessInfoIF, PresignedUrlIF } from '@/interfaces'
import { PdfPageSize } from '@/enums'
import FileUploadPreview from '@/components/common/FileUploadPreview.vue'
@Component({
  components: {
    FileUploadPreview
  }
})
export default class UploadAffidavit extends Mixins(DateMixin, DocumentMixin) {
  readonly PdfPageSize = PdfPageSize

  @Getter(useStore) getKeycloakGuid!: string
  @Getter(useStore) getShowErrors!: boolean

  // The business is the same object that the parent is working with
  @Prop({ default: null }) readonly business!: ExistingBusinessInfoIF

  // Local properties
  customErrorMessage = ''
  fileValidity = false

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
   */
  async onFileSelected (file: File): Promise<void> {
    if (file) {
      if (this.fileValidity) {
        // try to upload to Minio
        let psu: PresignedUrlIF
        try {
          psu = await this.getPresignedUrl(file.name)
          const res = await this.uploadToUrl(psu.preSignedUrl, file, psu.key, this.getKeycloakGuid)
          if (!res || res.status !== StatusCodes.OK) throw new Error()
        } catch {
          // put file uploader into manual error mode by setting custom error message
          this.customErrorMessage = this.UPLOAD_FAILED_MESSAGE
          this.$forceUpdate() // force file upload component to react
          return // don't add to list
        }

        // add properties reactively to business object, it is the same object the parent is working with
        this.$set(this.business, 'affidavitFile', {
          name: file.name,
          lastModified: file.lastModified,
          size: file.size
        } as File)
        this.$set(this.business, 'affidavitFileKey', psu.key)
        this.$set(this.business, 'affidavitFileName', file.name)
      }
    } else {
      // delete properties reactively when the file is cleared
      this.$delete(this.business, 'affidavitFile')
      this.$delete(this.business, 'affidavitFileKey')
      this.$delete(this.business, 'affidavitFileName')
      // FUTURE: should also delete the file from Minio
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

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
  </style>
