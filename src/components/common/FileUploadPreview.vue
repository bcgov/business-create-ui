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
          prepend-icon
          hint="File must be a PDF.  Maximum 10MB."
          persistent-hint
        >
        </v-file-input>
      </v-form>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Emit, Prop } from 'vue-property-decorator'
import Vue from 'vue'

@Component({
  components: {}
})
export default class FileUploadPreview extends Vue {
  @Prop() inputFile: File
  @Prop({ default: true }) isRequired: boolean
  @Prop({ default: 0 }) maxSize: number // in KB
  private fileUpload = null

  $refs: {
    fileUploadInput: HTMLFormElement,
  }

  private fileUploadRules = [
    (v) => {
      if (this.isRequired) {
        return !!v || 'File is required'
      }
      return true
    },
    (file) => {
      if (this.maxSize) {
        return (file?.size <= (this.maxSize * 1000)) || 'File size exceed max allowed size'
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
  }
}

</style>
