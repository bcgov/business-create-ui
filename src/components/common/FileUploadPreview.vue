<template>
  <v-row>
    <v-col class="py-0" sm="12" md="12">
      <v-form ref="fileUploadInput" lazy-validation>
        <v-file-input
          label="Select a file to upload"
          filled
          dense
          v-model="fileUpload"
          accept=".pdf"
          class="file-upload-preview"
          :rules="fileUploadRules"
          show-size
          @change="fileChange"
          color="primary"
          hint="File must be a PDF.  Maximum 10MB."
          persistent-hint
          :error-messages="customErrorMessages"
        >
        </v-file-input>
      </v-form>
    </v-col>
  </v-row>
</template>

<script lang="ts">
// Libraries
import { Component, Emit, Mixins, Prop, Watch } from 'vue-property-decorator'

// Mixins
import { DocumentMixin } from '@/mixins'
import { PdfPageSize } from '@/enums'

@Component({
  components: {}
})
export default class FileUploadPreview extends Mixins(DocumentMixin) {
  @Prop() inputFile: File
  @Prop({ default: 'File' }) inputFileLabel: string
  @Prop({ default: true }) isRequired: boolean
  @Prop({ default: 0 }) maxSize: number // in KB
  @Prop({ default: null }) pdfPageSize: PdfPageSize
  @Prop({ default: false }) showErrors!: boolean
  @Prop({ default: '' }) customErrorMessage: string

  // Refs
  $refs: {
    fileUploadInput: HTMLFormElement
  }

  private fileUpload: File = null
  private customErrorMessages: string[] = []

  private fileUploadRules = [
    (v) => {
      if (this.isRequired) {
        return !!v || this.inputFileLabel + ' is required'
      }
      return true
    },
    (file) => {
      if (this.maxSize) {
        const maxSizeMB = this.maxSize / 1024
        const errorMsg = 'Exceeds maximum ' + maxSizeMB.toString() + ' MB file size'
        return (file?.size <= (this.maxSize * 1024)) || errorMsg
      }
      return true
    }
  ]

  async mounted () {
    if (this.inputFile) {
      this.fileUpload = this.inputFile
      await this.$nextTick()
      this.isFileValid(this.fileUpload)
    }
  }

  private fileChange (file) {
    this.emitFileSelected(file)
  }

  // Note: the validation is done this way as opposed to being all defined in the validation rules(fileUploadRules)
  //  above because Vuetify does not support async validation out of the box.  This was needed to work
  //  around this limitation.  vuelidate does support this but this would mean introducing a component that
  //  is using a different validation approach or updating all components to use vuelidate.  Have decided
  //  to do this for the time being.
  private async validateFileInput (file) {
    this.customErrorMessages = []
    let isValid = this.$refs.fileUploadInput.validate()
    // only perform page size validation when other validation has passed
    if (isValid && file) {
      if (typeof file.arrayBuffer === 'undefined') { return true }
      const fileInfo = await this.retrieveFileInfo(file)
      if (fileInfo.isEncrypted) {
        this.customErrorMessages = ['File must be unencrypted']
        return false
      }
      if (fileInfo.isContentLocked) {
        this.customErrorMessages = ['File content cannot be locked']
        return false
      }
      const pageSizeIsValid = await this.validatePageSize(file)
      if (!pageSizeIsValid) {
        // show page size validation error
        const pageSizeErrorMsg = this.pageSizeDict[this.pdfPageSize].validationErrorMsg
        this.customErrorMessages = [pageSizeErrorMsg]
      }
      return isValid && pageSizeIsValid
    }
    return isValid
  }

  private async validatePageSize (file): Promise<boolean|string> {
    if (this.pdfPageSize && typeof file.arrayBuffer !== 'undefined') {
      const isValidPageSize = await this.isPageSize(file, this.pdfPageSize)
      return isValidPageSize
    }
    return true
  }

  @Emit('fileSelected')
  async emitFileSelected (file) {
    await this.isFileValid(file)
    return file
  }

  @Emit('isFileValid')
  async isFileValid (file) {
    const result = await this.validateFileInput(file)
    return result
  }

  @Watch('showErrors')
  private onShowErrorsChanged (): void {
    if (this.showErrors) {
      this.validateFileInput(this.fileUpload)
    }
  }

  @Watch('customErrorMessage')
  private onCustomErrorMessage (val: string): void {
    this.customErrorMessages = val ? [val] : []
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

::v-deep {
  .file-upload-preview {
    .v-input__append-outer {
      margin-top: 10px !important
    }
    .v-input__slot{
      background-color: $gray1 !important;
    }
    .v-file-input__text{
     color: $app-blue !important;
    }
    .v-input__icon--prepend button {
      color: $app-blue !important;
    }
  }
}

</style>
