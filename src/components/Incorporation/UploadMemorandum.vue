<template>
  <div id="upload-memorandum">
    <!-- Intro section -->
    <section class="mt-10">
      <header>
        <h2>1. Memorandum of Association</h2>
        <p>
          Before submitting your incorporation application you must <b>complete, sign, and date</b> the
          <v-tooltip
            top
            max-width="20rem"
            content-class="top-tooltip"
            transition="fade-transition"
          >
            <template #activator="{ on }">
              <span
                class="tool-tip dotted-underline"
                v-on="on"
              > Memorandum of Association</span>
            </template>
            <span>
              Memorandum - an agreement which reflects the intention, values and authorized share capital
              of the Cooperative Association.  It is signed by the founding members.
            </span>
          </v-tooltip>.
        </p>
      </header>
    </section>

    <!-- Help section -->
    <div
      v-if="getCreateMemorandumResource.helpSection"
      class="mt-5"
    >
      <span
        class="help-btn"
        @click="helpToggle = !helpToggle"
      >
        <v-icon
          color="primary"
          style="padding-right: 5px"
        >mdi-help-circle-outline</v-icon>
        <span v-if="!helpToggle">{{ getCreateMemorandumResource.helpSection.header }}</span>
        <span v-else>Hide Help</span>
      </span>

      <v-expand-transition>
        <section
          v-show="helpToggle"
          class="create-memorandum-help"
        >
          <header id="create-memorandum-help-header">
            <h2>{{ getCreateMemorandumResource.helpSection.header }}</h2>
          </header>

          <!-- help section 1 -->
          <p
            v-for="(item, index) in getCreateMemorandumResource.helpSection.helpText.section1.items"
            id="help-text-section-1"
            :key="index"
            class="mt-4"
            v-html="item"
          />

          <!-- help section 2 -->
          <p class="help-section-title font-weight-bold mt-4">
            {{ getCreateMemorandumResource.helpSection.helpText.section2.label }}
          </p>
          <ul class="bulleted-list mt-4">
            <li
              v-for="(item, index) in getCreateMemorandumResource.helpSection.helpText.section2.items"
              :key="index"
              class="mt-2"
              v-html="item"
            />
          </ul>

          <!-- help section 3 -->
          <p class="help-section-title font-weight-bold mt-4">
            {{ getCreateMemorandumResource.helpSection.helpText.section3.label }}
          </p>
          <ul class="bulleted-list mt-4">
            <li
              v-for="(item, index) in getCreateMemorandumResource.helpSection.helpText.section3.items"
              :key="index"
              class="mt-2"
              v-html="item"
            />
          </ul>
          <u
            class="help-btn"
            @click="helpToggle = !helpToggle"
          ><small>Hide Help</small></u>
        </section>
      </v-expand-transition>
    </div>

    <!-- Sample Memorandum -->
    <section
      id="sample-memorandum-section"
      class="mt-10"
    >
      <header id="sample-memorandum-header">
        <h2>2. Sample Memorandum</h2>
      </header>

      <p class="mt-2">
        For your convenience, we have provided a sample Memorandum of Association with instructions.
      </p>

      <div class="mt-4">
        <v-card
          flat
          class="py-8 px-6"
        >
          <div class="d-flex flex-column flex-sm-row justify-center align-center">
            <img
              src="@/assets/images/BCRegistries_Sample_CoopMemorandum_x2.png"
              class="preview-image"
            >
            <div class="px-8" />
            <div class="download-link-container py-5">
              <v-icon
                color="primary"
                class="mt-n1"
              >
                mdi-file-pdf-outline
              </v-icon>
              <a
                :href="documentURL"
                download
                class="ml-1"
              >
                Download the Sample Memorandum of Association
              </a>
            </div>
          </div>
        </v-card>
      </div>
    </section>

    <!-- Confirm Memorandum Completion -->
    <section
      id="confirm-memorandum-section"
      class="mt-10"
    >
      <header id="memorandum-confirm-header">
        <h2>3. Confirm Memorandum Completion</h2>
      </header>

      <div
        class="mt-4"
        :class="{ 'invalid-section': getShowErrors && !hasMemorandumConfirmed }"
      >
        <v-card
          id="confirm-memorandum-card"
          flat
          class="py-8 px-6"
        >
          <v-form ref="confirmMemorandumChk">
            <v-checkbox
              id="chk-confirm-memorandum"
              v-model="memorandumConfirmed"
              class="chk-memorandum mt-0 pt-0"
              hide-details=""
              :rules="confirmCompletionMemorandum"
              label="I confirm the following items are included as required in the Memorandum of Association:"
              @change="onMemorandumConfirmedChange($event)"
            />
            <ul>
              <li class="mt-4">
                <v-row no-gutters>
                  <v-col cols="1">
                    <v-icon>mdi-circle-small</v-icon>
                  </v-col>
                  <v-col cols="11">
                    The Cooperative name is identified <b>exactly</b> as follows throughout the Memorandum:
                    <p class="font-weight-bold mb-0">
                      {{ getNameRequestApprovedName }}
                    </p>
                  </v-col>
                </v-row>
              </li>

              <li class="mt-4">
                <v-row no-gutters>
                  <v-col cols="1">
                    <v-icon>mdi-circle-small</v-icon>
                  </v-col>
                  <v-col cols="11">
                    If required, there is a
                    <v-tooltip
                      top
                      max-width="20rem"
                      content-class="top-tooltip"
                      transition="fade-transition"
                    >
                      <template #activator="{ on }">
                        <span
                          class="tool-tip dotted-underline"
                          v-on="on"
                        >Dissolution Provision</span>
                      </template>
                      Dissolution Provision &dash; all Cooperative Associations should have provisions for the
                      distribution of their assets after they have been dissolved or wound up. See example
                      memorandum for information relevant to your Cooperative Association type. If the cooperative
                      decides to not adopt one of the sample dissolution clauses in their memorandum, the cooperative
                      should put a dissolution clause into their rules. For more information about what a dissolution
                      clause is, contact BC Registries.
                    </v-tooltip>
                    in the Memorandum or Rules of Association.
                  </v-col>
                </v-row>
              </li>

              <li class="mt-4">
                <v-row no-gutters>
                  <v-col cols="1">
                    <v-icon>mdi-circle-small</v-icon>
                  </v-col>
                  <v-col cols="11">
                    The
                    <v-tooltip
                      top
                      max-width="20rem"
                      content-class="top-tooltip"
                      transition="fade-transition"
                    >
                      <template #activator="{ on }">
                        <span
                          class="tool-tip dotted-underline"
                          v-on="on"
                        >correct type of shares</span>
                      </template>
                      Housing Cooperative Associations and Community Service Cooperative Associations
                      MUST NOT issue investment shares.
                    </v-tooltip>
                    are used in the Memorandum of Association based on the type of Cooperative Association.
                  </v-col>
                </v-row>
              </li>

              <li class="mt-4">
                <v-row no-gutters>
                  <v-col cols="1">
                    <v-icon>mdi-circle-small</v-icon>
                  </v-col>
                  <v-col cols="11">
                    Each Subscriber and Witness has signed and dated the Memorandum of
                    Association and their name is printed under their signature.
                  </v-col>
                </v-row>
              </li>
            </ul>
          </v-form>
        </v-card>
      </div>
    </section>

    <!-- Upload Memorandum -->
    <section
      id="upload-memorandum-section"
      class="mt-10"
    >
      <header id="upload-memorandum-header">
        <h2>4. Upload Memorandum</h2>
        <ul class="mt-4">
          <li class="mt-1">
            <v-icon>mdi-circle-small</v-icon>
            <span class="ml-2">Must be set to fit onto 8.5" x 11" letter-size paper</span>
          </li>
          <li class="mt-1">
            <v-icon>mdi-circle-small</v-icon>
            <span class="ml-2">Allow a minimum 1.5" margin at the top of the first page
              (for BC Registries certified stamp)</span>
          </li>
          <li class="mt-1">
            <v-icon>mdi-circle-small</v-icon>
            <span class="ml-2">Use a white background and a legible font with contrasting
              font colour</span>
          </li>
          <li class="mt-1">
            <v-icon>mdi-circle-small</v-icon>
            <span class="ml-2">PDF file type (maximum 30 MB file size)</span>
          </li>
        </ul>
      </header>

      <div
        class="mt-4"
        :class="{ 'invalid-section': getShowErrors && !hasValidUploadFile }"
      >
        <v-card
          id="upload-memorandum-card"
          flat
          class="py-8 px-6"
        >
          <v-row no-gutters>
            <v-col
              cols="12"
              sm="2"
              class="pr-4"
            >
              <label class="upload-memorandum-vcard-title">Upload Memorandum</label>
            </v-col>
            <v-col
              cols="12"
              sm="10"
              class="pt-4 pt-sm-0"
            >
              <FileUploadPreview
                inputFileLabel="Memorandum of Association"
                :maxSize="MAX_FILE_SIZE"
                :pdfPageSize="PdfPageSize.LETTER_SIZE"
                :inputFile="uploadMemorandumDoc"
                :showErrors="getShowErrors"
                :customErrorMessage="fileUploadCustomErrorMsg"
                @fileValidity="onFileValidity($event)"
                @fileSelected="onFileSelected($event)"
              />
            </v-col>
          </v-row>
        </v-card>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Mixins, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { useStore } from '@/store/store'

