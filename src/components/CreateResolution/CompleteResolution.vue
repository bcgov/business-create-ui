<template>
  <div id="complete-resolution">
    <section id="resolution-intro-section" class="mt-10">
      <header>
        <h2>{{getCreateResolutionResource.introSection.header}}</h2>
        <p class="section-description">
            <span v-for="(partialItem, index) in getCreateResolutionResource.introSection.items" :key="index">
              <span v-if="partialItem.type === ItemTypes.TEXT" v-html="partialItem.value"></span>
              <v-tooltip v-if="partialItem.type === ItemTypes.TOOLTIP"
                 top max-width="15rem"
                 content-class="top-tooltip"
                 transition="fade-transition">
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
        <span v-for="(item, index) in getCreateResolutionResource.helpSection.helpText.section1.items" :key="index">
          <p v-if="item.type === ItemTypes.TEXT" v-html="item.value" class="mt-3"></p>
          <v-row v-if="item.type === ItemTypes.PARTIAL_ITEMS">
            <v-col cols="11">
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
      <p class="section-description mt-2" v-html="getCreateResolutionResource.sampleFormSection.text"></p>
      <v-card flat id="sample-resolution-card" class="pt-7 pb-5 pl-6">
        <v-row>
          <v-col id="sample-resolution-card-left-col" cols="1" class="pt-6" >
          </v-col>
          <v-col id="sample-resolution-card-center-col" cols="3" class="pl-8 pt-6">
            <img :src="previewImageSource()" class="preview-image" />
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

    <section id="resolution-date-section" v-if="entityFilter(CorpTypeCd.COOP)" class="mt-10">
      <header id="resolution-date-header">
        <h2>{{getCreateResolutionResource.resolutionDateSection.header}}</h2>
      </header>
      <p class="section-description mt-2">
        {{getCreateResolutionResource.resolutionDateSection.description}}
      </p>
      <div :class="{ 'invalid-section': getShowErrors && !this.isResolutionDateValid }">
        <v-card flat id="resolution-date-card" class="pt-7 pb-5 pl-6 pr-6">
          <v-row>
            <v-col id="resolution-date-card-left-col" cols="2" class="pt-6" >
              <v-card-title class="resolution-date-vcard-title pl-1 pr-0">
                Resolution Date
              </v-card-title>
            </v-col>
            <v-col id="resolution-date-card-right-col" cols="10" class="pt-6 pl-6 pr-5">
              <date-picker
                ref="resolutionDatePickerRef"
                title="Resolution Date"
                :nudgeRight="40"
                :nudgeTop="85"
                :initialValue="resolutionDateText"
                :minDate="resolutionDateMinStr"
                :maxDate="resolutionDateMaxStr"
                :inputRules="resolutionDateRules"
                @emitDateSync="onResolutionDateSync"
              />
            </v-col>
          </v-row>
        </v-card>
      </div>
    </section>

    <section id="resolution-text-section" v-if="entityFilter(CorpTypeCd.COOP)" class="mt-10">
      <header id="resolution-text-header">
        <h2>{{getCreateResolutionResource.resolutionTextSection.header}}</h2>
      </header>
      <p class="section-description mt-2">
        {{getCreateResolutionResource.resolutionTextSection.description}}
      </p>
      <div :class="{ 'invalid-section': getShowErrors && !this.isResolutionTextValid }">
        <div>
          <v-card flat id="resolution-text-card" class="pt-7 pb-5 pl-6 pr-6">
            <v-row>
              <v-col id="resolution-text-card-left-col" cols="2" class="pt-6" >
                <v-card-title class="resolution-text-vcard-title pl-1 pr-0">
                  {{getCreateResolutionResource.resolutionTextSection.textLabel}}
                </v-card-title>
              </v-col>
              <v-col id="resolution-text-card-right-col" cols="10" class="pt-6 pl-6 pr-5">
                <v-form ref="resolutionTextFormRef">
                  <v-textarea ref="resolutionTextRef"
                              auto-grow
                              filled
                              :label="getCreateResolutionResource.resolutionTextSection.textPlaceholder"
                              rows="6"
                              :counter="MAX_RESOLUTION_TEXT_LENGTH"
                              v-model="resolutionText"
                              :rules="resolutionTextRules"
                              @change="onResolutionTextChanged"
                              v-observe-visibility="{ callback: onResolutionVisibilityChanged, once: true }"
                  />
                </v-form>
              </v-col>
            </v-row>
          </v-card>
        </div>
      </div>
    </section>

    <section id="resolution-signature-info-section" v-if="entityFilter(CorpTypeCd.COOP)" class="mt-10">
      <header id="resolution-signature-info-header">
        <h2>{{getCreateResolutionResource.resolutionSignatureSection.header}}</h2>
      </header>
      <p class="section-description mt-2">
        {{getCreateResolutionResource.resolutionSignatureSection.description}}
      </p>
      <div :class="{ 'invalid-section': getShowErrors && (!this.isSigningPersonValid || !this.isSigningDateValid) }">
        <v-card flat id="resolution-signature-card" class="pt-7 pb-5 pl-6 pr-8">
          <v-row no-gutters>
            <v-col id="resolution-signature-card-left-col" cols="2" class="pt-7" >
              <v-card-title class="resolution-signature-vcard-title pl-2 pr-0">
                Signing Party
              </v-card-title>
            </v-col>
            <v-col id="resolution-signature-card-right-col" cols="10" class="pt-6 pl-6">
              <v-form ref="signingPersonFormRef">
                <div class="form__row three-column">
                  <v-text-field
                    ref="signingPersonGivenNameRef"
                    filled
                    class="item"
                    label="First Name"
                    id="person__first-name"
                    v-model="signingPerson.givenName"
                    :rules="Rules.FirstNameRules"
                  />
                  <v-text-field
                    ref="signingPersonMiddleNameRef"
                    filled
                    class="item"
                    label="Middle Name (Optional)"
                    id="person__middle-name"
                    v-model="signingPerson.additionalName"
                    :rules="Rules.MiddleNameRules"
                  />
                  <v-text-field
                    ref="signingPersonFamilyNameRef"
                    filled
                    class="item"
                    label="Last Name"
                    id="person__last-name"
                    v-model="signingPerson.familyName"
                    :rules="Rules.LastNameRules"
                    />
                </div>
              </v-form>
            </v-col>
          </v-row>
          <v-row no-gutters class="mt-0">
            <v-col id="resolution-signature-card-left-col" cols="2" class="pt-6" >
              <v-card-title class="resolution-signature-vcard-title pl-2 pr-0">
                Date Signed
              </v-card-title>
            </v-col>
            <v-col id="resolution-signature-card-right-col" cols="10" class="pt-4 pl-6">
              <date-picker
                ref="signatureDatePickerRef"
                title="Date Signed"
                :nudgeRight="40"
                :nudgeTop="85"
                :initialValue="signatureDateText"
                :minDate="signatureDateMinStr"
                :maxDate="signatureDateMaxStr"
                :inputRules="signatureDateRules"
                @emitDateSync="onSigningDateSync"
              />
            </v-col>
          </v-row>
        </v-card>
      </div>
    </section>

    <section id="confirm-resolution-section" class="mt-10">
      <header id="resolution-confirm-header">
        <h2>{{getCreateResolutionResource.confirmSection.header}}</h2>
      </header>
      <div :class="{ 'invalid-section': getShowErrors && !isConfirmResolutionValid }">
        <v-card flat id="confirm-resolution-card" class="mt-4 pt-10 pb-8 pl-6 pr-9">
          <v-form ref="confirmResolutionChkFormRef">
            <v-checkbox
              ref="confirmResolutionChkRef"
              class="chk-resolution ml-1"
              id="chk-confirm-resolution"
              v-model="resolutionConfirmed"
              :rules="confirmCompletionResolution"
              @change="onResolutionConfirmedChange($event)"
            >
              <div slot="label" v-html="confirmLabel"></div>
            </v-checkbox>
            <ul>
              <li class="mt-1"
                v-for="(item, index) in getCreateResolutionResource.confirmSection.items"
                :key="index">
                <v-row v-if="item.type === ItemTypes.TEXT" no-gutters>
                  <v-col cols="auto" class="pt-1 mr-2"><v-icon>mdi-circle-small</v-icon></v-col>
                  <v-col cols="11" class="pt-1 pb-1" no-gutters>
                    {{item.value}}
                  </v-col>
                </v-row>
                <v-row v-if="item.type === ItemTypes.PARTIAL_ITEMS" no-gutters>
                  <v-col cols="auto" class="pt-1 mr-2"><v-icon>mdi-circle-small</v-icon></v-col>
                  <v-col cols="11" class="pt-1 pb-1" no-gutters>
                    <span v-for="(partialItem, index) in item.value" :key="index">
                      <span v-if="partialItem.type === ItemTypes.TEXT" v-html="partialItem.value"></span>
                      <span v-if="partialItem.type === ItemTypes.PLACEHOLDER &&
                                  partialItem.value === PLACEHOLDER_LEGAL_NAME_INLINE">
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
import { Component, Mixins, Watch, Vue } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'

