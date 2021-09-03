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
          <p class="help-section-label-top">
            <b>{{getCreateRulesResource.helpSection.helpText.section1.label}}</b>
          </p>
          <ul>
            <li
              v-for="(item, index) in getCreateRulesResource.helpSection.helpText.section1.items"
              class="help-section"
              :key="index"
            >{{ item }}
            </li>
          </ul>
          <p class="help-section-label">
            <b>{{getCreateRulesResource.helpSection.helpText.section2.label}}</b>
          </p>
          <ul>
            <li
              v-for="(item, index) in getCreateRulesResource.helpSection.helpText.section2.items"
              class="help-section"
              :key="index"
            >
              <span v-if="item.type == ItemTypes.TEXT" v-html="item.value"></span>
              <span v-if="item.type == ItemTypes.PARTIAL_ITEMS">
                <span v-for="(partialItem, index) in item.value" :key="index">
                  <span v-if="partialItem.type == ItemTypes.TEXT" v-html="partialItem.value"></span>
                  <a v-if="partialItem.type == ItemTypes.LINK"
                     :href="partialItem.value.href"
                     target="_blank"
                  >{{partialItem.value.linkText}}
                    <v-icon dense color="primary">mdi-open-in-new</v-icon>
                  </a>
                </span>
              </span>
            </li>
          </ul>
          <p id="help-text-section-3"
            v-for="(item, index) in getCreateRulesResource.helpSection.helpText.section3.items"
            class="help-section"
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
        <v-card flat id="confirm-rules-card">
          <v-form ref="confirmRulesChk">
            <v-checkbox
              class="chk-rules"
              id="chk-confirm-rules"
              :v-model="rulesConfirmed"
              :value="getCreateRulesStep.rulesConfirmed"
              :rules="confirmCompletionRules"
              label="I confirm the following items are included as required in the Rules of the Association:"
              @change="onRulesConfirmedChange($event)"
            />
            <ul>
              <li>The Cooperative name is identified <b>exactly</b> as follows throughout the Memorandum:</li>
              <div id="approved-name">{{getNameRequestDetails.approvedName}}</div>
              <li>Each Subscriber and Witness has signed and dated the Rules of the Association and their name is
                printed under their signature.</li>
            </ul>
          </v-form>
        </v-card>
      </div>
    </section>

    <section id="upload-rules-section" class="mt-10">
      <header id="upload-rules-header">
        <h2>3. Upload Rules</h2>
        <ul>
          <li>Must be set to fit onto 8 <sup>1</sup>&frasl;<sub>2</sub>" x 11" letter-size paper</li>
          <li>Use a white background and a legible font with contrasting font colour</li>
          <li>PDF file type (maximum 10 MB file size)</li>
        </ul>
        <div id="upload-rules-note">
          <b>Note: </b>Do not upload Housing Cooperative occupancy agreements.
        </div>
      </header>
      <div :class="{ 'invalid-section': getShowErrors && !hasValidUploadFile }">
        <v-card flat id="upload-rules-card">
          <v-row>
            <v-col id="upload-rules-card-left-col" cols="2">
              <v-card-title class="upload-rules-vcard-title">Upload Rules</v-card-title>
            </v-col>
            <v-col id="upload-rules-card-right-col" cols="10">
              <FileUploadPreview
                :inputFileLabel="INPUT_FILE_LABEL"
                :maxSize="MAX_FILE_SIZE"
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
import { Component, Mixins, Prop, Vue, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'

// Interfaces
import {
  ActionBindingIF,
  CreateRulesIF,
  CreateRulesResourceIF,
  RulesDocIF,
  DocumentUpload,
  NameRequestDetailsIF, ConfirmDialogType, FormType
} from '@/interfaces'

// Enums
import { RouteNames, ItemTypes } from '@/enums'

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
  private UPLOAD_FAILED_MESSAGE = 'An error occurred while uploading.  Please try again.'
  private MAX_FILE_SIZE = 10 * 1024 // 10 MB in KB
  private hasValidUploadFile: boolean = false
  private hasRulesConfirmed: boolean = false
  private rulesConfirmed = false
  private fileUploadCustomErrorMsg: string = ''
  private uploadRulesDoc:File = null
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

  private confirmCompletionRules = [
    (v) => { return !!v }
  ]

  private setUploadRulesDoc (doc: File) {
    this.uploadRulesDoc = doc
    let rulesDoc:RulesDocIF = null
    if (doc) {
      rulesDoc = {
        name: doc.name,
        lastModified: doc.lastModified,
        size: doc.size
      }
    }
    this.setRules({
      ...this.getCreateRulesStep,
      rulesDoc: rulesDoc,
      docKey: null
    })
  }

  private isFileUploadValidFn (val) {
    this.hasValidUploadFile = val
    this.setRulesStepValidity(this.hasValidUploadFile && this.hasRulesConfirmed)
  }

  private async fileSelected (file) {
    // reset state of file uploader to ensure not in manual error mode
    this.fileUploadCustomErrorMsg = ''
    if (file && this.hasValidUploadFile) {
      this.setUploadRulesDoc(file)
      await this.uploadPendingDocsToStorage()
    } else {
      this.uploadRulesDoc = null
      this.setRules({
        ...this.getCreateRulesStep,
        rulesDoc: null,
        docKey: null
      })
    }
  }

  public async uploadPendingDocsToStorage () {
    const isPendingUpload = !this.getCreateRulesStep.docKey
    if (isPendingUpload && this.hasValidUploadFile) {
      const doc:DocumentUpload = await this.getPresignedUrl(this.getCreateRulesStep.rulesDoc.name)
      const res = await this.uploadToUrl(doc.preSignedUrl, this.uploadRulesDoc, doc.key, this.getUserKeycloakGuid)
      if (res && res.status === 200) {
        this.setRules({
          ...this.getCreateRulesStep,
          docKey: doc.key
        })
      } else {
        // put file uploader into manual error mode by passing custom error message
        this.fileUploadCustomErrorMsg = this.UPLOAD_FAILED_MESSAGE
        this.hasValidUploadFile = false
        this.setRulesStepValidity(this.hasValidUploadFile && this.hasRulesConfirmed)
      }
    }
  }

  private onRulesConfirmedChange (rulesConfirmed: boolean): void {
    this.hasRulesConfirmed = rulesConfirmed
    this.setRulesStepValidity(this.hasRulesConfirmed && this.hasValidUploadFile)
    this.setRules({
      ...this.getCreateRulesStep,
      rulesConfirmed: rulesConfirmed
    })
  }

  /** Called when component is created. */
  private created (): void {
    this.uploadRulesDoc = this.getCreateRulesStep.rulesDoc as File
    this.rulesConfirmed = this.getCreateRulesStep.rulesConfirmed
  }

  @Watch('getShowErrors')
  private onShowErrorsChanged (): void {
    if (this.getShowErrors && this.$refs.confirmRulesChk) {
      this.$refs.confirmRulesChk.validate()
    }
  }

  @Watch('$route')
  private async scrollToInvalidComponent (): Promise<void> {
    if (this.getShowErrors && this.$route.name === RouteNames.CREATE_RULES) {
      // Scroll to invalid components.
      await Vue.nextTick()
      await this.validateAndScroll(
        {
          hasValidUploadFile: this.hasValidUploadFile,
          hasRulesConfirmed: this.hasRulesConfirmed
        },
        [
          'upload-rules-header',
          'rules-confirm-header'
        ]
      )
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
  margin-left: 45px;
  padding-left: 0px;
  list-style: none;
}

// styling used to have custom bullets that use material design icons
ul li::before {
  // mdi-circle-small
  content: '\F09DF';
  font-family: 'Material Design Icons';
  margin-left: -24px;
  padding-left: 0;
  font-size: 24px;
}

li {
  margin-top: 0px !important;
  color: $gray7;
  vertical-align: -2px;
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

  .help-section-label-top {
    margin-top: 4px;
  }

  .help-section-label {
    margin-top: 15px;
  }

  #help-text-section-3 {
    margin-top: 25px;
  }

  a {
    text-decoration: none;
  }
}

::v-deep #confirm-rules-section {
  #confirm-rules-card {
    margin-top: 15px;
    padding-top: 40px;
    padding-bottom: 40px;
    padding-left: 25px;
    padding-right: 25px;
  }

  #approved-name {
    font-weight: bold;
    margin-top: -3px;
    margin-left: 0px;
  }

  // override default validation styling so checkbox does not turn red on validation error
  .v-input--selection-controls__input i {
    color:rgba(0, 0, 0, 0.54) !important;
  }
}

.chk-rules {
  margin-top: 0px;
  padding-top: 0px;
  height: 2.5rem !important;
}

#upload-rules-section {
  #upload-rules-note {
    font-size: 16px;
    margin-top: 40px;
    margin-bottom: 30px;
  }

  #upload-rules-card {
    padding-top: 40px;
    padding-bottom: 40px;
    padding-left: 29px;

    #upload-rules-card-left-col {
      padding-top:25px;
    }

    #upload-rules-card-right-col {
      padding-top: 25px;
      padding-left: 25px;
      padding-right: 40px;
    }
  }
}

.upload-rules-vcard-title {
  padding-top: 1px;
  padding-left: 0px;
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
