<template>
  <!--
    Don't render this component until authorization object is initialized, so that we mount
    FileUploadPreview with existing files, because its "inputFile" prop is not reactive.
  -->
  <div
    v-if="authorization"
    id="continuation-authorization"
  >
    <header>
      <p>
        Upload the authorization for the continuation from the foreign jursidiction.
      </p>

      <ul>
        <li>
          Use a white background and a legible font with contrasting font colour
        </li>
        <li>
          PDF file type (maximum 30 MB file size)
        </li>
      </ul>
    </header>

    <div class="pt-4" />

    <v-row
      v-for="(num, index) in numUploads"
      :key="authorization.files[index]?.fileKey"
      class="mt-4 mb-n2"
      no-gutters
    >
      <v-col
        cols="12"
        sm="3"
      >
        <label v-if="index === 0">Upload File (5 maximum)</label>
      </v-col>

      <v-col
        cols="12"
        sm="9"
      >
        <FileUploadPreview
          inputFileLabel="Continuation authorization"
          :maxSize="MAX_FILE_SIZE"
          :pdfPageSize="PdfPageSize.LETTER_SIZE"
          :inputFile="authorization.files[index]?.file"
          :showErrors="getShowErrors"
          :customErrorMessage="fileUploadCustomErrorMsg"
          :isRequired="getShowErrors && (index === 0)"
          @fileValidity="onFileValidity($event)"
          @fileSelected="onFileSelected(index, $event)"
        />
      </v-col>
    </v-row>

    <v-form
      ref="formRef"
      lazy-validation
      @submit.prevent
    >
      <v-row
        class="mt-6"
        no-gutters
      >
        <v-col
          cols="12"
          sm="3"
        >
          <label>Authority Name</label>
        </v-col>

        <v-col
          cols="12"
          sm="9"
          class="pl-8"
        >
          <v-text-field
            v-model="authorization.authorityName"
            class="authority-name"
            filled
            hide-details="auto"
            label="Authority Name"
            :rules="getShowErrors ? authorityNameRules : []"
          />
        </v-col>
      </v-row>

      <v-row
        class="mt-6"
        no-gutters
      >
        <v-col
          cols="12"
          sm="3"
        >
          <label>Authorization Date</label>
        </v-col>

        <v-col
          cols="12"
          sm="9"
          class="pl-8"
        >
          <DatePickerShared
            ref="authorizationDateRef"
            title="Authorization Date"
            :nudgeRight="40"
            :nudgeTop="85"
            :initialValue="authorization.date"
            :inputRules="getShowErrors ? authorizationDateRules : []"
            :maxDate="getCurrentDate"
            @emitDateSync="authorization.date = $event"
          />
        </v-col>
      </v-row>

      <v-row
        class="mt-6"
        no-gutters
      >
        <v-col
          cols="12"
          sm="3"
        >
          <label>Expiry Date</label>
        </v-col>

        <v-col
          cols="12"
          sm="9"
          class="pl-8"
        >
          <DatePickerShared
            ref="expiryDateRef"
            title="Expiry Date (Optional)"
            :nudgeRight="40"
            :nudgeTop="85"
            :initialValue="authorization.expiryDate"
            :inputRules="getShowErrors ? expiryDateRules: []"
            :minDate="authorization.date"
            @emitDateSync="authorization.expiryDate = $event"
          />
        </v-col>
      </v-row>

      <v-checkbox
        id="continuation-authorization-checkbox"
        v-model="authorization.isConfirmed"
        class="mt-6"
        hide-details
        :rules="getShowErrors ? [(v) => !!v] : []"
      >
        <template #label>
          <span>I confirm that I have current and valid authorization to continue this business into B.C.</span>
        </template>
      </v-checkbox>
    </v-form>

    <!-- snackbar to temporarily show errors -->
    <v-snackbar
      v-model="snackbar"
      timeout="3000"
    >
      {{ snackbarText }}

      <template #action="{ attrs }">
        <v-btn
          color="white"
          icon
          aria-label="Close Notification"
          v-bind="attrs"
          @click="snackbar = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import { DocumentMixin } from '@/mixins'
import { ContinuationAuthorizationIF, FormIF, PresignedUrlIF } from '@/interfaces'
import { PdfPageSize } from '@/enums'
import { VuetifyRuleFunction } from '@/types'
import FileUploadPreview from '@/components/common/FileUploadPreview.vue'
import { DatePicker as DatePickerShared } from '@bcrs-shared-components/date-picker'
// import { LegalServices } from '@/services'

