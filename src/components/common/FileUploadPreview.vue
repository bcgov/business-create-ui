<template>
  <div class="file-upload-preview">
    <v-file-input
      id="file-input"
      v-model="fileUpload"
      :label="label"
      filled
      dense
      accept=".pdf"
      show-size
      color="primary"
      :hint="hint"
      hide-details="auto"
      persistent-hint
      :error-messages="customErrorMessages"
      @change="onChange($event)"
    />
  </div>
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
  @Prop({ default: 'Select a file to upload' }) readonly label!: string

  // Refs
  $refs: {
    form: FormIF
  }

  // Local variables
  fileUpload = null as File
  customErrorMessages = [] as string[]

  /** Called when component is mounted. */
  async mounted (): Promise<void> {
    if (this.inputFile) {
      this.fileUpload = this.inputFile
      // wait for v-file-input to settle
      await this.$nextTick()
    }
    await this.computeEmitFileValidity(this.fileUpload)
  }

  /** Programmatically opens the file selection dialog. Can be called externally. */
  public clickFileInput (): void {
    // clear any previous error state
    this.setCustomErrorMessage('')
    // clear any existing file
    this.fileUpload = null
    // find the find input element in THIS component (not globally)
    const element = this.$el.querySelector('#file-input') as HTMLElement
    // click the file input element to open the file selection dialog
    element.click()
  }

  /**
   * Validates the file input. Includes "rules" here because Vuetify does not support async validation.
   * @param file The file to validate.
   */
  private async validateFileInput (file: File): Promise<boolean> {
    // clear any previous error state
    this.setCustomErrorMessage('')

    // check if required file is present
    if (this.isRequired && !file) {
      this.setCustomErrorMessage('File is required.')
      return false
    }

    // check optional max size
    if (file && this.maxSize) {
      const maxSizeMB = this.maxSize / 1024
      if (file.size > (this.maxSize * 1024)) {
        this.setCustomErrorMessage('Exceeds maximum ' + maxSizeMB.toString() + ' MB file size.')
        return false
      }
    }

    // check file extension
    if (file) {
      const pattern = /^(.*)\.(pdf)$/i
      if (!pattern.test(file.name)) {
        this.setCustomErrorMessage('Invalid file extension.')
        return false
      }
    }

    // perform PDF validations
    if (file) {
      if (typeof file.arrayBuffer === 'undefined') { return true }
      const fileInfo = await this.retrieveFileInfo(file)
      if (!fileInfo) {
        this.setCustomErrorMessage('Invalid PDF file.')
        return false
      }
      if (fileInfo.isEncrypted) {
        this.setCustomErrorMessage('File must not be encrypted.')
        return false
      }
      if (fileInfo.isContentLocked) {
        this.setCustomErrorMessage('File content cannot be locked.')
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

    // if we get this far then declare the file valid
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

:deep(.v-file-input) {
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