// Shared Components
import { DatePicker } from '@bcrs-shared-components/date-picker'

// Interfaces
import {
  ActionBindingIF,
  CreateResolutionIF,
  CreateResolutionResourceIF,
  FormIF,
  NameRequestDetailsIF,
  ValidationDetailIF,
  PersonIF,
  EmptyPerson
} from '@/interfaces'

// Enums
import { BulletListTypes, CorpTypeCd, ItemTypes, RouteNames } from '@/enums'

// Mixins
import { CommonMixin, DateMixin, EntityFilterMixin } from '@/mixins'

// Validation
import { Rules, RuleHelpers } from '@/rules'

@Component({
  components: {
    DatePicker
  }
})
export default class CompleteResolution extends Mixins(CommonMixin, DateMixin, EntityFilterMixin) {
  // Refs
  $refs!: {
    resolutionDatePickerRef: DatePicker,
    resolutionTextFormRef: FormIF,
    resolutionTextRef: FormIF,
    signatureDatePickerRef: DatePicker,
    signingPersonFormRef: FormIF,
    signingPersonGivenNameRef: FormIF,
    signingPersonMiddleNameRef: FormIF,
    signingPersonFamilyNameRef: FormIF,
    confirmResolutionChkFormRef: FormIF,
    confirmResolutionChkRef: FormIF
  }

