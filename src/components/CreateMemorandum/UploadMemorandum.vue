<template>
  <div id="upload-memorandum">
    <section class="mt-10">
      <header>
        <h2>1. Memorandum of Association</h2>
        <p>Before submitting your incorporation application you must <b>complete, sign, and date</b> the
          <v-tooltip top max-width="20rem" content-class="top-tooltip" transition="fade-transition">
            <template v-slot:activator="{ on }">
              <span v-on="on" class="tool-tip dotted-underline"> Memorandum of Association</span>
            </template>
            <span>
              Memorandum - an agreement which reflects the intention, values and authorized share capital
              of the Cooperative Association.  It is signed by the founding members.
            </span>
          </v-tooltip>.
        </p>
      </header>
    </section>

    <!-- Help Section -->
    <div v-if="getCreateMemorandumResource.helpSection" class="mt-5">
        <span class="help-btn" @click="helpToggle = !helpToggle">
          <v-icon color="primary" style="padding-right: 5px">mdi-help-circle-outline</v-icon>
          <span v-if="!helpToggle">{{ getCreateMemorandumResource.helpSection.header }}</span>
          <span v-else>Hide Help</span>
        </span>
      <section v-show="helpToggle" class="create-memorandum-help">
        <header id="create-memorandum-help-header"><h2>{{getCreateMemorandumResource.helpSection.header}}</h2></header>
        <p id="help-text-section-1"
           v-for="(item, index) in getCreateMemorandumResource.helpSection.helpText.section1.items"
           class="help-section mt-6"
           :key="index"
        >{{ item }}
        </p>
        <p class="help-section-label mt-4">
          <b>{{getCreateMemorandumResource.helpSection.helpText.section2.label}}</b>
        </p>
        <ul class="mt-6">
          <li
            v-for="(item, index) in getCreateMemorandumResource.helpSection.helpText.section2.items"
            class="help-section mt-2"
            :key="index"
          >
            <v-icon>mdi-circle-small</v-icon>
            <span class="chk-list-item-txt">{{item}}</span>
          </li>
        </ul>
        <p class="help-section-label mt-4">
          <b>{{getCreateMemorandumResource.helpSection.helpText.section3.label}}</b>
        </p>
        <ul class="mt-6">
          <li
            v-for="(item, index) in getCreateMemorandumResource.helpSection.helpText.section3.items"
            class="help-section mt-2"
            :key="index"
          >
            <v-icon>mdi-circle-small</v-icon>
            <span class="chk-list-item-txt">{{item}}</span>
          </li>
        </ul>
        <u class="help-btn" @click="helpToggle = !helpToggle"><small>Hide Help</small></u>
      </section>
    </div>

    <section id="sample-memorandum-section" class="mt-10">
      <header id="sample-memorandum-header">
        <h2>2. Sample Memorandum</h2>
      </header>
      <p class="mt-2">
        For your convenience, we have provided a sample Memorandum of Association with instructions.
      </p>
      <v-card flat id="sample-memorandum-card" class="pt-7 pb-5 pl-6">
        <v-row>
          <v-col id="sample-memorandum-card-left-col" cols="1" class="pt-6" >
          </v-col>
          <v-col id="sample-memorandum-card-center-col" cols="3" class="pl-8 pt-6">
            <div>
              <img src="@/assets/images/BCRegistries_Sample_CoopMemorandum_x2.png" class="preview-image" />
            </div>
          </v-col>
          <v-col id="sample-memorandum-card-right-col" cols="6" class="pt-6 pr-15">
            <div class="download-link-container ml-1 pt-5 pb-5">
                <v-icon color="primary" class="mt-n1">mdi-file-pdf-outline</v-icon>
                <a :href="documentURL" download class="mt-2">
                  Download the Sample Memorandum of Association
                </a>
            </div>
          </v-col>
          <v-col cols="2" class="pt-6"></v-col>
        </v-row>
      </v-card>
    </section>
    <section id="confirm-memorandum-section" class="mt-10">
      <header id="memorandum-confirm-header">
        <h2>3. Confirm Memorandum Completion</h2>
      </header>
      <div :class="{ 'invalid-section': getShowErrors && !hasMemorandumConfirmed }">
        <v-card flat id="confirm-memorandum-card" class="mt-4 pt-10 pb-6 pl-6 pr-9">
          <v-form ref="confirmMemorandumChk">
            <v-checkbox
              class="chk-memorandum"
              id="chk-confirm-memorandum"
              v-model="memorandumConfirmed"
              :rules="confirmCompletionMemorandum"
              label="I confirm the following items are included as required in the Memorandum of Association:"
              @change="onMemorandumConfirmedChange($event)"
            />
            <ul>
              <li class="mt-1">
                <v-icon>mdi-circle-small</v-icon>
                <span class="chk-list-item-txt">The Cooperative name is identified <b>exactly</b> as follows throughout
                  the Memorandum:
                </span>
                <div id="approved-name" class="ml-9">{{getNameRequestDetails.approvedName}}</div>
              </li>
              <li class="mt-4">
                <v-icon>mdi-circle-small</v-icon>
                <span class="chk-list-item-txt">
                  If required, there is a
                  <v-tooltip top max-width="20rem" content-class="top-tooltip" transition="fade-transition">
                    <template v-slot:activator="{ on }">
                      <span v-on="on" class="tool-tip dotted-underline">Dissolution Provision</span>
                    </template>
                    <span>
                      Dissolution Provision – all Cooperative Associations should have provisions for the distribution
                      of their property after they have been dissolved or wound up.  See example memorandum for
                      information relevant to your Cooperative Association type.</span>
                  </v-tooltip>
                   in the Memorandum of Association.
                </span>
              </li>
              <li class="mt-2">
                <v-row>
                  <v-col cols="1"><v-icon>mdi-circle-small</v-icon></v-col>
                  <v-col cols="11" class="ml-n11">
                    <span>
                      The
                      <v-tooltip top max-width="20rem" content-class="top-tooltip" transition="fade-transition">
                        <template v-slot:activator="{ on }">
                          <span v-on="on" class="tool-tip dotted-underline">correct type of shares</span>
                        </template>
                        <span>
                          Housing Cooperative Associations and Community Service Cooperative Associations
                          MUST NOT issue investment shares.
                        </span>
                      </v-tooltip>
                      are used in the Memorandum of Association based on the type of
                      Cooperative Association.
                    </span>
                  </v-col>
                </v-row>
              </li>
              <li class="mt-n2">
                <v-row>
                  <v-col cols="1"><v-icon>mdi-circle-small</v-icon></v-col>
                  <v-col cols="11" class="ml-n11">
                    <span>Each Subscriber and Witness has signed and dated the Memorandum of
                      Association and their name is printed under their signature.
                    </span>
                  </v-col>
                </v-row>
              </li>
            </ul>
          </v-form>
        </v-card>
      </div>
    </section>

    <section id="upload-memorandum-section" class="mt-10">
      <header id="upload-memorandum-header">
        <h2>4. Upload Memorandum</h2>
        <ul class="mt-5">
          <li class="mt-1">
            <v-icon>mdi-circle-small</v-icon>
            <span class="chk-list-item-txt">Must be set to fit onto 8.5" x 11"
              letter-size paper
            </span>
          </li>
          <li class="mt-1">
            <v-icon>mdi-circle-small</v-icon>
            <span class="chk-list-item-txt">Use a white background and a legible font with contrasting font colour
            </span>
          </li>
          <li class="mt-1">
            <v-icon>mdi-circle-small</v-icon>
            <span class="chk-list-item-txt">PDF file type (maximum 10 MB file size)</span>
          </li>
        </ul>
      </header>
      <div :class="{ 'invalid-section': getShowErrors && !hasValidUploadFile }" class="mt-7">
        <v-card flat id="upload-memorandum-card" class="pt-10 pb-10 pl-6">
          <v-row>
            <v-col id="upload-memorandum-card-left-col" cols="2" class="pt-6" >
              <v-card-title class="upload-memorandum-vcard-title pl-1 pr-0">
                <div>Upload</div>
                <div class="mt-n1">Memorandum</div>
              </v-card-title>
            </v-col>
            <v-col id="upload-memorandum-card-right-col" cols="10" class="pt-6 pl-6 pr-10">
              <FileUploadPreview
                :inputFileLabel="INPUT_FILE_LABEL"
                :maxSize="MAX_FILE_SIZE"
                :pdfPageSize="PdfPageSize.LETTER_SIZE"
                :inputFile="uploadMemorandumDoc"
                :showErrors="getShowErrors"
                :customErrorMessage="fileUploadCustomErrorMsg"
                @fileSelected="fileSelected"
                @isFileValid="isFileUploadValidFn"
              ></FileUploadPreview>
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
import { Action, Getter } from 'vuex-class'

