<template>
  <div id="upload-rules">
    <section class="mt-10">
      <header>
        <h2>1. Rules of the Association</h2>
        <p>Before submitting your incorporation application you must <b>complete, sign, and date</b> the
          <v-tooltip top max-width="20rem" content-class="top-tooltip">
            <template v-slot:activator="{ on }">
              <span v-on="on" class="tool-tip dotted-underline"> Rules of the Association</span>
            </template>
            <span>Rules - a signed document which outlines rules and procedures for the Cooperative Association
            and its members.</span>
          </v-tooltip>.
        </p>
      </header>
    </section>

    <!-- Help Section -->
    <div v-if="getCreateRulesResource.helpSection" class="mt-5">
      <span class="help-btn" @click="helpToggle = !helpToggle">
        <v-icon color="primary" style="padding-right: 5px">mdi-help-circle-outline</v-icon>
        <span v-if="!helpToggle">{{ getCreateRulesResource.helpSection.header }}</span>
        <span v-else>Hide Help</span>
      </span>
      <section v-show="helpToggle" class="create-rules-help">
        <header id="create-rules-help-header"><h2>{{getCreateRulesResource.helpSection.header}}</h2></header>
        <p class="help-section-label mt-4">
          <b>{{getCreateRulesResource.helpSection.helpText.section1.label}}</b>
        </p>
        <ul>
          <li
            v-for="(item, index) in getCreateRulesResource.helpSection.helpText.section1.items"
            class="help-section mt-1"
            :key="index"
          >
            <v-icon>mdi-circle-small</v-icon>
            <span class="chk-list-item-txt">{{ item }}</span>
          </li>
        </ul>
        <p class="help-section-label mt-4">
          <b>{{getCreateRulesResource.helpSection.helpText.section2.label}}</b>
        </p>
        <ul class="mt-6">
          <li
            v-for="(item, index) in getCreateRulesResource.helpSection.helpText.section2.items"
            class="help-section mt-n2"
            :key="index"
          >
            <v-icon v-if="item.type === ItemTypes.TEXT">mdi-circle-small</v-icon>
            <span v-if="item.type === ItemTypes.TEXT" v-html="item.value" class="chk-list-item-txt"></span>
            <v-row v-if="item.type === ItemTypes.PARTIAL_ITEMS">
              <v-col cols="1"><v-icon>mdi-circle-small</v-icon></v-col>
              <v-col cols="11" class="ml-n12">
                <span v-for="(partialItem, index) in item.value" :key="index">
                  <span v-if="partialItem.type === ItemTypes.TEXT" v-html="partialItem.value"></span>
                  <a v-if="partialItem.type === ItemTypes.LINK"
                     :href="partialItem.value.href"
                     target="_blank"
                  >{{partialItem.value.linkText}}
                    <v-icon dense color="primary">mdi-open-in-new</v-icon>
                  </a>
                </span>
              </v-col>
            </v-row>
          </li>
        </ul>
        <p id="help-text-section-3"
          v-for="(item, index) in getCreateRulesResource.helpSection.helpText.section3.items"
          class="help-section mt-6"
          :key="index"
        >{{ item }}
        </p>

        <u class="help-btn" @click="helpToggle = !helpToggle"><small>Hide Help</small></u>
      </section>
    </div>

    <section id="confirm-rules-section" class="mt-10">
      <header id="rules-confirm-header">
        <h2>2. Confirm Rules Completion</h2>
      </header>
      <div :class="{ 'invalid-section': getShowErrors && !hasRulesConfirmed }">
        <v-card flat id="confirm-rules-card" class="mt-4 pt-10 pb-6 pl-6 pr-6">
          <v-form ref="confirmRulesChk">
            <v-checkbox
              class="chk-rules"
              id="chk-confirm-rules"
              v-model="rulesConfirmed"
              :rules="confirmCompletionRules"
              label="I confirm the following items are included as required in the Rules of the Association:"
              @change="onRulesConfirmedChange($event)"
            />
            <ul>
              <li class="mt-1">
                <v-icon>mdi-circle-small</v-icon>
                <span class="chk-list-item-txt">The Cooperative name is identified <b>exactly</b> as follows throughout
                  the Memorandum:
                </span>
                <div id="approved-name" class="ml-9">{{getNameRequestDetails.approvedName}}</div>
              </li>
              <li class="mt-1">
                <v-row>
                  <v-col cols="1"><v-icon>mdi-circle-small</v-icon></v-col>
                  <v-col cols="11" class="ml-n11">
                    <span>Each Subscriber and Witness has signed and dated the Rules of the
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

    <section id="upload-rules-section" class="mt-10">
      <header id="upload-rules-header">
        <h2>3. Upload Rules</h2>
        <ul class="mt-5">
          <li class="mt-1">
            <v-icon>mdi-circle-small</v-icon>
            <span class="chk-list-item-txt">Must be set to fit onto 8 <sup>1</sup>&frasl;<sub>2</sub>" x 11"
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
        <div id="upload-rules-note" class="mt-7 mb-8">
          <b>Note: </b>Do not upload Housing Cooperative occupancy agreements.
        </div>
      </header>
      <div :class="{ 'invalid-section': getShowErrors && !hasValidUploadFile }">
        <v-card flat id="upload-rules-card" class="pt-10 pb-10 pl-6">
          <v-row>
            <v-col id="upload-rules-card-left-col" cols="2" class="pt-6" >
              <v-card-title class="upload-rules-vcard-title pl-0">Upload Rules</v-card-title>
            </v-col>
            <v-col id="upload-rules-card-right-col" cols="10" class="pt-6 pl-6 pr-10">
              <FileUploadPreview
                :inputFileLabel="INPUT_FILE_LABEL"
                :maxSize="MAX_FILE_SIZE"
                :pdfPageSize="PdfPageSize.LETTER_SIZE"
                :inputFile="uploadRulesDoc"
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
import { Component, Mixins, Watch, Vue } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'