  private MAX_RESOLUTION_TEXT_LENGTH: number = 1000
  private resolutionText: string = ''
  private resolutionConfirmed = false
  private helpToggle = false
  private PLACEHOLDER_LEGAL_NAME = 'legal_name'
  private PLACEHOLDER_LEGAL_NAME_INLINE = 'legal_name_inline'
  private signingPerson: PersonIF = null

  // Date properties
  private resolutionDateText: string = ''
  private signatureDateText: string = ''
  private foundingDate: Date = null

  @Getter getShowErrors!: boolean
  @Getter isTypeCoop!: boolean
  @Getter getNameRequestDetails!: NameRequestDetailsIF
  @Getter getCreateResolutionResource!: CreateResolutionResourceIF
  @Getter getCreateResolutionStep!: CreateResolutionIF
  @Getter getValidateSteps!: boolean
  @Getter getBusinessLegalName!: string
  @Getter getBusinessFoundingDate!: string

  @Action setResolution!: ActionBindingIF
  @Action setResolutionStepValidationDetail!: ActionBindingIF

  // Enum for template
  readonly RouteNames = RouteNames
  readonly ItemTypes = ItemTypes
  readonly CorpTypeCd = CorpTypeCd
  readonly BulletListTypes = BulletListTypes

  // Validation Rules
  readonly Rules = Rules

  private get documentURL (): string {
    const docUrl = sessionStorage.getItem('BASE_URL') +
      this.getCreateResolutionResource.sampleFormSection.downloadDocPath
    return docUrl
  }

