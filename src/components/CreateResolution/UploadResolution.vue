<template>
  <div id="upload-resolution">
    <section class="mt-10">
      <header>
        <h2>{{getCreateResolutionResource.introSection.header}}</h2>
        <p>
            <span v-for="(partialItem, index) in getCreateResolutionResource.introSection.items" :key="index">
              <span v-if="partialItem.type === ItemTypes.TEXT" v-html="partialItem.value"></span>
              <v-tooltip v-if="partialItem.type === ItemTypes.TOOL_TIP"
                 top max-width="20rem"
                 content-class="top-tooltip">
                  <template v-slot:activator="{ on }">
                    <span v-on="on" class="tool-tip dotted-underline"> {{partialItem.value.label}} </span>
                  </template>
                  <span>
                    {{partialItem.value.text}}
                  </span>
              </v-tooltip>
            </span>
        </p>
      </header>
    </section>

    <!-- Help Section -->
    <div v-if="getCreateResolutionResource.helpSection" class="mt-5">
      <span class="help-btn" @click="helpToggle = !helpToggle">
        <v-icon color="primary" style="padding-right: 5px">mdi-help-circle-outline</v-icon>
        <span v-if="!helpToggle">{{ getCreateResolutionResource.helpSection.header }}</span>
        <span v-else>Hide Help</span>
      </span>
      <section v-show="helpToggle" class="create-resolution-help">
        <header class="create-resolution-help-header">
          <h2>{{getCreateResolutionResource.helpSection.header}}</h2>
        </header>
        <p class="help-section-label mt-4">
          {{getCreateResolutionResource.helpSection.helpText.section1.label}}
        </p>
        <span v-for="(item, index) in getCreateResolutionResource.helpSection.helpText.section1.items" :key="index">
          <p v-if="item.type === ItemTypes.TEXT" v-html="item.value" class="mt-3"></p>
          <ul v-if="item.type === ItemTypes.BULLET_LIST" class="mt-1">
            <li v-for="(bulletItem, index) in item.value" :key="index">
              <v-row class="mt-1">
                <v-col v-if="item.bulletListType === BulletListTypes.CIRCLE_SMALL" cols="1" class="pt-1 pb-1">
                  <v-icon>mdi-circle-small</v-icon>
                </v-col>
                <v-col v-if="item.bulletListType === BulletListTypes.ALPHABETICAL_LOWER" cols="1" class="pt-1 pb-1">
                  ({{convertIntToChar(index)}})
                </v-col>
                <v-col cols="11" class="ml-n11 pt-1 pb-1">
                  <span>{{bulletItem}}</span>
                </v-col>
              </v-row>
            </li>
          </ul>
        </span>
        <u class="help-btn" @click="helpToggle = !helpToggle"><small>Hide Help</small></u>
      </section>
    </div>

    <section id="sample-resolution-section" v-if="entityFilter(CorpTypeCd.COOP)" class="mt-10">
      <header id="sample-resolution-header">
        <h2>{{getCreateResolutionResource.sampleFormSection.header}}</h2>
      </header>
      <p class="mt-2">
        {{getCreateResolutionResource.sampleFormSection.text}}
      </p>
      <v-card flat id="sample-resolution-card" class="pt-7 pb-5 pl-6">
        <v-row>
          <v-col id="sample-resolution-card-left-col" cols="1" class="pt-6" >
          </v-col>
          <v-col id="sample-resolution-card-center-col" cols="3" class="pl-8 pt-6">
            <div>
              <!-- Note: only able to resolve to preview image in assets folder properly when implemented this way. -->
              <img :src="require(`@/assets/images/${getCreateResolutionResource.sampleFormSection.previewImagePath}`)"
                   class="preview-image" />
            </div>
          </v-col>
          <v-col id="sample-resolution-card-right-col" cols="6" class="pt-6 pr-15">
            <div class="download-link-container ml-1 pt-5 pb-5">
              <v-icon color="primary" class="mt-n1">mdi-file-pdf-outline</v-icon>
              <a :href="documentURL" download class="mt-2">
                {{getCreateResolutionResource.sampleFormSection.downloadDocLabel}}
              </a>
            </div>
          </v-col>
          <v-col cols="2" class="pt-6"></v-col>
        </v-row>
      </v-card>
    </section>

    <section id="confirm-resolution-section" class="mt-10">
      <header id="resolution-confirm-header">
        <h2>{{getCreateResolutionResource.confirmSection.header}}</h2>
      </header>
      <div :class="{ 'invalid-section': getShowErrors && !hasResolutionConfirmed }">
        <v-card flat id="confirm-resolution-card" class="mt-4 pt-10 pb-8 pl-6 pr-9">
          <v-form ref="confirmResolutionChk">
            <v-checkbox
              class="chk-resolution"
              id="chk-confirm-resolution"
              v-model="resolutionConfirmed"
              :rules="confirmCompletionResolution"
              @change="onResolutionConfirmedChange($event)"
            >
              <div slot='label' v-html="confirmLabel"></div>
            </v-checkbox>
            <ul>
              <li class="mt-1"
                v-for="(item, index) in getCreateResolutionResource.confirmSection.items"
                :key="index">
                <v-row v-if="item.type === ItemTypes.PARTIAL_ITEMS">
                  <v-col cols="1" class="pt-1"><v-icon>mdi-circle-small</v-icon></v-col>
                  <v-col cols="11" class="ml-n12 pt-1 pb-1">
                    <span v-for="(partialItem, index) in item.value" :key="index">
                      <span v-if="partialItem.type === ItemTypes.TEXT" v-html="partialItem.value"></span>
                      <span v-if="partialItem.type === ItemTypes.PLACEHOLDER
                                && partialItem.value === PLACEHOLDER_LEGAL_NAME_INLINE">
                        {{getBusinessLegalName}}
                      </span>
                      <div v-if="partialItem.type === ItemTypes.PLACEHOLDER
                                && partialItem.value === PLACEHOLDER_LEGAL_NAME">
                        <strong>{{getBusinessLegalName}}</strong>
                      </div>
                    </span>
                  </v-col>
                </v-row>
              </li>
            </ul>
          </v-form>
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
  CreateResolutionIF,
  CreateResolutionResourceIF,
  FormIF,
  NameRequestDetailsIF,
  ValidationDetailIF
} from '@/interfaces'