@Component({
  components: {
    DatePickerShared,
    FileUploadPreview
  }
})
export default class ExtraproRegistration extends Mixins(DocumentMixin) {
  // Refs
  $refs!: {
    authorizationDateRef: DatePickerShared,
    expiryDateRef: DatePickerShared,
    formRef: FormIF
  }
  readonly PdfPageSize = PdfPageSize

  @Getter(useStore) getContinuationAuthorization!: ContinuationAuthorizationIF
  @Getter(useStore) getCurrentDate!: string
  @Getter(useStore) getKeycloakGuid!: string
  @Getter(useStore) getShowErrors!: boolean

  @Action(useStore) setContinuationAuthorization!: (x: ContinuationAuthorizationIF) => void

  readonly INPUT_FILE_LABEL = 'Continuation authorization'

  // Local properties
  authorization = null as ContinuationAuthorizationIF
  fileValidity = false
  fileUploadCustomErrorMsg = ''
  snackbar = false
  snackbarText = ''

  get authorityNameRules (): Array<VuetifyRuleFunction> {
    return [
      (v: string) => !!v || 'Authority Name is required'
    ]
  }

  get authorizationDateRules (): Array<VuetifyRuleFunction> {
    return [
      (v) => !!v || 'Authorization Date is required',
      () => (this.authorization.date <= this.getCurrentDate) ||
        'Authorization Date cannot be in the future'
    ]
  }

  get expiryDateRules (): Array<VuetifyRuleFunction> {
    return [
      () => !this.authorization.expiryDate ||
        (this.authorization.expiryDate >= this.authorization.date) ||
        'Expiry Date cannot be before Authorization Date'
    ]
  }

  /** The number of file upload componenets to display (max 5). */
  get numUploads (): number {
    return Math.min((this.authorization.files.length + 1), 5)
  }

  mounted (): void {
    // set or initialize authorization object
    this.authorization = this.getContinuationAuthorization || { files: [] } as ContinuationAuthorizationIF
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
   */
  async onFileSelected (index: number, file: File): Promise<void> {
    // reset state of file uploader to ensure not in manual error mode
    this.fileUploadCustomErrorMsg = ''

    if (file) {
      // verify that file is valid
      if (!this.fileValidity) {
        this.snackbarText = 'Invalid file. It will not be saved.'
        this.snackbar = true
        return // don't add to list
      }

      // verify that file doesn't already exist
      if (this.authorization.files.find(f => f.file.name === file.name)) {
        this.snackbarText = 'File already uploaded. It will not be saved again.'
        this.snackbar = true
        return
      }

      // try to upload to Minio
      let psu: PresignedUrlIF
      try {
        psu = await this.getPresignedUrl(file.name)
        const res = await this.uploadToUrl(psu.preSignedUrl, file, psu.key, this.getKeycloakGuid)
        if (!res || res.status !== 200) throw new Error()
      } catch {
        // put file uploader into manual error mode by passing custom error message
        this.fileUploadCustomErrorMsg = this.UPLOAD_FAILED_MESSAGE

        this.snackbarText = 'File upload error. Please try again.'
        this.snackbar = true
        return
      }

      // add file to array
      this.authorization.files.push({
        file: {
          name: file.name,
          lastModified: file.lastModified,
          size: file.size
        } as File,
        fileKey: psu.key,
        fileName: file.name,
        fileUrl: psu.preSignedUrl
      })
    } else {
      // remove file from array
      this.authorization.files.splice(index, 1)
    }
  }

  @Watch('getShowErrors')
  @Watch('authorization.date') // because Expiry Date depends on this
  private onShowErrors (): void {
    if (this.getShowErrors) {
      // validate the form and the components that don't support form validation
      this.$refs.formRef.validate()
      this.$refs.authorizationDateRef.validateForm()
      this.$refs.expiryDateRef.validateForm()
    }
  }

  @Watch('authorization', { deep: true })
  @Emit('valid')
  private onComponentValid (): boolean {
    // first save the authorization to the store
    this.setContinuationAuthorization(this.authorization)

    // then emit the validity
    return (
      (this.authorization.files.length >= 1) &&
      !!this.authorization.authorityName &&
      !!this.authorization.date &&
      (this.authorization.isConfirmed === true)
    )
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

header {
  p, li {
    color: $gray7;
  }
}

// set style for all root labels
label {
  font-weight: bold;
  color: $gray9;
}

// add whitespace between the first and second columns
.col-sm-3 {
  padding-right: 1rem !important;
}

// align the checkbox with its label
:deep(.v-input--checkbox .v-input__slot) {
  align-items: flex-start;
}

// style the checkbox label
:deep(.v-input--checkbox label) {
  margin-top: 2px;
  font-size: $px-14;
  color: $gray9;
}

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
