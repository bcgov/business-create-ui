<template>
  <!-- Don't render this component until authorization object is initialized. -->
  <div
    v-if="authorization"
    id="authorization-proof"
  >
    <!-- Upload Files -->
    <v-card
      flat
      class="py-8 px-6"
      :class="{ 'invalid-section': getShowErrors && !authorizationFilesValid }"
    >
      <v-row no-gutters>
        <v-col
          cols="12"
          sm="3"
          class="pr-4"
        >
          <label>Upload File</label>
        </v-col>

        <v-col
          cols="12"
          sm="9"
        >
          <p :class="{ 'error-text': getShowErrors && !authorizationFilesValid }">
            Upload one or more files that show proof of authorization to continue out of your
            previous jursidiction.
          </p>

          <ul>
            <li>
              Use a white background and a legible font with contrasting font colour
            </li>
            <li>
              PDF file type (maximum 30 MB file size)
            </li>
            <li>
              Maximum 5 files
            </li>
          </ul>

          <v-btn
            id="add-document-button"
            outlined
            color="primary"
            class="btn-outlined-primary mt-4"
            :disabled="numFiles >= 5"
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
        </v-col>
      </v-row>

      <v-row
        v-for="(document, index) in authorization.files"
        :key="document.fileKey"
        class="upload-file-row mt-5"
        :class="{ 'mb-n2': (index < numFiles) }"
        no-gutters
      >
        <v-col
          cols="12"
          sm="3"
        >
          <!-- empty column -->
        </v-col>

        <v-col
          cols="12"
          sm="9"
          class="dk-gray-background rounded d-flex justify-space-between align-center px-2 py-2"
        >
          <v-icon>mdi-paperclip</v-icon>
          <div class="document-details mr-auto pl-2">
            {{ document.file.name }}
            <span class="pl-2">({{ friendlyFileSize(document.file) }})</span>
          </div>
          <v-btn
            class="remove-document-button"
            text
            color="primary"
            @click="onRemoveClicked(index)"
          >
            <span>Remove</span>
            <v-icon dense>
              mdi-close
            </v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <!-- Change Requested message box -->
      <v-row
        v-if="isShowMessageBox"
        class="mt-6"
        no-gutters
      >
        <v-col
          cols="12"
          sm="3"
          class="pr-4"
        >
          <!-- empty column -->
        </v-col>

        <v-col
          cols="12"
          sm="9"
        >
          <MessageBox color="red">
            <v-icon
              color="error"
              dense
            >
              mdi-alert
            </v-icon>

            <label
              class="font-14"
              for="textarea-message"
            >
              Change Requested:
            </label>

            <textarea
              id="textarea-message"
              v-auto-resize
              class="font-14 ml-6 pr-5 mb-n2"
              readonly
              rows="1"
              :value="latestReviewComment"
            />
          </MessageBox>
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
import { DocumentMixin } from '@/mixins'
import { AuthorizationProofIF, ExistingBusinessInfoIF, PresignedUrlIF } from '@/interfaces'
import { FilingStatus } from '@/enums'
import FileUploadPreview from '@/components/common/FileUploadPreview.vue'
import AutoResize from 'vue-auto-resize'
import MessageBox from '@/components/common/MessageBox.vue'

@Component({
  components: {
    FileUploadPreview,
    MessageBox
  },
  directives: {
    AutoResize
  }
})
export default class AuthorizationProof extends Mixins(DocumentMixin) {
  // Refs
  $refs!: {
    fileUploadPreview: FileUploadPreview
  }

  @Getter(useStore) getContinuationInAuthorizationProof!: AuthorizationProofIF
  @Getter(useStore) getExistingBusinessInfo!: ExistingBusinessInfoIF
  @Getter(useStore) getFilingStatus!: FilingStatus
  @Getter(useStore) getKeycloakGuid!: string
  @Getter(useStore) getShowErrors!: boolean

  @Action(useStore) setContinuationAuthorization!: (x: AuthorizationProofIF) => void

  // Local properties
  authorization = null as AuthorizationProofIF
  fileValidity = false
  customErrorMessage = ''
  isFileAdded = false
  isDocumentLoading = false

  /** Whether filing status is Change Requested. */
  get isStatusChangeRequested (): boolean {
    return (this.getFilingStatus === FilingStatus.CHANGE_REQUESTED)
  }

  /** The latest review comment. Only used when filing is in Change Requested status. */
  get latestReviewComment (): string {
    return this.getExistingBusinessInfo.latestReviewComment
  }

  /** Whether to show the message box. */
  get isShowMessageBox (): boolean {
    return (this.isStatusChangeRequested && !!this.latestReviewComment)
  }

  get numFiles (): number {
    return (this.authorization?.files.length || 0)
  }

  /** Whether authorization files section is valid. */
  get authorizationFilesValid (): boolean {
    // must have at least one file uploaded
    // AND this must a draft filing or if it's a Change Requested filing
    // then a new file must have been added
    return (
      (this.numFiles >= 1) &&
      (!this.isStatusChangeRequested || this.isFileAdded)
    )
  }

  /** Called when this component is mounted. */
  mounted (): void {
    // initialize the authorization object if needed
    this.authorization = this.getContinuationInAuthorizationProof ||
      { files: [], date: null } as AuthorizationProofIF
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
      // verify that file doesn't already exist
      if (this.authorization.files.find(f => f.file.name === file.name)) {
        // set error message
        this.customErrorMessage = 'Duplicate file.'
        return // don't add to array
      }

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

      // add file to array
      this.authorization.files.push({
        file: {
          name: file.name,
          lastModified: file.lastModified,
          size: file.size
        } as File,
        fileKey: psu.key,
        fileName: file.name
      })

      this.isFileAdded = true
    }
  }

  /**
   * Called when user clicks a Remove button.
   * @param index the index of the file to remove
   */
  onRemoveClicked (index = NaN): void {
    // safety check
    if (index >= 0) {
      // delete file from Minio, not waiting for response and ignoring errors
      this.deleteDocument(this.authorization.files[index].fileKey).catch(() => null)
      // remove file from array
      this.authorization.files.splice(index, 1)
      // clear any existing error message
      this.customErrorMessage = ''
    }
  }

  @Watch('authorizationFilesValid') // re-validate when the Authorization Files validity changes
  @Watch('authorization.files') // update store when files are added or removed
  @Emit('valid')
  private onComponentValid (): boolean {
    // sync local object to the store
    this.setContinuationAuthorization(this.authorization)

    return this.authorizationFilesValid
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

p, li {
  color: $gray7;
}

// set style for all labels
label {
  font-weight: bold;
  color: $gray9;
}

textarea {
  color: $gray7;
  width: 100%;
  resize: none;
  // FUTURE: use field-sizing instead of "v-auto-resize" directive
  // ref: https://developer.mozilla.org/en-US/docs/Web/CSS/field-sizing
  // field-sizing: content;
  // unset height as it's sometimes 0 initially
  height: unset;
}

// style the upload file bullets
ul {
  list-style: none;

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
