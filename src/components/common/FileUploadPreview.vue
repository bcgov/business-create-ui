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
import { Component, Emit, Prop, Watch } from 'vue-property-decorator'
import Vue from 'vue'

@Component({
  components: {}
})
export default class FileUploadPreview extends Vue {
  @Prop() inputFile: File
  @Prop({ default: 'File' }) inputFileLabel: string
  @Prop({ default: true }) isRequired: boolean
  @Prop({ default: 0 }) maxSize: number // in KB
  @Prop({ default: false }) showErrors!: boolean
  @Prop({ default: '' }) customErrorMessage: string

  private fileUpload = null
  private customErrorMessages = []

  $refs: {
    fileUploadInput: HTMLFormElement
  }

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

  mounted () {
    if (this.inputFile) {
      this.fileUpload = this.inputFile
      this.$nextTick(() => {
        this.isFileValid()
      })
    }
  }

  private fileChange (file) {
    this.emitFileSelected(file)
  }

  @Emit('fileSelected')
  emitFileSelected (file) {
    this.isFileValid()
    return file
  }

  @Emit('isFileValid')
  isFileValid () {
    return this.$refs.fileUploadInput.validate()
  }

  @Watch('showErrors')
  private onShowErrorsChanged (): void {
    if (this.showErrors) {
      this.$refs.fileUploadInput.validate()
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
