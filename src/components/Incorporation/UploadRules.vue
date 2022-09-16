<template>
  <div id="upload-rules">
    <!-- Intro section -->
    <section id="header-rules-section" class="mt-10">
      <header>
        <h2>1. Rules of the Association</h2>
        <p>Before submitting your incorporation application you must <b>complete, sign, and date</b> the
          <v-tooltip top max-width="20rem" content-class="top-tooltip" transition="fade-transition">
            <template v-slot:activator="{ on }">
              <span v-on="on" class="tool-tip dotted-underline"> Rules of the Association</span>
            </template>
            <span>Rules - a signed document which outlines rules and procedures for the Cooperative Association
            and its members.</span>
          </v-tooltip>.
        </p>
      </header>
    </section>

    <!-- Help section -->
    <div v-if="getCreateRulesResource.helpSection" class="mt-5" id="help-rules-section">
      <span class="help-btn" @click="helpToggle = !helpToggle">
        <v-icon color="primary" style="padding-right: 5px">mdi-help-circle-outline</v-icon>
        <span v-if="!helpToggle">{{ getCreateRulesResource.helpSection.header }}</span>
        <span v-else>Hide Help</span>
      </span>

      <v-expand-transition>
        <section v-show="helpToggle" class="create-rules-help">
          <header id="create-rules-help-header">
            <h2>{{getCreateRulesResource.helpSection.header}}</h2>
          </header>

          <!-- help section 1 -->
          <p class="help-section-title font-weight-bold mt-4">
            {{getCreateRulesResource.helpSection.helpText.section1.label}}
          </p>
          <ul class="bulleted-list mt-4">
            <li
              v-for="(item, index) in getCreateRulesResource.helpSection.helpText.section1.items"
              class="mt-1"
              :key="index"
              v-html="item"
            />
          </ul>

          <!-- help section 2 -->
          <p class="help-section-title font-weight-bold mt-4">
            {{getCreateRulesResource.helpSection.helpText.section2.label}}
          </p>
          <ul class="bulleted-list mt-4">
            <li
              v-for="(item, index) in getCreateRulesResource.helpSection.helpText.section2.items"
              :key="index"
            >
              <span v-if="item.type === ItemTypes.TEXT" v-html="item.value"/>
              <template v-if="item.type === ItemTypes.PARTIAL_ITEMS">
                <template v-for="(partialItem, index) in item.value">
                  <span
                    v-if="partialItem.type === ItemTypes.TEXT"
                    :key="index"
                    v-html="partialItem.value"
                  />
                  <a
                    v-if="partialItem.type === ItemTypes.LINK"
                    :key="index"
                    :href="partialItem.value.href"
                    target="_blank"
                  >
                    {{partialItem.value.linkText}}
                    <v-icon dense color="primary">mdi-open-in-new</v-icon>
                  </a>
                </template>
              </template>
            </li>
          </ul>

          <!-- help section 3 -->
          <p class="mt-4">
            The Cooperative Association Regulation provide a
            <a :href="getCreateRulesResource.helpSection.helpText.section3.href" target="_blank">Schedule B</a>
            template of Rules. The rules adopted by a Cooperative Association may be in this form, a modified
            form of these Rules or in another form altogether.
          </p>

          <p class="help-section-title font-weight-bold mt-4">
            {{getCreateRulesResource.helpSection.helpText.section3.label}}
          </p>
          <ul class="bulleted-list mt-4">
            <li
              v-for="(item, index) in getCreateRulesResource.helpSection.helpText.section3.items"
              class="mt-2"
              :key="index"
              v-html="item"
            />
          </ul>

          <p class="mt-4">
            Before choosing to use the
            <a :href="getCreateRulesResource.helpSection.helpText.section3.href" target="_blank">Schedule B</a>
            Form of Rules, please review them carefully to decide whether they work for the Cooperative Association.
          </p>

          <!-- help section 4 -->
          <p id="help-text-section-4"
            v-for="(item, index) in getCreateRulesResource.helpSection.helpText.section4.items"
            class="mt-4"
            :key="index"
            v-html="item"
          />

          <u class="help-btn" @click="helpToggle = !helpToggle"><small>Hide Help</small></u>
        </section>
      </v-expand-transition>
    </div>

    <!-- Confirm Rules Completion -->
    <section id="confirm-rules-section" class="mt-10">
      <header id="rules-confirm-header">
        <h2>2. Confirm Rules Completion</h2>
      </header>

      <div class="mt-4" :class="{ 'invalid-section': getShowErrors && !hasRulesConfirmed }">
        <v-card flat id="confirm-rules-card" class="py-8 px-6">
          <v-form ref="confirmRulesChk">
            <v-checkbox
              id="chk-confirm-rules"
              class="chk-rules mt-0 pt-0"
              v-model="rulesConfirmed"
              hide-details
              :rules="confirmCompletionRules"
              label="I confirm the following items are included as required in the Rules of the Association:"
              @change="onRulesConfirmedChange($event)"
            />
            <ul>
              <li class="mt-4">
                <v-row no-gutters>
                  <v-col cols="1"><v-icon>mdi-circle-small</v-icon></v-col>
                  <v-col cols="11">
                    <p class="mb-0">
                      The Cooperative name is identified <b>exactly</b> as follows throughout
                      the Rules of the Association:
                    </p>
                    <div class="mt-2 mb-0 font-weight-bold">{{getNameRequestDetails.approvedName}}</div>
                  </v-col>
                </v-row>
              </li>
            </ul>
          </v-form>
        </v-card>
      </div>
    </section>

    <!-- Upload Rules -->
    <section id="upload-rules-section" class="mt-10">
      <header id="upload-rules-header">
        <h2>3. Upload Rules</h2>
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
        <div id="upload-rules-note" class="mt-6">
          <b>Note: </b>Do not upload Housing Cooperative occupancy agreements.
        </div>
      </header>

      <div class="mt-4" :class="{ 'invalid-section': getShowErrors && !hasValidUploadFile }">
        <v-card flat id="upload-rules-card" class="py-8 px-6">
          <v-row no-gutters>
            <v-col cols="12" sm="3" class="pr-4">
              <label class="upload-rules-vcard-title">Upload Rules</label>
            </v-col>
            <v-col cols="12" sm="9" class="pt-4 pt-sm-0">
              <FileUploadPreview
                :inputFileLabel="INPUT_FILE_LABEL"
                :maxSize="MAX_FILE_SIZE"
                :pdfPageSize="PdfPageSize.LETTER_SIZE"
                :inputFile="uploadRulesDoc"
                :showErrors="getShowErrors"
                :customErrorMessage="fileUploadCustomErrorMsg"
                @fileSelected="fileSelected($event)"
                @isFileValid="isFileUploadValidFn($event)"
              />
            </v-col>
          </v-row>
        </v-card>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import {
  ActionBindingIF,
  CreateRulesIF,
  CreateRulesResourceIF,
  DocumentUpload,
  NameRequestDetailsIF,
  FormIF,
  ValidationDetailIF
} from '@/interfaces'
import { RouteNames, ItemTypes, PdfPageSize } from '@/enums'
import { CommonMixin, DocumentMixin } from '@/mixins'
import FileUploadPreview from '@/components/common/FileUploadPreview.vue'