// Interfaces
import {
  ActionBindingIF,
  CreateRulesIF,
  CreateRulesResourceIF,
  DocumentUpload,
  NameRequestDetailsIF,
  FormType,
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
export default class UploadRules extends Mixins(CommonMixin, DocumentMixin) {
  // Refs
  $refs!: {
    confirmRulesChk: FormType
  }

  private INPUT_FILE_LABEL = 'Rules of Association'
  private hasValidUploadFile = false
  private hasRulesConfirmed = false
  private rulesConfirmed = false
  private fileUploadCustomErrorMsg: string = ''
  private uploadRulesDoc:File = null
  private uploadRulesDocKey: string = null
  private helpToggle = false

  @Getter getShowErrors!: boolean
  @Getter getNameRequestDetails!: NameRequestDetailsIF
  @Getter getCreateRulesResource!: CreateRulesResourceIF
  @Getter getCreateRulesStep!: CreateRulesIF
  @Getter getValidateSteps!: boolean
  @Getter getUserKeycloakGuid!: string

  @Action setRules!: ActionBindingIF
  @Action setRulesStepValidity!: ActionBindingIF

  // Enum for template
  readonly RouteNames = RouteNames
  readonly ItemTypes = ItemTypes
  readonly PdfPageSize = PdfPageSize

  private confirmCompletionRules = [
    (v) => { return !!v }
  ]

  private setUploadRulesDoc (doc: File) {
    this.uploadRulesDoc = doc
    this.uploadRulesDocKey = null
  }

  private async isFileUploadValidFn (val) {
    this.hasValidUploadFile = val
    this.updateRulesStepValidity()
  }

  private async fileSelected (file) {
    // reset state of file uploader to ensure not in manual error mode
    this.fileUploadCustomErrorMsg = ''
    if (file) {
      if (this.hasValidUploadFile) {
        this.setUploadRulesDoc(file)
        await this.uploadPendingDocsToStorage()
      } else {
        this.uploadRulesDocKey = null
      }
    } else {
      this.uploadRulesDoc = null
      this.uploadRulesDocKey = null
      this.setRules({
        ...this.getCreateRulesStep,
        rulesDoc: null,
        docKey: null
      })
    }
  }

  public async uploadPendingDocsToStorage () {
    const isPendingUpload = !this.uploadRulesDocKey
    if (isPendingUpload && this.hasValidUploadFile) {
      const doc:DocumentUpload = await this.getPresignedUrl(this.uploadRulesDoc.name)
      const res = await this.uploadToUrl(doc.preSignedUrl, this.uploadRulesDoc, doc.key, this.getUserKeycloakGuid)
      if (res && res.status === 200) {
        const rulesDoc = {
          name: this.uploadRulesDoc.name,
          lastModified: this.uploadRulesDoc.lastModified,
          size: this.uploadRulesDoc.size
        }
        this.setRules({
          ...this.getCreateRulesStep,
          rulesDoc: rulesDoc,
          docKey: doc.key
        })
      } else {
        // put file uploader into manual error mode by passing custom error message
        this.fileUploadCustomErrorMsg = this.UPLOAD_FAILED_MESSAGE
        this.hasValidUploadFile = false
        this.updateRulesStepValidity()
        this.uploadRulesDocKey = null
      }
    }
  }

  private updateRulesStepValidity () {
    const validationDetail:ValidationDetailIF =
      {
        valid: this.hasRulesConfirmed && this.hasValidUploadFile,
        validationItemDetails: [
          { name: 'hasRulesConfirmed', valid: this.hasRulesConfirmed, elementId: 'rules-confirm-header' },
          { name: 'hasValidUploadFile', valid: this.hasValidUploadFile, elementId: 'upload-rules-header' }
        ]
      }
    this.setRulesStepValidity(validationDetail)
  }

  private onRulesConfirmedChange (rulesConfirmed: boolean): void {
    this.hasRulesConfirmed = rulesConfirmed
    this.updateRulesStepValidity()
    this.setRules({
      ...this.getCreateRulesStep,
      rulesConfirmed: rulesConfirmed
    })
  }

  /** Called when component is created. */
  private created (): void {
    this.uploadRulesDoc = this.getCreateRulesStep.rulesDoc as File
    this.uploadRulesDocKey = this.getCreateRulesStep.docKey
    this.rulesConfirmed = !!this.getCreateRulesStep.rulesConfirmed
    this.hasValidUploadFile = !!this.uploadRulesDocKey
    this.hasRulesConfirmed = this.rulesConfirmed
    this.updateRulesStepValidity()
  }

  @Watch('getShowErrors')
  private onShowErrorsChanged (): void {
    if (this.getShowErrors && this.$refs.confirmRulesChk) {
      this.$refs.confirmRulesChk.validate()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';
header {
  p {
    padding-top: 0.5rem
  }
}

ul {
  list-style: none;
  color: $gray7;
}

.chk-list-item-txt {
  margin-left: 0.5rem;
}

.upload-rules-summary-header {
  display: flex;
  background-color: $BCgovBlue5O;
  padding: 1.25rem;

  .upload-rules-title {
    color: $gray9;
  }
}

.upload-rules-error-message {
  padding-top: 1.25rem;
  padding-left: 1.25rem;
  color: $app-blue;
}

.help-btn {
  cursor: pointer;
  color: $app-blue;
  vertical-align: middle;
}

.create-rules-help {
  margin: 2rem 0;
  border-top: 1px dashed $gray6;
  border-bottom: 1px dashed $gray6;
  padding: 1rem 0;

  #create-rules-help-header {
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

::v-deep #confirm-rules-section {
  #approved-name {
    font-weight: bold;
  }

  // override default validation styling so checkbox does not turn red on validation error
  .v-input--selection-controls__input .error--text{
    color: $app-lt-gray !important;
  }
}

.chk-rules {
  margin-top: 0;
  padding-top: 0;
  height: 2.5rem !important;
}

#upload-rules-section {
  #upload-rules-note {
    font-size: 16px;
  }
}

.upload-rules-vcard-title {
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
</style>