// Interfaces
import {
  CreateMemorandumIF,
  CreateMemorandumResourceIF,
  FormIF,
  PresignedUrlIF,
  ValidationDetailIF
} from '@/interfaces'

// Enums
import { RouteNames, ItemTypes, PdfPageSize } from '@/enums'

// Mixins
import { CommonMixin, DocumentMixin } from '@/mixins'

// Components
import FileUploadPreview from '@/components/common/FileUploadPreview.vue'
import { LegalServices } from '@/services'

@Component({
  components: {
    FileUploadPreview
  }
})
export default class UploadMemorandum extends Mixins(CommonMixin, DocumentMixin) {
  // Refs
  $refs!: {
    confirmMemorandumChk: FormIF
  }

  @Getter(useStore) getCreateMemorandumResource!: CreateMemorandumResourceIF
  @Getter(useStore) getCreateMemorandumStep!: CreateMemorandumIF
  @Getter(useStore) getNameRequestApprovedName!: string
  @Getter(useStore) getShowErrors!: boolean
  @Getter(useStore) getKeycloakGuid!: string

  @Action(useStore) setMemorandum!: (x: CreateMemorandumIF) => void
  @Action(useStore) setMemorandumStepValidity!: (x: ValidationDetailIF) => void

  // Local variables
  fileUploadCustomErrorMsg = ''
  hasMemorandumConfirmed = false
  hasValidUploadFile = false
  helpToggle = false
  memorandumConfirmed = false
  uploadMemorandumDoc = null as File
  uploadMemorandumDocKey = null as string