@Component({
  components: {
    FileUploadPreview
  }
})
export default class UploadRules extends Mixins(CommonMixin, DocumentMixin) {
  // Refs
  $refs!: {
    confirmRulesChk: FormIF
  }

  readonly INPUT_FILE_LABEL = 'Rules of Association'
  protected hasValidUploadFile = false
  protected hasRulesConfirmed = false
  protected rulesConfirmed = false
  protected fileUploadCustomErrorMsg = ''
  protected uploadRulesDoc = null as File
  protected uploadRulesDocKey = null as string
  protected helpToggle = false

  @Getter getShowErrors!: boolean
  @Getter getNameRequestDetails!: NameRequestDetailsIF
  @Getter getCreateRulesResource!: CreateRulesResourceIF
  @Getter getCreateRulesStep!: CreateRulesIF
  @Getter getUserKeycloakGuid!: string

  @Action setRules!: ActionBindingIF
  @Action setRulesStepValidity!: ActionBindingIF

  // Enum for template
  readonly RouteNames = RouteNames
  readonly ItemTypes = ItemTypes
  readonly PdfPageSize = PdfPageSize

  readonly confirmCompletionRules = [
    (v) => { return !!v }
  ]

  private setUploadRulesDoc (doc: File) {
    this.uploadRulesDoc = doc
    this.uploadRulesDocKey = null
  }

  protected isFileUploadValidFn (val) {
    this.hasValidUploadFile = val
    this.updateRulesStepValidity()
  }

  protected async fileSelected (file) {
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
      // NB: will throw if API error
      const doc: DocumentUpload = await this.getPresignedUrl(this.uploadRulesDoc.name)

      // NB: will return error response if API error
      const res = await this.uploadToUrl(doc.preSignedUrl, this.uploadRulesDoc, doc.key, this.getUserKeycloakGuid)

      if (res && res.status === 200) {
        const rulesDoc = {
          name: this.uploadRulesDoc.name,
          lastModified: this.uploadRulesDoc.lastModified,
          size: this.uploadRulesDoc.size
        }
        this.setRules({
          ...this.getCreateRulesStep,
          rulesDoc,
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

  protected onRulesConfirmedChange (rulesConfirmed: boolean): void {
    this.hasRulesConfirmed = rulesConfirmed
    this.updateRulesStepValidity()
    this.setRules({
      ...this.getCreateRulesStep,
      rulesConfirmed
    })
  }

  /** Called when component is created. */
  protected created (): void {
    this.uploadRulesDoc = this.getCreateRulesStep.rulesDoc as File
    this.uploadRulesDocKey = this.getCreateRulesStep.docKey
    this.rulesConfirmed = this.getCreateRulesStep.rulesConfirmed
    this.hasValidUploadFile = !!this.uploadRulesDocKey
    this.hasRulesConfirmed = this.rulesConfirmed
  }

  protected async mounted (): Promise<void> {
    // wait for components to load/stabilize then update validation state in store
    await this.$nextTick()
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
    padding-top: 0.5rem;
  }
}

ul {
  list-style: none;
  color: $gray7;
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
  // override default validation styling so checkbox does not turn red on validation error
  .v-input--selection-controls__input .error--text{
    color: $app-lt-gray !important;
  }
}

.chk-rules {
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

#upload-rules-section {
  #upload-rules-note {
    font-size: $px-16;
  }
}

.upload-rules-vcard-title {
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
</style>