  private previewImageSource (): string {
    // Note: the image file path did not resolve correctly when using the require function directly.  In order
    // to get the image path resolving correctly, needed to get the image context first and use that to build
    // the final image file path

    if (this.isJestRunning) { return '' }
    const images = require.context('@/assets/images/', false, /\.png$/)
    return images('./' + this.getCreateResolutionResource.sampleFormSection.previewImagePath)
  }

  private get confirmLabel (): string {
    const confirmTextItems = this.getCreateResolutionResource.confirmSection.text
    const result = confirmTextItems.map(item => {
      if (item.type === ItemTypes.PLACEHOLDER && item.value === this.PLACEHOLDER_LEGAL_NAME) {
        return `<strong>${this.getBusinessLegalName}</strong>`
      }
      return item.value
    }).join(' ')
    return result
  }

  /** Validations rules for resolution date field. */
  get resolutionDateRules (): Array<Function> {
    return [
      (v: string) => !!v || 'Resolution date is required',
      (v: string) =>
        RuleHelpers.DateRuleHelpers
          .isBetweenDates(this.resolutionDateMin,
            this.resolutionDateMax,
            this.yyyyMmDdToDate(v)) ||
          `Date should be between ${this.resolutionDateMinStr} (incorporation date) and ${this.resolutionDateMaxStr}`
    ]
  }

  /** Validations rules for signing date field. */
  get signatureDateRules (): Array<Function> {
    return [
      (v: string) => !!v || 'Signature date is required',
      (v: string) =>
        RuleHelpers.DateRuleHelpers
          .isBetweenDates(this.signatureDateMin,
            this.signatureDateMax,
            this.yyyyMmDdToDate(v)) ||
          `Date should be between ${this.signatureDateMinStr} and ${this.signatureDateMaxStr}`
    ]
  }

  private validateIsBetweenDates (minDate: Date, maxDate: Date, dateToValidate: Date): boolean {
    if (!dateToValidate) { return true }
    if (dateToValidate >= minDate && dateToValidate <= maxDate) { return true }
    return false
  }

  /** The minimum date that can be entered (can't be earlier than incorporation date ). */
  private get resolutionDateMinStr (): string {
    return this.dateToYyyyMmDd(this.foundingDate)
  }

  /** The minimum date that can be entered (can't be earlier than incorporation date ). */
  private get resolutionDateMin (): Date {
    return this.foundingDate
  }

  /** The maximum date that can be entered (today). */
  private get resolutionDateMaxStr (): string {
    const date = new Date()
    return this.dateToYyyyMmDd(date)
  }

  /** The maximum date that can be entered (today). */
  private get resolutionDateMax (): Date {
    const date = new Date()
    return date
  }

  /** The minimum date that can be entered (resolution date). */
  private get signatureDateMinStr (): string {
    const date = this.signatureDateMin
    const result = this.dateToYyyyMmDd(date)
    return result
  }

  /** The minimum date that can be entered (resolution date). */
  private get signatureDateMin (): Date {
    if (this.resolutionDateText) {
      const resolutionDate = this.yyyyMmDdToDate(this.resolutionDateText)
      return resolutionDate
    }
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    return date
  }

  /** The maximum date that can be entered (today). */
  private get signatureDateMaxStr (): string {
    const date = this.signatureDateMax
    const dateStr = this.dateToYyyyMmDd(date)
    return dateStr
  }

  /** The maximum date that can be entered (today). */
  private get signatureDateMax (): Date {
    const date = new Date()
    return date
  }

  private get resolutionTextRules (): Array<Function> {
    return [
      v => (v && v.trim().length > 0) || 'Resolution text is required',
      v => (v && v.length <= this.MAX_RESOLUTION_TEXT_LENGTH) || 'Maximum characters exceeded',
      Rules.CommonRules.ALPHA_NUMERIC_AND_STANDARD_SPECIAL_CHARS
    ]
  }

  private confirmCompletionResolution = [
    (v) => { return !!v }
  ]

