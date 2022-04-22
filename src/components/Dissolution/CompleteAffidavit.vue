<template>
  <div id="complete-affidavit">
    <!-- Intro section -->
    <section class="mt-10">
      <header>
        <h2>1. Affidavit</h2>
        <p>Before submitting the voluntary dissolution you must <b>complete and sign</b> an
          <v-tooltip top max-width="15rem" content-class="top-tooltip" transition="fade-transition">
            <template v-slot:activator="{ on }">
              <span v-on="on" class="tool-tip dotted-underline"> affidavit </span>
            </template>
            <span>
              Affidavit – A declaration signed by a Commissioner for Taking Oaths.
            </span>
          </v-tooltip>
          and {{ getAffidavitResources.affidavitActionText }}
        </p>
      </header>
    </section>

    <!-- Help section -->
    <div class="mt-5" v-if="getAffidavitResources.helpSection">
      <span class="help-btn" @click="helpToggle = !helpToggle">
        <v-icon color="primary" class="pr-1">mdi-help-circle-outline</v-icon>
        <span v-if="!helpToggle">Help with Affidavit</span>
        <span v-else>Hide Help</span>
      </span>

      <v-expand-transition>
        <section v-show="helpToggle" class="affidavit-help">
          <header id="affidavit-help-header">
            <h2>Help with Affidavit</h2>
          </header>

          <p>{{getAffidavitResources.helpSection.header}}</p>
          <ul class="bulleted-list mt-6">
            <li
              v-for="(item, index) in getAffidavitResources.helpSection.helpText"
              class="mt-2"
              :key="index"
              v-html="item"
            />
          </ul>
          <p class="mt-4"><strong>Note:</strong> {{ getAffidavitResources.helpSection.note }}</p>
          <u class="help-btn" @click="helpToggle = !helpToggle"><small>Hide Help</small></u>
        </section>
      </v-expand-transition>
    </div>

    <!-- Sample Affidavit -->
    <section id="sample-affidavit-section" class="mt-10">
      <header id="sample-affidavit-header">
        <h2>2. Sample Affidavit</h2>
      </header>

      <p class="mt-2">For your convenience, we have provided a sample affidavit with instructions.</p>

      <v-card flat class="py-8 px-6">
        <div class="d-flex flex-column flex-sm-row justify-center align-center">
          <img v-if="isTypeCoop" src="@/assets/images/BCRegistries_CoopAffidavit-x2.png" class="preview-image"/>
          <img v-else src="@/assets/images/BCRegistries_CorporationAffidavit-x2.png" class="preview-image"/>
          <div class="px-8" />
          <div class="download-link-container py-5">
            <v-icon color="primary" class="mt-n1">mdi-file-pdf-outline</v-icon>
            <a :href="documentURL" download class="ml-1">Download the Sample Affidavit</a>
          </div>
        </div>
      </v-card>
    </section>

    <!-- Confirm Affidavit Completion -->
    <section id="confirm-affidavit-section" class="mt-10">
      <header id="confirm-affidavit-header">
        <h2>3. Confirm Affidavit Completion</h2>
      </header>

      <div class="mt-4" :class="{ 'invalid-section': getShowErrors && !hasAffidavitConfirmed }">
        <v-card flat id="confirm-affidavit-card" class="py-8 px-6">
          <v-form ref="confirmAffidavitChk">
            <v-checkbox
              id="chk-confirm-affidavit"
              class="chk-affidavit mt-0 pt-0"
              v-model="affidavitConfirmed"
              hide-details
              :rules="confirmCompletionAffidavit"
              :label="getAffidavitResources.confirmSection.checkboxLabel"
              @change="onAffidavitConfirmedChange($event)"
            />
            <ul>
              <li class="mt-4">
                <v-row no-gutters>
                  <v-col cols="1"><v-icon>mdi-circle-small</v-icon></v-col>
                  <v-col cols="11">
                    The {{ entityTitle }} name is identified <b>exactly</b> as follows throughout the affidavit:
                    <p class="font-weight-bold mb-0">{{ entityName }}</p>
                  </v-col>
                </v-row>
              </li>
              <li
                class="mt-4"
                v-for="(item, index) in getAffidavitResources.confirmSection.confirmText"
                :key="index"
              >
                <v-row no-gutters>
                  <v-col cols="1"><v-icon>mdi-circle-small</v-icon></v-col>
                  <v-col cols="11">{{item}}</v-col>
                </v-row>
              </li>
            </ul>
          </v-form>
        </v-card>
      </div>
    </section>

    <!-- Upload Affidavit -->
    <section v-if="isTypeCoop" id="upload-affidavit-section" class="mt-10">
      <header id="upload-affidavit-header">
        <h2>4. Upload Affidavit</h2>
        <p>Upload a PDF of the signed and sealed affidavit.</p>
        <ul class="mt-5">
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

      <div class="mt-4" :class="{ 'invalid-section': getShowErrors && !hasValidUploadFile }">
        <v-card flat id="upload-affidavit-card" class="py-8 px-6">
          <v-row no-gutters>
            <v-col cols="12" sm="3" class="pr-4">
              <label class="upload-affidavit-title">Upload Affidavit</label>
            </v-col>
            <v-col cols="12" sm="9" class="pt-4 pt-sm-0">
              <FileUploadPreview
                :inputFileLabel="INPUT_FILE_LABEL"
                :maxSize="MAX_FILE_SIZE"
                :pdfPageSize="PdfPageSize.LETTER_SIZE"
                :inputFile="uploadAffidavitDoc"
                :showErrors="getShowErrors"
                :customErrorMessage="fileUploadCustomErrorMsg"
                @fileSelected="fileSelected"
                @isFileValid="onFileUploadValid"
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
import { Action, Getter } from 'vuex-class'