// Interfaces
import {
  ActionBindingIF,
  CreateMemorandumIF,
  CreateMemorandumResourceIF,
  DocumentUpload,
  NameRequestDetailsIF,
  FormIF,
  ValidationDetailIF
} from '@/interfaces'

// Enums
import { RouteNames, ItemTypes, PdfPageSize } from '@/enums'

// Mixins
import { CommonMixin, DocumentMixin } from '@/mixins'

// Components
import FileUploadPreview from '@/components/common/FileUploadPreview.vue'

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

  private INPUT_FILE_LABEL = 'Memorandum of Association'
  private hasValidUploadFile = false
  private hasMemorandumConfirmed = false
  private memorandumConfirmed = false
  private fileUploadCustomErrorMsg: string = ''
  private uploadMemorandumDoc: File = null
  private uploadMemorandumDocKey: string = null
  private helpToggle = false

  @Getter getShowErrors!: boolean
  @Getter getNameRequestDetails!: NameRequestDetailsIF
  @Getter getCreateMemorandumResource!: CreateMemorandumResourceIF
  @Getter getCreateMemorandumStep!: CreateMemorandumIF
  @Getter getValidateSteps!: boolean
  @Getter getUserKeycloakGuid!: string

  @Action setMemorandum!: ActionBindingIF
  @Action setMemorandumStepValidity!: ActionBindingIF

  // Enum for template
  readonly RouteNames = RouteNames
  readonly ItemTypes = ItemTypes
  readonly PdfPageSize = PdfPageSize

  private get documentURL (): string {
    return sessionStorage.getItem('BASE_URL') +
      `files/cooperative_sample_memorandum.pdf`
  }

  private confirmCompletionMemorandum = [
    (v) => { return !!v }
  ]

  private setUploadMemorandumDoc (doc: File) {
    this.uploadMemorandumDoc = doc
    this.uploadMemorandumDocKey = null
  }

  private isFileUploadValidFn (val) {
    this.hasValidUploadFile = val
    this.updateMemorandumStepValidity()
  }

  private async fileSelected (file) {
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
      this.uploadMemorandumDoc = null
      this.uploadMemorandumDocKey = null
      this.setMemorandum({
        ...this.getCreateMemorandumStep,
        memorandumDoc: null,
        docKey: null
      })
    }
  }

  public async uploadPendingDocsToStorage () {
    const isPendingUpload = !this.uploadMemorandumDocKey
    if (isPendingUpload && this.hasValidUploadFile) {
      // NB: will throw if API error
      const doc: DocumentUpload = await this.getPresignedUrl(this.uploadMemorandumDoc.name)

      // NB: will return error response if API error
      const res = await this.uploadToUrl(doc.preSignedUrl, this.uploadMemorandumDoc, doc.key, this.getUserKeycloakGuid)

      if (res && res.status === 200) {
        const memorandumDoc = {
          name: this.uploadMemorandumDoc.name,
          lastModified: this.uploadMemorandumDoc.lastModified,
          size: this.uploadMemorandumDoc.size
        }
        this.setMemorandum({
          ...this.getCreateMemorandumStep,
          memorandumDoc: memorandumDoc,
          docKey: doc.key
        })
      } else {
        // put file uploader into manual error mode by passing custom error message
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

  private onMemorandumConfirmedChange (memorandumConfirmed: boolean): void {
    this.hasMemorandumConfirmed = memorandumConfirmed
    this.updateMemorandumStepValidity()
    this.setMemorandum({
      ...this.getCreateMemorandumStep,
      memorandumConfirmed: memorandumConfirmed
    })
  }

  /** Called when component is created. */
  private created (): void {
    this.uploadMemorandumDoc = this.getCreateMemorandumStep.memorandumDoc as File
    this.uploadMemorandumDocKey = this.getCreateMemorandumStep.docKey
    this.memorandumConfirmed = this.getCreateMemorandumStep.memorandumConfirmed
    this.hasValidUploadFile = !!this.uploadMemorandumDocKey
    this.hasMemorandumConfirmed = this.memorandumConfirmed
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

header {
  p {
    padding-top: 0.5rem;
  }
}

ul {
  list-style: none;
  color: $gray7;
}

.chk-list-item-txt {
  margin-left: 0.5rem;
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

::v-deep #confirm-memorandum-section {
  #approved-name {
    font-weight: bold;
  }

  // override default validation styling so checkbox does not turn red on validation error
  .v-input--selection-controls__input .error--text {
    color: $app-lt-gray !important;
  }
}

.chk-memorandum {
  margin-top: 0;
  padding-top: 0;
  height: 2.5rem !important;
}

.upload-memorandum-vcard-title {
  padding-top: 1px;
  font-size: 17px;
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
  margin-top: 85px;
  border-top: solid 1px $gray3;
  border-bottom: solid 1px $gray3;
}

#sample-memorandum-section {
  a {
    text-decoration: none;
  }
}
</style>