  // Enum for template
  readonly RouteNames = RouteNames
  readonly ItemTypes = ItemTypes
  readonly PdfPageSize = PdfPageSize

  get documentURL (): string {
    return sessionStorage.getItem('BASE_URL') + 'files/cooperative_sample_memorandum.pdf'
  }

  readonly confirmCompletionMemorandum = [
    (v) => { return !!v }
  ]

  private setUploadMemorandumDoc (doc: File) {
    this.uploadMemorandumDoc = doc
    this.uploadMemorandumDocKey = null
  }

  onFileValidity (valid: boolean) {
    this.hasValidUploadFile = valid
    this.updateMemorandumStepValidity()
  }

  async onFileSelected (file: File) {
    // reset state of file uploader to ensure not in manual error mode
    this.fileUploadCustomErrorMsg = ''
    if (file) {
      if (this.hasValidUploadFile) {
        this.setUploadMemorandumDoc(file)
        await this.uploadPendingDocsToStorage()
      } else {
        this.uploadMemorandumDocKey = null
      }
    } else {
      // delete file from Minio; ignore errors
      await LegalServices.deleteDocument(this.uploadMemorandumDocKey).catch(() => null)
      // clear local variables
      this.uploadMemorandumDoc = null
      this.uploadMemorandumDocKey = null
      this.setMemorandum({
        ...this.getCreateMemorandumStep,
        memorandumFile: null,
        docKey: null
      })
    }
  }

  public async uploadPendingDocsToStorage () {
    const isPendingUpload = !this.uploadMemorandumDocKey
    if (isPendingUpload && this.hasValidUploadFile) {
      // NB: will throw if API error
      const doc: PresignedUrlIF = await LegalServices.getPresignedUrl(this.uploadMemorandumDoc.name)

      // NB: will return error response if API error
      const res =
        await LegalServices.uploadToUrl(doc.preSignedUrl, this.uploadMemorandumDoc, doc.key, this.getKeycloakGuid)

      if (res && res.status === 200) {
        const memorandumFile = {
          name: this.uploadMemorandumDoc.name,
          lastModified: this.uploadMemorandumDoc.lastModified,
          size: this.uploadMemorandumDoc.size
        } as File
        this.setMemorandum({
          ...this.getCreateMemorandumStep,
          memorandumFile,
          docKey: doc.key
        })
      } else {
        // put file uploader into manual error mode by setting custom error message
        this.fileUploadCustomErrorMsg = this.UPLOAD_FAILED_MESSAGE
        this.hasValidUploadFile = false
        this.updateMemorandumStepValidity()
        this.uploadMemorandumDocKey = null
      }
    }
  }