// Interfaces
import {
  ActionBindingIF,
  AffidavitResourceIF,
  DocumentUpload,
  FormIF,
  ValidationDetailIF,
  UploadAffidavitIF
} from '@/interfaces'

// Enums
import { RouteNames, ItemTypes, PdfPageSize, CorpTypeCd } from '@/enums'

// Mixins
import { CommonMixin, DocumentMixin, EnumMixin } from '@/mixins'

// Components
import FileUploadPreview from '@/components/common/FileUploadPreview.vue'

@Component({
  components: {
    FileUploadPreview
  }
})
export default class CompleteAffidavit extends Mixins(CommonMixin, DocumentMixin, EnumMixin) {
  // Refs
  $refs!: {
    confirmAffidavitChk: FormIF
  }

  private INPUT_FILE_LABEL = 'Affidavit'
  private hasValidUploadFile = false
  private hasAffidavitConfirmed = false
  private affidavitConfirmed = false
  private fileUploadCustomErrorMsg: string = ''
  private uploadAffidavitDoc: File = null
  private uploadAffidavitDocKey: string = null
  private helpToggle = false

  // Global getters
  @Getter getAffidavitResources!: AffidavitResourceIF
  @Getter getBusinessLegalName!: string
  @Getter isTypeCoop!: boolean
  @Getter getShowErrors!: boolean
  @Getter getAffidavitStep!: UploadAffidavitIF
  @Getter getUserKeycloakGuid!: string
  @Getter getEntityType!: CorpTypeCd

  @Action setAffidavit!: ActionBindingIF
  @Action setAffidavitStepValidity!: ActionBindingIF

  // Enum for template
  readonly RouteNames = RouteNames
  readonly ItemTypes = ItemTypes
  readonly PdfPageSize = PdfPageSize

  private get documentURL (): string {
    return `${sessionStorage.getItem('BASE_URL')}files/${this.getAffidavitResources.sampleSection.fileName}`
  }

  /** The entity name. */
  private get entityName (): string {
    return this.getBusinessLegalName || `${this.getCorpTypeNumberedDescription(this.getEntityType)}`
  }

  private get entityTitle (): string {
    return this.isTypeCoop ? 'Cooperative Association' : 'Company'
  }

  private confirmCompletionAffidavit = [
    (v) => { return !!v }
  ]

  private setUploadAffidavitDoc (doc: File) {
    this.uploadAffidavitDoc = doc
    this.uploadAffidavitDocKey = null
  }

  private onFileUploadValid (val) {
    this.hasValidUploadFile = val
    this.updateAffidavitStepValidity()
  }

  private async fileSelected (file) {
    // reset state of file uploader to ensure not in manual error mode
    this.fileUploadCustomErrorMsg = ''
    if (file) {
      if (this.hasValidUploadFile) {
        this.setUploadAffidavitDoc(file)
        await this.uploadPendingDocsToStorage()
      } else {
        this.uploadAffidavitDocKey = null
      }
    } else {
      this.uploadAffidavitDoc = null
      this.uploadAffidavitDocKey = null
      this.setAffidavit({
        ...this.getAffidavitStep,
        affidavitDoc: null,
        docKey: null
      })
    }
  }

