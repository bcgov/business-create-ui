<template>

  <div id="upload-rules">

    <section class="mt-10">
      <header>
        <h2>1. Rules of the Association</h2>
        <p>Before submitting your incorporation application you must <b>complete, sign, and date</b> the
          <v-tooltip top max-width="20rem" color="primary" content-class="top-tooltip">
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
      <header>
        <h2>2. Confirm Rules Completion</h2>
      </header>
      <v-card flat id="confirm-rules-card">
        <v-checkbox
          class="chk-rules"
          id="chk-confirm-rules"
          v-model="rulesConfirmed"
          label="I confirm the following items are included as required in the Rules of the Association:"
          @change="onRulesConfirmedChange()"
        />
        <ul>
          <li>The Cooperative name is identified <b>exactly</b> as follows throughout the Memorandum:</li>
          <p><b>{{getNameRequestDetails.approvedName}}</b></p>
          <li>Each Subscriber and Witness has signed and dated the Rules of the Association and their name is
            printed under their signature.</li>
        </ul>
      </v-card>
    </section>

    <section id="upload-rules-section" class="mt-10">
      <header>
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
      <v-card flat id="upload-rules-card">
        <v-row>
          <v-col id="upload-rules-card-left-col" cols="2">
            <v-card-title class="upload-rules-vcard-title">Upload Rules</v-card-title>
          </v-col>
          <v-col id="upload-rules-card-right-col" cols="10">
            <FileUploadPreview
              :maxSize="MAX_FILE_SIZE"
              :inputFile="uploadRulesDoc"
              @fileSelected="fileSelected"
              @isFileValid="isFileUploadValidFn"
            ></FileUploadPreview>
          </v-col>
        </v-row>
      </v-card>
    </section>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Mixins, Prop, Vue } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'

// Interfaces
import {
  ActionBindingIF,
  CreateRulesIF,
  CreateRulesResourceIF,
  RulesDocIF,
  DocumentUpload,
  NameRequestDetailsIF
} from '@/interfaces'

// Enums
import { RouteNames, ItemTypes } from '@/enums'

// Mixins
import { DocumentMixin } from '@/mixins'

// Components
import FileUploadPreview from '@/components/common/FileUploadPreview.vue'

@Component({
  components: {
    FileUploadPreview
  }
})
export default class UploadRules extends Mixins(DocumentMixin) {
  private MAX_FILE_SIZE = 10 * 1024 // 10 MB in KB
  private isFileUploadValid: boolean = false
  private uploadRulesDoc:File = null
  private helpToggle = false
  private rulesConfirmed: boolean = false
  private docKey: string
  private userKeycloakGuid: string

  @Getter getNameRequestDetails!: NameRequestDetailsIF
  @Getter getCreateRulesResource!: CreateRulesResourceIF
  @Getter getCreateRulesStep!: CreateRulesIF
  @Getter getValidateSteps!: boolean
  @Getter getUserKeycloakGuid!: string

  @Action setRulesConfirmed!: ActionBindingIF
  @Action setRulesDoc!: ActionBindingIF
  @Action setRulesDocKey!: ActionBindingIF

  // Enum for template
  readonly RouteNames = RouteNames
  readonly ItemTypes = ItemTypes

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
    this.setRulesDoc(rulesDoc)
    this.updateDocKey(null)
  }

  private isFileUploadValidFn (val) {
    this.isFileUploadValid = val
  }

  private async fileSelected (file) {
    if (file && this.isFileUploadValid) {
      this.setUploadRulesDoc(file)
      await this.uploadPendingDocsToStorage()
    } else {
      this.setUploadRulesDoc(null)
      this.updateDocKey(null)
    }
  }

  private updateDocKey (key) {
    this.docKey = key
    this.setRulesDocKey(key)
  }

  public async uploadPendingDocsToStorage () {
    const isPendingUpload = !this.docKey
    if (isPendingUpload && this.isFileUploadValid) {
      const doc:DocumentUpload = await this.getPresignedUrl(this.uploadRulesDoc.name)
      this.updateDocKey(doc.key)
      const res = await this.uploadToUrl(doc.preSignedUrl, this.uploadRulesDoc, doc.key, this.userKeycloakGuid)
    }
  }

  private onRulesConfirmedChange (): void {
    this.setRulesConfirmed(this.rulesConfirmed.valueOf())
  }

  /** Called when component is created. */
  private created (): void {
    this.rulesConfirmed = this.getCreateRulesStep.rulesConfirmed
    this.docKey = this.getCreateRulesStep.docKey
    this.uploadRulesDoc = this.getCreateRulesStep.rulesDoc as File
    this.userKeycloakGuid = this.getUserKeycloakGuid
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';
header {
  p {
    padding-top:0.5rem
  }
}

ul {
  margin-left: 25px !important;
  padding-left: 25px !important;
}

li {
  margin-top: 15px !important;
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

#confirm-rules-section {
  #confirm-rules-card {
    margin-top: 15px;
    padding-top: 5px;
    padding-bottom: 20px;
    padding-left: 25px;
  }
}

.chk-rules {
  height: 2.5rem !important;
}

#upload-rules-section {
  li {
    margin-top: 15px !important;
  }

  #upload-rules-note {
    font-size: 16px;
    margin-top: 30px;
    margin-bottom: 30px;
  }

  #upload-rules-card {
    #upload-rules-card-left-col {
      padding-top:25px;
    }

    #upload-rules-card-right-col {
      padding-top:25px;
      padding-left:25px;
      padding-right:30px;
    }
  }
}

.upload-rules-vcard-title {
  padding-top:1px;
  font-size: 17px;
  font-weight:bold;
}

.v-icon.mdi-help-circle-outline,
.v-icon.mdi-information-outline,
.v-icon.mdi-open-in-new,
.v-icon.mdi-circle-small {
  margin-top: -2px;
}

.v-icon.mdi-open-in-new {
  padding-bottom:1px;
}
</style>