  private get isResolutionDateValid (): boolean {
    return this.$refs.resolutionDatePickerRef.isDateValid()
  }

  private get isResolutionTextValid (): boolean {
    return this.$refs.resolutionTextRef.valid
  }

  private get isSigningDateValid (): boolean {
    return this.$refs.signatureDatePickerRef.isDateValid()
  }

  private get isSigningPersonValid (): boolean {
    return this.$refs.signingPersonGivenNameRef.valid &&
      this.$refs.signingPersonMiddleNameRef.valid &&
      this.$refs.signingPersonFamilyNameRef.valid
  }

  private get isConfirmResolutionValid (): boolean {
    return this.$refs.confirmResolutionChkRef.valid
  }

  private isResolutionValid (): boolean {
    if (this.isTypeCoop) {
      return this.$refs.resolutionTextRef.valid &&
        this.$refs.resolutionDatePickerRef.isDateValid() &&
        this.isSigningPersonValid &&
        this.$refs.signatureDatePickerRef.isDateValid() &&
        this.$refs.confirmResolutionChkRef.valid
    }
    return this.$refs.confirmResolutionChkRef.valid
  }

  private updateResolutionStepValidationDetail () {
    let validationDetail: ValidationDetailIF = null
    const resolutionIsValid = this.isResolutionValid()
    if (this.isTypeCoop) {
      validationDetail =
        {
          valid: resolutionIsValid,
          validationItemDetails: [
            {
              name: 'resolutionDateValid',
              valid: this.isResolutionDateValid,
              elementId: 'resolution-date-header'
            },
            {
              name: 'resolutionTextValid',
              valid: this.isResolutionTextValid,
              elementId: 'resolution-text-header'
            },
            {
              name: 'signingPersonValid',
              valid: this.isSigningPersonValid,
              elementId: 'resolution-signature-info-header'
            },
            {
              name: 'signingDateValid',
              valid: this.isSigningDateValid,
              elementId: 'resolution-signature-info-header'
            },
            {
              name: 'resolutionConfirmed',
              valid: this.isConfirmResolutionValid,
              elementId: 'resolution-confirm-header'
            }
          ]
        }
    } else {
      validationDetail =
        {
          valid: resolutionIsValid,
          validationItemDetails: [
            {
              name: 'resolutionConfirmed',
              valid: this.isConfirmResolutionValid,
              elementId: 'resolution-confirm-header'
            }
          ]
        }
    }
    this.setResolutionStepValidationDetail(validationDetail)
  }

  private async onResolutionConfirmedChange (resolutionConfirmed: boolean): Promise<void> {
    // This is required as there are timing issues between this component and the CompleteResolutionSummary
    // component.  The CompleteResolutionSummary isn't always able to detect that the confirm checkbox
    // value has changed without using Vue.nextTick()
    await Vue.nextTick()
    this.setResolution({
      ...this.getCreateResolutionStep,
      resolutionConfirmed: resolutionConfirmed
    })
    this.updateResolutionStepValidationDetail()
  }

  /** Called when component is created. */
  private created (): void {
    const foundingDate = new Date(this.getBusinessFoundingDate)
    foundingDate.setHours(0, 0, 0, 0)
    this.foundingDate = foundingDate
    this.resolutionConfirmed = !!this.getCreateResolutionStep.resolutionConfirmed
    this.resolutionDateText = this.getCreateResolutionStep.resolutionDate
    this.resolutionText = this.getCreateResolutionStep.resolutionText
    this.signingPerson = this.getCreateResolutionStep.signingPerson || EmptyPerson
    this.signatureDateText = this.getCreateResolutionStep.signingDate
  }

  private async mounted (): Promise<void> {
    await Vue.nextTick()
    this.updateResolutionStepValidationDetail()
  }