  private updateMemorandumStepValidity () {
    const validationDetail:ValidationDetailIF =
      {
        valid: this.hasMemorandumConfirmed && this.hasValidUploadFile,
        validationItemDetails: [
          {
            name: 'hasMemorandumConfirmed', valid: this.hasMemorandumConfirmed, elementId: 'memorandum-confirm-header'
          },
          {
            name: 'hasValidUploadFile', valid: this.hasValidUploadFile, elementId: 'upload-memorandum-header'
          }
        ]
      }
    this.setMemorandumStepValidity(validationDetail)
  }

  onMemorandumConfirmedChange (memorandumConfirmed: boolean): void {
    this.hasMemorandumConfirmed = memorandumConfirmed
    this.updateMemorandumStepValidity()
    this.setMemorandum({
      ...this.getCreateMemorandumStep,
      memorandumConfirmed
    })
  }

  /** Called when component is created. */
  created (): void {
    this.uploadMemorandumDoc = this.getCreateMemorandumStep.memorandumFile
    this.uploadMemorandumDocKey = this.getCreateMemorandumStep.docKey
    this.memorandumConfirmed = this.getCreateMemorandumStep.memorandumConfirmed
    this.hasValidUploadFile = !!this.uploadMemorandumDocKey
    this.hasMemorandumConfirmed = this.memorandumConfirmed
  }

  /** Called when component is mounted. */
  async mounted (): Promise<void> {
    // wait for components to load/stabilize then update validation state in store
    await this.$nextTick()
    this.updateMemorandumStepValidity()
  }

  @Watch('getShowErrors')
  private onShowErrorsChanged (): void {
    if (this.getShowErrors && this.$refs.confirmMemorandumChk) {
      this.$refs.confirmMemorandumChk.validate()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

header p {
  padding-top: 0.5rem;
}

ul {
  list-style: none;
  color: $gray7;
}

.upload-memorandum-summary-header {
  display: flex;
  background-color: $BCgovBlue5O;
  padding: 1.25rem;

  .upload-memorandum-title {
    color: $gray9;
  }
}

.upload-memorandum-error-message {
  padding-top: 1.25rem;
  padding-left: 1.25rem;
  color: $app-blue;
}

.help-btn {
  cursor: pointer;
  color: $app-blue;
  vertical-align: middle;
}

.create-memorandum-help {
  margin: 2rem 0;
  border-top: 1px dashed $gray6;
  border-bottom: 1px dashed $gray6;
  padding: 1rem 0;

  #create-memorandum-help-header {
    display: flex;
    justify-content: center;
  }

  h2, h4 {
    padding: 1rem 0;
  }

  u {
    display: flex;
    direction: rtl;
  }

  a {
    text-decoration: none;
  }
}

:deep(#confirm-memorandum-section) {
  // override default validation styling so checkbox does not turn red on validation error
  .v-input--selection-controls__input .error--text {
    color: $app-lt-gray !important;
  }
}

.chk-memorandum {
  color: $gray9;

  :deep() {
    .theme--light.v-icon {
      color: $gray9;
    }
    .v-label {
      line-height: 1.5rem;
    }
  }
}

.upload-memorandum-vcard-title {
  font-size: $px-17;
  font-weight: bold;
}

.v-icon.mdi-help-circle-outline,
.v-icon.mdi-information-outline,
.v-icon.mdi-open-in-new,
.v-icon.mdi-circle-small {
  margin-top: -2px;
}

.v-icon.mdi-open-in-new {
  padding-bottom: 1px;
}

.preview-image {
  width: 200px;
  height: 259px;
}

.download-link-container {
  border-top: solid 1px $gray3;
  border-bottom: solid 1px $gray3;
}

#sample-memorandum-section {
  a {
    text-decoration: none;
  }
}
</style>
