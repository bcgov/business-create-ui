<template>
  <v-form
    ref="form"
    lazy-validation
  >
    <v-file-input
      v-model="fileUpload"
      label="Select a file to upload"
      filled
      dense
      accept=".pdf"
      class="file-upload-preview"
      :rules="fileUploadRules"
      show-size
      color="primary"
      :hint="hint"
      hide-details="auto"
      persistent-hint
      :error-messages="customErrorMessages"
      @change="onChange($event)"
    />
  </v-form>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Prop, Watch } from 'vue-property-decorator'
import { DocumentMixin } from '@/mixins'
import { PdfPageSize } from '@/enums'
import { FormIF } from '@/interfaces'

@Component({})
export default class FileUploadPreview extends Mixins(DocumentMixin) {
  @Prop({ default: null }) readonly inputFile!: File
  @Prop({ default: 'File' }) readonly inputFileLabel!: string
  @Prop({ default: true }) readonly isRequired!: boolean
  @Prop({ default: 0 }) readonly maxSize!: number // in KB
  @Prop({ default: null }) readonly pdfPageSize!: PdfPageSize
  @Prop({ default: false }) readonly showErrors!: boolean
  @Prop({ default: '' }) readonly customErrorMessage!: string
  @Prop({ default: 'File must be a PDF. Maximum 30MB.' }) readonly hint!: string

  // Refs
  $refs: {
    form: FormIF
  }

  // Local variables
  fileUpload = null as File
  customErrorMessages = [] as string[]

  get fileUploadRules () {
    return [
      (file: File) => {
        if (this.isRequired) {
          return !!file || this.inputFileLabel + ' is required'
        }
        return true
      },
      (file: File) => {
        if (file && this.maxSize) {
          const maxSizeMB = this.maxSize / 1024
          const errorMsg = 'Exceeds maximum ' + maxSizeMB.toString() + ' MB file size'
          return (file?.size <= (this.maxSize * 1024)) || errorMsg
        }
        return true
      }
    ]
  }

  /** Called when component is mounted. */
  async mounted (): Promise<void> {
    if (this.inputFile) {
      this.fileUpload = this.inputFile
      // wait for v-file-input to settle
      await this.$nextTick()
    }
    await this.computeEmitFileValidity(this.fileUpload)
  }

  // Note: the validation is done this way as opposed to being all defined in the validation rules(fileUploadRules)
  //  above because Vuetify does not support async validation out of the box.  This was needed to work
  //  around this limitation.  vuelidate does support this but this would mean introducing a component that
  //  is using a different validation approach or updating all components to use vuelidate.  Have decided
  //  to do this for the time being.
  private async validateFileInput (file: File): Promise<boolean> {
    // clear any existing error messages
    this.setCustomErrorMessage(null)

    // validate the form (using rules)
    const isValid = this.$refs.form.validate()
    if (!isValid) return false

    // perform perform PDF validations
    if (file) {
      if (typeof file.arrayBuffer === 'undefined') { return true }
      const fileInfo = await this.retrieveFileInfo(file)
      if (!fileInfo) {
        this.setCustomErrorMessage('Invalid PDF file')
        return false
      }
      if (fileInfo.isEncrypted) {
        this.setCustomErrorMessage('File must be unencrypted')
        return false
      }
      if (fileInfo.isContentLocked) {
        this.setCustomErrorMessage('File content cannot be locked')
        return false
      }
      const isPageSizeValid = await this.validatePageSize(file)
      if (!isPageSizeValid) {
        // show page size validation error
        const pageSizeErrorMsg = this.pageSizeDict[this.pdfPageSize].validationErrorMsg
        this.setCustomErrorMessage(pageSizeErrorMsg)
        return false
      }
    }
    return true
  }

  private async validatePageSize (file: File): Promise<boolean> {
    if (this.pdfPageSize && typeof file.arrayBuffer !== 'undefined') {
      const isValidPageSize = await this.isPageSize(file, this.pdfPageSize)
      return isValidPageSize
    }
    return true
  }

  /** First computes and emits file validity, then emits File Selected event. */
  @Emit('fileSelected')
  async onChange (file: File): Promise<File> {
    await this.computeEmitFileValidity(file)
    return file
  }

  /** First computes file validity, then emits File Validity event. */
  @Emit('fileValidity')
  private async computeEmitFileValidity (file: File): Promise<boolean> {
    return this.validateFileInput(file)
  }

  /** Validates the file input when "showErrors" changes to True. */
  @Watch('showErrors')
  private async onShowErrorsChanged (): Promise<void> {
    if (this.showErrors) {
      await this.validateFileInput(this.fileUpload)
    }
  }

  /**
   * Automatically sets custom error message if prop changed, or if called, and syncs value back
   * to the parent component.
   */
  @Watch('customErrorMessage')
  @Emit('update:customErrorMessage')
  private setCustomErrorMessage (val: string): void {
    this.customErrorMessages = val ? [val] : []
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

:deep(.file-upload-preview) {
  .v-input__append-outer {
    margin-top: 10px !important
  }
  .v-input__slot {
    background-color: $gray1 !important;
  }
  .v-file-input__text {
    color: $app-blue !important;
  }
  .v-input__icon--prepend button {
    color: $app-blue !important;
  }
}
</style>