// Enums
import { BulletListTypes, CorpTypeCd, ItemTypes, RouteNames } from '@/enums'

// Mixins
import { CommonMixin, EntityFilterMixin } from '@/mixins'

@Component({})
export default class UploadResolution extends Mixins(CommonMixin, EntityFilterMixin) {
  // Refs
  $refs!: {
    confirmResolutionChk: FormIF
  }

  private hasResolutionConfirmed = false
  private resolutionConfirmed = false
  private helpToggle = false
  private PLACEHOLDER_LEGAL_NAME = 'legal_name'
  private PLACEHOLDER_LEGAL_NAME_INLINE = 'legal_name_inline'

  @Getter getShowErrors!: boolean
  @Getter getNameRequestDetails!: NameRequestDetailsIF
  @Getter getCreateResolutionResource!: CreateResolutionResourceIF
  @Getter getCreateResolutionStep!: CreateResolutionIF
  @Getter getValidateSteps!: boolean
  @Getter getBusinessLegalName!: string

  @Action setResolution!: ActionBindingIF
  @Action setResolutionStepValidity!: ActionBindingIF

  // Enum for template
  readonly RouteNames = RouteNames
  readonly ItemTypes = ItemTypes
  readonly CorpTypeCd = CorpTypeCd
  readonly BulletListTypes = BulletListTypes

  private get documentURL ():string {
    const docUrl = sessionStorage.getItem('BASE_URL') +
      this.getCreateResolutionResource.sampleFormSection.downloadDocPath
    return docUrl
  }

  private get confirmLabel ():string {
    const confirmTextItems = this.getCreateResolutionResource.confirmSection.text
    const result = confirmTextItems.map(item => {
      if (item.type === ItemTypes.PLACEHOLDER && item.value === this.PLACEHOLDER_LEGAL_NAME) {
        return `<strong>${this.getBusinessLegalName}</strong>`
      }
      return item.value
    }).join(' ')
    return result
  }

  private confirmCompletionResolution = [
    (v) => { return !!v }
  ]

  private updateResolutionStepValidity () {
    const validationDetail:ValidationDetailIF =
      {
        valid: this.hasResolutionConfirmed,
        validationItemDetails: [
          {
            name: 'hasResolutionConfirmed',
            valid: this.hasResolutionConfirmed,
            elementId: 'resolution-confirm-header'
          }
        ]
      }
    this.setResolutionStepValidity(validationDetail)
  }

  private onResolutionConfirmedChange (resolutionConfirmed: boolean): void {
    this.hasResolutionConfirmed = resolutionConfirmed
    this.updateResolutionStepValidity()
    this.setResolution({
      ...this.getCreateResolutionStep,
      resolutionConfirmed: resolutionConfirmed
    })
  }

  /** Called when component is created. */
  private created (): void {
    this.resolutionConfirmed = !!this.getCreateResolutionStep.resolutionConfirmed
    this.hasResolutionConfirmed = this.resolutionConfirmed
    this.updateResolutionStepValidity()
  }

  @Watch('getShowErrors')
  private onShowErrorsChanged (): void {
    if (this.getShowErrors && this.$refs.confirmResolutionChk) {
      this.$refs.confirmResolutionChk.validate()
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

.upload-resolution-summary-header {
  display: flex;
  background-color: $BCgovBlue5O;
  padding: 1.25rem;

  .upload-resolution-title {
    color: $gray9;
  }
}

.upload-resolution-error-message {
  padding-top: 1.25rem;
  padding-left: 1.25rem;
  color: $app-blue;
}

.help-btn {
  cursor: pointer;
  color: $app-blue;
  vertical-align: middle;
}

.create-resolution-help {
  margin: 2rem 0;
  border-top: 1px dashed $gray6;
  border-bottom: 1px dashed $gray6;
  padding: 1rem 0;

  .create-resolution-help-header {
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

::v-deep #confirm-resolution-section {
  #approved-name {
    font-weight: bold;
  }

  // override default validation styling so checkbox does not turn red on validation error
  .v-input--selection-controls__input .error--text {
    color: $app-lt-gray !important;
  }
}

.chk-resolution {
  margin-top: 0;
  padding-top: 0;
  height: 2.5rem !important;
}

.upload-resolution-vcard-title {
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

#sample-resolution-section {
  a {
    text-decoration: none;
  }
}

::v-deep #confirm-resolution-section .v-input__slot {
  align-items: unset !important;

  label div {
    padding-top: 2px;
  }
}
</style>