  @Watch('getShowErrors')
  private onShowErrorsChanged (): void {
    if (this.isTypeCoop) {
      if (this.getShowErrors &&
        this.$refs.resolutionDatePickerRef &&
        this.$refs.resolutionTextFormRef &&
        this.$refs.signingPersonFormRef &&
        this.$refs.signatureDatePickerRef &&
        this.$refs.confirmResolutionChkFormRef
      ) {
        this.$refs.resolutionDatePickerRef.validateForm()
        this.$refs.resolutionTextFormRef.validate()
        this.$refs.resolutionTextRef.validate()
        this.$refs.signatureDatePickerRef.validateForm()
        this.$refs.signingPersonFormRef.validate()
        this.$refs.confirmResolutionChkFormRef.validate()
      }
    } else {
      if (this.getShowErrors && this.$refs.confirmResolutionChkFormRef) {
        this.$refs.confirmResolutionChkFormRef.validate()
      }
    }
  }

  async onResolutionDateSync (val: string): Promise<void> {
    await Vue.nextTick()
    this.resolutionDateText = val
    this.setResolution({
      ...this.getCreateResolutionStep,
      resolutionDate: val
    })
    if (this.$refs.signatureDatePickerRef && this.signatureDateText) {
      // Need this await as the updated resolutionDateText value is not updated in time when
      // signatureDateMinDate is evaluated
      await Vue.nextTick()
      // triggering signature date validation as signature date is dependent on resolution date
      this.$refs.signatureDatePickerRef.validateForm()
    }
    this.updateResolutionStepValidationDetail()
  }

  private onResolutionTextChanged (val: string) {
    this.setResolution({
      ...this.getCreateResolutionStep,
      resolutionText: val
    })
    this.updateResolutionStepValidationDetail()
  }

  private async reRenderResolutionText (): Promise<void> {
    this.$refs.resolutionTextRef.calculateInputHeight()
  }

  // Previously, the resolution text area would not render to the appropriate height relative to the amount of content
  // when navigating from another step.  In hooking into the visibility change event on the resolution text area via the
  // v-observe-visibility property, we are able to force a re-calculation of the text area height when a user navigates
  // to the complete resolution step from another step for the first time. This results in the text area being rendered
  // to the appropriate height.
  private async onResolutionVisibilityChanged (isVisible, entry) {
    if (isVisible) {
      this.reRenderResolutionText()
    }
  }

  @Watch('signingPerson', { deep: true })
  private async onSigningPersonChanged (): Promise<void> {
    if (this.isTypeCoop) {
      await Vue.nextTick()
      this.setResolution({
        ...this.getCreateResolutionStep,
        signingPerson: this.signingPerson
      })
      this.updateResolutionStepValidationDetail()
    }
  }

  async onSigningDateSync (val: string): Promise<void> {
    await Vue.nextTick()
    this.signatureDateText = val
    this.setResolution({
      ...this.getCreateResolutionStep,
      signingDate: val
    })
    this.updateResolutionStepValidationDetail()
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

// Used for title/placeholder text of input fields.  This was required as some input fields require
// were not using the expected color of $gray7
::v-deep label,.v-label,theme--light {
  color: $gray7 !important;
}

.chk-list-item-txt {
  margin-left: 0.5rem;
}

.complete-resolution-summary-header {
  display: flex;
  background-color: $BCgovBlue5O;
  padding: 1.25rem;

  .complete-resolution-title {
    color: $gray9;
  }
}

.complete-resolution-error-message {
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

#resolution-text-section {
  // text area word count counter
  ::v-deep .v-counter {
    color: $gray7 !important;
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

.complete-resolution-vcard-title {
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

// Form Row Elements
.form__row.three-column {
  align-items: stretch;
  display: flex;
  flex-flow: row nowrap;
  margin-left: -0.5rem;
  margin-right: -0.5rem;

  .item {
    flex: 1 1 auto;
    flex-basis: 0;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
  }
}

#resolution-date-card {
  padding: 1.25rem;
  line-height: 1.2rem;
  font-size: 0.875rem;
}

.resolution-date-vcard-title,
.resolution-text-vcard-title,
.resolution-signature-vcard-title {
  padding-top: 1px;
  font-size: 16px;
  font-weight: bold;
  color: $gray9 !important;
}

</style>