  public async uploadPendingDocsToStorage () {
    const isPendingUpload = !this.uploadAffidavitDocKey
    if (isPendingUpload && this.hasValidUploadFile) {
      // NB: will throw if API error
      const doc: DocumentUpload = await this.getPresignedUrl(this.uploadAffidavitDoc.name)

      // NB: will return error response if API error
      const res = await this.uploadToUrl(doc.preSignedUrl, this.uploadAffidavitDoc, doc.key, this.getUserKeycloakGuid)

      if (res && res.status === 200) {
        const affidavitDoc = {
          name: this.uploadAffidavitDoc.name,
          lastModified: this.uploadAffidavitDoc.lastModified,
          size: this.uploadAffidavitDoc.size
        }
        this.setAffidavit({
          ...this.getAffidavitStep,
          affidavitDoc: affidavitDoc,
          docKey: doc.key
        })
      } else {
        // put file uploader into manual error mode by passing custom error message
        this.fileUploadCustomErrorMsg = this.UPLOAD_FAILED_MESSAGE
        this.hasValidUploadFile = false
        this.updateAffidavitStepValidity()
        this.uploadAffidavitDocKey = null
      }
    }
  }

  private updateAffidavitStepValidity () {
    const validationDetail: ValidationDetailIF =
      {
        valid: this.hasAffidavitConfirmed && this.hasValidUploadFile,
        validationItemDetails: [
          {
            name: 'hasAffidavitConfirmed',
            valid: this.hasAffidavitConfirmed,
            elementId: 'confirm-affidavit-header'
          },
          {
            name: 'hasValidUploadFile',
            valid: this.hasValidUploadFile,
            elementId: 'upload-affidavit-header'
          }
        ]
      }
    this.setAffidavitStepValidity(validationDetail)
  }

  private onAffidavitConfirmedChange (affidavitConfirmed: boolean): void {
    this.hasAffidavitConfirmed = affidavitConfirmed
    this.updateAffidavitStepValidity()
    this.setAffidavit({
      ...this.getAffidavitStep,
      affidavitConfirmed: affidavitConfirmed
    })
  }

  /** Called when component is created. */
  created (): void {
    this.uploadAffidavitDoc = this.getAffidavitStep.affidavitDoc as File
    this.uploadAffidavitDocKey = this.getAffidavitStep.docKey
    this.affidavitConfirmed = this.getAffidavitStep.affidavitConfirmed
    this.hasValidUploadFile = !!this.uploadAffidavitDocKey
    this.hasAffidavitConfirmed = this.affidavitConfirmed
  }

  async mounted (): Promise<void> {
    // wait for components to load/stabilize then update validation state in store
    await this.$nextTick()
    this.updateAffidavitStepValidity()
  }

  @Watch('getShowErrors')
  private onShowErrorsChanged (): void {
    if (this.getShowErrors && this.$refs.confirmAffidavitChk) {
      this.$refs.confirmAffidavitChk.validate()
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

.help-btn {
  cursor: pointer;
  color: $app-blue;
  vertical-align: middle;
}

.affidavit-help {
  margin: 2rem 0;
  border-top: 1px dashed $gray6;
  border-bottom: 1px dashed $gray6;
  padding: 1rem 0;

  #affidavit-help-header {
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

::v-deep {
  // override default validation styling so checkbox does not turn red on validation error
  .v-input--selection-controls__input .error--text {
    color: $app-lt-gray !important;
  }

  .v-input--selection-controls__input {
    align-self: baseline;
  }
}

.chk-affidavit {
  color: $gray9;

  ::v-deep {
    .theme--light.v-icon {
      color: $gray9;
    }
    .v-label {
      line-height: 1.5rem;
    }
  }
}

.upload-affidavit-title {
  font-size: $px-16;
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

#sample-affidavit-section {
  a {
    text-decoration: none;
  }
}

#upload-affidavit-card {
  // file upload input field
  ::v-deep label.v-label.theme--light {
    color: $gray7 !important;
  }

  // remove extra space taken by error message
  ::v-deep .v-text-field__details {
    margin-bottom: -8px !important;
  }
}
</style>
