<template>
  <div id="complete-resolution">
    <!-- Intro section -->
    <section
      id="resolution-intro-section"
      class="mt-10"
    >
      <header>
        <h2>{{ getCreateResolutionResource.introSection.header }}</h2>
        <p class="section-description mt-2">
          <span
            v-for="(partialItem, index) in getCreateResolutionResource.introSection.items"
            :key="index"
          >
            <span
              v-if="partialItem.type === ItemTypes.TEXT"
              v-html="partialItem.value"
            />
            <v-tooltip
              v-if="partialItem.type === ItemTypes.TOOLTIP"
              top
              max-width="15rem"
              content-class="top-tooltip"
              transition="fade-transition"
            >
              <template #activator="{ on }">
                <span
                  class="tool-tip dotted-underline"
                  v-on="on"
                > {{ partialItem.value.label }} </span>
              </template>
              <span>{{ partialItem.value.text }}</span>
            </v-tooltip>
          </span>
        </p>
      </header>
    </section>

    <!-- Help section -->
    <div
      v-if="getCreateResolutionResource.helpSection"
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
        <span v-if="!helpToggle">{{ getCreateResolutionResource.helpSection.header }}</span>
        <span v-else>Hide Help</span>
      </span>

      <v-expand-transition>
        <section
          v-show="helpToggle"
          class="create-resolution-help"
        >
          <header class="create-resolution-help-header">
            <h2>{{ getCreateResolutionResource.helpSection.header }}</h2>
          </header>

          <span
            v-for="(item, index) in getCreateResolutionResource.helpSection.helpText.section1.items"
            :key="index"
          >
            <p
              v-if="item.type === ItemTypes.TEXT"
              class="mt-3"
              v-html="item.value"
            />
            <v-row v-if="item.type === ItemTypes.PARTIAL_ITEMS">
              <v-col cols="11">
                <span
                  v-for="(partialItem, index) in item.value"
                  :key="index"
                >
                  <span
                    v-if="partialItem.type === ItemTypes.TEXT"
                    v-html="partialItem.value"
                  />
                  <a
                    v-if="partialItem.type === ItemTypes.LINK"
                    :href="partialItem.value.href"
                    target="_blank"
                  >{{ partialItem.value.linkText }}
                    <v-icon
                      dense
                      color="primary"
                    >mdi-open-in-new</v-icon>
                  </a>
                </span>
              </v-col>
            </v-row>
            <ul
              v-if="item.type === ItemTypes.BULLET_LIST"
              class="mt-1"
            >
              <li
                v-for="(bulletItem, index) in item.value"
                :key="index"
              >
                <v-row class="mt-1">
                  <v-col
                    v-if="item.bulletListType === BulletListTypes.CIRCLE_SMALL"
                    cols="1"
                    class="pt-1 pb-1"
                  >
                    <v-icon>mdi-circle-small</v-icon>
                  </v-col>
                  <v-col
                    v-if="item.bulletListType === BulletListTypes.ALPHABETICAL_LOWER"
                    cols="1"
                    class="pt-1 pb-1"
                  >
                    ({{ convertIntToChar(index) }})
                  </v-col>
                  <v-col
                    cols="11"
                    class="ml-n11 pt-1 pb-1"
                  >
                    <span>{{ bulletItem }}</span>
                  </v-col>
                </v-row>
              </li>
            </ul>
          </span>
          <u
            class="help-btn"
            @click="helpToggle = !helpToggle"
          ><small>Hide Help</small></u>
        </section>
      </v-expand-transition>
    </div>

    <!-- Special Resolution Form -->
    <section
      v-if="isTypeCoop"
      id="sample-resolution-section"
      class="mt-10"
    >
      <header id="sample-resolution-header">
        <h2>{{ getCreateResolutionResource.sampleFormSection.header }}</h2>
      </header>

      <p
        class="section-description mt-2"
        v-html="getCreateResolutionResource.sampleFormSection.text"
      />

      <div class="mt-4">
        <v-card
          flat
          class="py-8 px-6"
        >
          <div class="d-flex flex-column flex-sm-row justify-center align-center">
            <img
              :src="previewImageSource()"
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
                {{ getCreateResolutionResource.sampleFormSection.downloadDocLabel }}
              </a>
            </div>
          </div>
        </v-card>
      </div>
    </section>

    <!-- Resolution Date -->
    <section
      v-if="isTypeCoop"
      id="resolution-date-section"
      class="mt-10"
    >
      <header id="resolution-date-header">
        <h2>{{ getCreateResolutionResource.resolutionDateSection.header }}</h2>
      </header>

      <p class="section-description mt-2">
        {{ getCreateResolutionResource.resolutionDateSection.description }}
      </p>

      <div
        class="mt-4"
        :class="{ 'invalid-section': getShowErrors && !isResolutionDateValid }"
      >
        <v-card
          id="resolution-date-card"
          flat
          class="py-8 px-6"
        >
          <v-row no-gutters>
            <v-col
              cols="12"
              sm="3"
              class="pr-4 d-none d-sm-block"
            >
              <label class="resolution-date-vcard-title mt-4">
                Resolution Date
              </label>
            </v-col>
            <v-col
              cols="12"
              sm="9"
            >
              <DatePickerShared
                ref="resolutionDatePickerRef"
                title="Resolution Date"
                :nudgeRight="40"
                :nudgeTop="85"
                :initialValue="resolutionDateText"
                :minDate="resolutionDateMinStr"
                :maxDate="resolutionDateMaxStr"
                :inputRules="resolutionDateRules"
                @emitDateSync="onResolutionDateSync($event)"
              />
            </v-col>
          </v-row>
        </v-card>
      </div>
    </section>

    <!-- Resolution Text -->
    <section
      v-if="isTypeCoop"
      id="resolution-text-section"
      class="mt-10"
    >
      <header id="resolution-text-header">
        <h2>{{ getCreateResolutionResource.resolutionTextSection.header }}</h2>
      </header>

      <p class="section-description mt-2">
        {{ getCreateResolutionResource.resolutionTextSection.description }}
      </p>

      <div
        class="mt-4"
        :class="{ 'invalid-section': getShowErrors && !isResolutionTextValid }"
      >
        <v-card
          id="resolution-text-card"
          flat
          class="py-8 px-6"
        >
          <v-row no-gutters>
            <v-col
              cols="12"
              sm="3"
              class="pr-4 d-none d-sm-block"
            >
              <label class="resolution-text-vcard-title mt-4">
                {{ getCreateResolutionResource.resolutionTextSection.textLabel }}
              </label>
            </v-col>
            <v-col
              cols="12"
              sm="9"
            >
              <v-form ref="resolutionTextFormRef">
                <v-textarea
                  ref="resolutionTextRef"
                  v-model="resolutionText"
                  v-observe-visibility="{ callback: onResolutionVisibilityChanged, once: true }"
                  auto-grow
                  filled
                  :label="getCreateResolutionResource.resolutionTextSection.textPlaceholder"
                  rows="6"
                  :counter="MAX_RESOLUTION_TEXT_LENGTH"
                  :rules="resolutionTextRules"
                  @change="onResolutionTextChanged($event)"
                />
              </v-form>
            </v-col>
          </v-row>
        </v-card>
      </div>
    </section>

    <!-- Resolution Signature -->
    <section
      v-if="isTypeCoop"
      id="resolution-signature-info-section"
      class="mt-10"
    >
      <header id="resolution-signature-info-header">
        <h2>{{ getCreateResolutionResource.resolutionSignatureSection.header }}</h2>
      </header>

      <p class="section-description mt-2">
        {{ getCreateResolutionResource.resolutionSignatureSection.description }}
      </p>

      <div
        class="mt-4"
        :class="{ 'invalid-section': getShowErrors && (!isSigningPersonValid || !isSigningDateValid) }"
      >
        <v-card
          id="resolution-signature-card"
          flat
          class="py-8 px-6"
        >
          <v-row no-gutters>
            <v-col
              cols="12"
              sm="3"
              class="pr-4"
            >
              <label class="resolution-signature-vcard-title">Signing Party</label>
            </v-col>
            <v-col
              cols="12"
              sm="9"
              class="pt-4 pt-sm-0"
            >
              <v-form ref="signingPersonFormRef">
                <div class="form__row three-column">
                  <v-text-field
                    id="person__first-name"
                    ref="signingPersonGivenNameRef"
                    v-model="signingPerson.givenName"
                    filled
                    class="item"
                    label="First Name"
                    :rules="Rules.FirstNameRules"
                  />
                  <v-text-field
                    id="person__middle-name"
                    ref="signingPersonMiddleNameRef"
                    v-model="signingPerson.additionalName"
                    filled
                    class="item"
                    label="Middle Name (Optional)"
                    :rules="Rules.MiddleNameRules"
                  />
                  <v-text-field
                    id="person__last-name"
                    ref="signingPersonFamilyNameRef"
                    v-model="signingPerson.familyName"
                    filled
                    class="item"
                    label="Last Name"
                    :rules="Rules.LastNameRules"
                  />
                </div>
              </v-form>
            </v-col>
          </v-row>

          <v-row no-gutters>
            <v-col
              cols="12"
              sm="3"
              class="pr-4"
            >
              <label class="resolution-signature-vcard-title">Date Signed</label>
            </v-col>
            <v-col
              cols="12"
              sm="9"
              class="pt-4 pt-sm-0"
            >
              <DatePickerShared
                ref="signatureDatePickerRef"
                title="Date Signed"
                :nudgeRight="40"
                :nudgeTop="85"
                :initialValue="signatureDateText"
                :minDate="signatureDateMinStr"
                :maxDate="signatureDateMaxStr"
                :inputRules="signatureDateRules"
                @emitDateSync="onSigningDateSync($event)"
              />
            </v-col>
          </v-row>
        </v-card>
      </div>
    </section>

    <!-- Confirm Resolution -->
    <section
      id="confirm-resolution-section"
      class="mt-10"
    >
      <header id="resolution-confirm-header">
        <h2>{{ getCreateResolutionResource.confirmSection.header }}</h2>
      </header>

      <div
        class="mt-4"
        :class="{ 'invalid-section': isInvalid }"
      >
        <v-card
          id="confirm-resolution-card"
          flat
          class="py-8 px-6"
        >
          <v-form ref="confirmResolutionChkFormRef">
            <v-checkbox
              id="chk-confirm-resolution"
              ref="confirmResolutionChkRef"
              v-model="resolutionConfirmed"
              class="chk-resolution mt-0 pt-0"
              hide-details
              :rules="confirmCompletionResolution"
              @change="onResolutionConfirmedChange($event)"
            >
              <template #label>
                <div v-html="confirmLabel" />
              </template>
            </v-checkbox>
            <ul>
              <li
                v-for="(item, index) in getCreateResolutionResource.confirmSection.items"
                :key="index"
                class="mt-4"
              >
                <v-row
                  v-if="item.type === ItemTypes.TEXT"
                  no-gutters
                >
                  <v-col cols="1">
                    <v-icon>mdi-circle-small</v-icon>
                  </v-col>
                  <v-col cols="11">
                    {{ item.value }}
                  </v-col>
                </v-row>
                <v-row
                  v-if="item.type === ItemTypes.PARTIAL_ITEMS"
                  no-gutters
                >
                  <v-col cols="1">
                    <v-icon>mdi-circle-small</v-icon>
                  </v-col>
                  <v-col cols="11">
                    <span
                      v-for="(partialItem, index) in item.value"
                      :key="index"
                    >
                      <span
                        v-if="partialItem.type === ItemTypes.TEXT"
                        v-html="partialItem.value"
                      />
                      <span
                        v-if="partialItem.type === ItemTypes.PLACEHOLDER &&
                          partialItem.value === PLACEHOLDER_LEGAL_NAME_INLINE"
                      >{{ getBusinessLegalName }}</span>
                      <p
                        v-if="partialItem.type === ItemTypes.PLACEHOLDER &&
                          partialItem.value === PLACEHOLDER_LEGAL_NAME"
                        class="font-weight-bold mb-0"
                      >{{ getBusinessLegalName }}</p>
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
import { Action, Getter } from 'pinia-class'
import { useStore } from '@/store/store'

// Shared Components
import { DatePicker as DatePickerShared } from '@bcrs-shared-components/date-picker'

// Interfaces, enums, etc
import {
  CreateResolutionIF,
  CreateResolutionResourceIF,
  FormIF,
  ValidationDetailIF,
  PersonIF,
  EmptyPerson
} from '@/interfaces'
import { BulletListTypes, ItemTypes, RouteNames } from '@/enums'
import { CorpTypeCd } from '@bcrs-shared-components/enums/'
import { CommonMixin, DateMixin } from '@/mixins'
import { Rules, RuleHelpers } from '@/rules'
import { VuetifyRuleFunction } from '@/types'

@Component({
  components: {
    DatePickerShared
  }
})
export default class CompleteResolution extends Mixins(CommonMixin, DateMixin) {
  // Refs
  $refs!: {
    resolutionDatePickerRef: DatePickerShared
    resolutionTextFormRef: FormIF
    resolutionTextRef: FormIF
    signatureDatePickerRef: DatePickerShared
    signingPersonFormRef: FormIF
    signingPersonGivenNameRef: FormIF
    signingPersonMiddleNameRef: FormIF
    signingPersonFamilyNameRef: FormIF
    confirmResolutionChkFormRef: FormIF
    confirmResolutionChkRef: FormIF
  }

  // Constants
  readonly MAX_RESOLUTION_TEXT_LENGTH = 1000
  readonly PLACEHOLDER_LEGAL_NAME = 'legal_name'
  readonly PLACEHOLDER_LEGAL_NAME_INLINE = 'legal_name_inline'

  // Local variables
  resolutionText = ''
  resolutionConfirmed = false
  helpToggle = false
  signingPerson = { ...EmptyPerson } as PersonIF
  resolutionDateText = ''
  signatureDateText = ''
  private foundingDate = null as Date

  @Getter(useStore) getBusinessFoundingDate!: string
  @Getter(useStore) getBusinessLegalName!: string
  @Getter(useStore) getCreateResolutionResource!: CreateResolutionResourceIF
  @Getter(useStore) getCreateResolutionStep!: CreateResolutionIF
  @Getter(useStore) getShowErrors!: boolean
  @Getter(useStore) isTypeCoop!: boolean

  @Action(useStore) setResolution!: (x: CreateResolutionIF) => void
  @Action(useStore) setResolutionStepValidationDetail!: (x: ValidationDetailIF) => void

  // Enums for template
  readonly RouteNames = RouteNames
  readonly ItemTypes = ItemTypes
  readonly CorpTypeCd = CorpTypeCd
  readonly BulletListTypes = BulletListTypes

  // Validation Rules
  readonly Rules = Rules

  readonly confirmCompletionResolution = [
    (v) => { return !!v }
  ]

  get documentURL (): string {
    const docUrl = sessionStorage.getItem('BASE_URL') +
      this.getCreateResolutionResource.sampleFormSection.downloadDocPath
    return docUrl
  }

  /** Returns true if the section is invalid after the review and confirm page has been visited */
  get isInvalid (): boolean {
    return this.getShowErrors && !this.isConfirmResolutionValid
  }

  previewImageSource (): string {
    // Note: the image file path did not resolve correctly when using the require function directly.  In order
    // to get the image path resolving correctly, needed to get the image context first and use that to build
    // the final image file path

    if (this.isVitestRunning) { return '' }
    const images = require.context('@/assets/images/', false, /\.png$/)
    return images('./' + this.getCreateResolutionResource.sampleFormSection.previewImagePath)
  }

  get confirmLabel (): string {
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
  get resolutionDateRules (): Array<VuetifyRuleFunction> {
    return [
      (v: string) => !!v || 'Resolution date is required',
      (v: string) =>
        RuleHelpers.DateRuleHelpers
          .isBetweenDates(this.resolutionDateMin,
            this.resolutionDateMax,
            v) ||
        `Date should be between ${this.dateToPacificDate(this.resolutionDateMin, true)} and
         ${this.dateToPacificDate(this.resolutionDateMax, true)}`
    ]
  }

  /** Validations rules for signing date field. */
  get signatureDateRules (): Array<VuetifyRuleFunction> {
    return [
      (v: string) => !!v || 'Signature date is required',
      (v: string) =>
        RuleHelpers.DateRuleHelpers
          .isBetweenDates(this.signatureDateMin,
            this.signatureDateMax,
            v) ||
        `Date should be between ${this.dateToPacificDate(this.signatureDateMin, true)} and
         ${this.dateToPacificDate(this.signatureDateMax, true)}`
    ]
  }

  /** The minimum date that can be entered (can't be earlier than incorporation date ). */
  get resolutionDateMinStr (): string {
    return this.dateToYyyyMmDd(this.foundingDate)
  }

  /** The minimum date that can be entered (can't be earlier than incorporation date ). */
  get resolutionDateMin (): Date {
    return this.foundingDate
  }

  /** The maximum date that can be entered (today). */
  get resolutionDateMaxStr (): string {
    return this.dateToYyyyMmDd(this.getCurrentJsDate)
  }

  /** The maximum date that can be entered (today). */
  get resolutionDateMax (): Date {
    return this.getCurrentJsDate
  }

  /** The minimum date that can be entered (resolution date). */
  get signatureDateMinStr (): string {
    const date = this.signatureDateMin
    const result = this.dateToYyyyMmDd(date)
    return result
  }

  /** The minimum date that can be entered (resolution date). */
  get signatureDateMin (): Date {
    if (this.resolutionDateText) {
      const resolutionDate = this.yyyyMmDdToDate(this.resolutionDateText)
      return resolutionDate
    }
    const date = new Date(this.getCurrentJsDate) // make a copy
    date.setHours(0, 0, 0, 0)
    return date
  }

  /** The maximum date that can be entered (today). */
  get signatureDateMaxStr (): string {
    const date = this.signatureDateMax
    const dateStr = this.dateToYyyyMmDd(date)
    return dateStr
  }

  /** The maximum date that can be entered (today). */
  get signatureDateMax (): Date {
    return this.getCurrentJsDate
  }

  get resolutionTextRules (): Array<VuetifyRuleFunction> {
    return [
      v => (v && v.trim().length > 0) || 'Resolution text is required',
      v => (v && v.length <= this.MAX_RESOLUTION_TEXT_LENGTH) || 'Maximum characters exceeded',
      Rules.CommonRules.ALPHA_NUMERIC_AND_STANDARD_SPECIAL_CHARS
    ]
  }

  get isResolutionDateValid (): boolean {
    return this.$refs.resolutionDatePickerRef?.isDateValid()
  }

  get isResolutionTextValid (): boolean {
    return this.$refs.resolutionTextRef?.valid
  }

  get isSigningDateValid (): boolean {
    return this.$refs.signatureDatePickerRef?.isDateValid()
  }

  get isSigningPersonValid (): boolean {
    return this.$refs.signingPersonGivenNameRef?.valid &&
      this.$refs.signingPersonMiddleNameRef.valid &&
      this.$refs.signingPersonFamilyNameRef.valid
  }

  get isConfirmResolutionValid (): boolean {
    return this.$refs.confirmResolutionChkRef?.valid
  }

  private isResolutionValid (): boolean {
    if (this.isTypeCoop) {
      return this.$refs.resolutionTextRef?.valid &&
        this.$refs.resolutionDatePickerRef?.isDateValid() &&
        this.isSigningPersonValid &&
        this.$refs.signatureDatePickerRef?.isDateValid() &&
        this.$refs.confirmResolutionChkRef?.valid
    }
    return this.$refs.confirmResolutionChkRef?.valid
  }

  private updateResolutionStepValidationDetail () {
    let validationDetail = null as ValidationDetailIF
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
    if (validationDetail) {
      this.setResolutionStepValidationDetail(validationDetail)
    }
  }

  async onResolutionConfirmedChange (resolutionConfirmed: boolean): Promise<void> {
    // This is required as there are timing issues between this component and the CompleteResolutionSummary
    // component.  The CompleteResolutionSummary isn't always able to detect that the confirm checkbox
    // value has changed without using nextTick()
    await this.$nextTick()
    this.setResolution({
      ...this.getCreateResolutionStep,
      resolutionConfirmed
    })
    this.updateResolutionStepValidationDetail()
  }

  /** Called when component is created. */
  created (): void {
    const foundingDate = this.apiToDate(this.getBusinessFoundingDate)
    foundingDate.setHours(0, 0, 0, 0)
    this.foundingDate = foundingDate
    this.resolutionConfirmed = this.getCreateResolutionStep.resolutionConfirmed
    this.resolutionDateText = this.getCreateResolutionStep.resolutionDate
    this.resolutionText = this.getCreateResolutionStep.resolutionText
    this.signingPerson = this.getCreateResolutionStep.signingPerson || { ...EmptyPerson }
    this.signatureDateText = this.getCreateResolutionStep.signingDate
  }

  /** Called when component is mounted. */
  async mounted (): Promise<void> {
    // wait for components to load/stabilize then update validation state in store
    await this.$nextTick()
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
    await this.$nextTick()
    this.resolutionDateText = val
    this.setResolution({
      ...this.getCreateResolutionStep,
      resolutionDate: val
    })
    if (this.$refs.signatureDatePickerRef && this.signatureDateText) {
      // Need this await as the updated resolutionDateText value is not updated in time when
      // signatureDateMinDate is evaluated
      await this.$nextTick()
      // triggering signature date validation as signature date is dependent on resolution date
      this.$refs.signatureDatePickerRef.validateForm()
    }
    this.updateResolutionStepValidationDetail()
  }

  onResolutionTextChanged (val: string) {
    this.setResolution({
      ...this.getCreateResolutionStep,
      resolutionText: val
    })
    this.updateResolutionStepValidationDetail()
  }

  // Previously, the resolution text area would not render to the appropriate height relative to the amount of content
  // when navigating from another step.  In hooking into the visibility change event on the resolution text area via the
  // v-observe-visibility property, we are able to force a re-calculation of the text area height when a user navigates
  // to the complete resolution step from another step for the first time. This results in the text area being rendered
  // to the appropriate height.
  onResolutionVisibilityChanged (isVisible: boolean, _entry): void {
    if (isVisible) {
      this.$refs.resolutionTextRef.calculateInputHeight()
    }
  }

  @Watch('signingPerson', { deep: true })
  private async onSigningPersonChanged (): Promise<void> {
    if (this.isTypeCoop) {
      await this.$nextTick()
      this.setResolution({
        ...this.getCreateResolutionStep,
        signingPerson: this.signingPerson
      })
      this.updateResolutionStepValidationDetail()
    }
  }

  async onSigningDateSync (val: string): Promise<void> {
    await this.$nextTick()
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

header p {
  padding-top: 0.5rem;
}

ul {
  list-style: none;
  color: $gray7;
}

// Used for title/placeholder text of input fields.  This was required as some input fields require
// were not using the expected color of $gray7
:deep(label.v-label.theme--light) {
  color: $gray7 !important;
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

  a {
    text-decoration: none;
  }
}

#resolution-text-section {
  // text area word count counter
  :deep(.v-counter) {
    color: $gray7 !important;
  }
}

:deep() {
  /** Override default validation styling so invalid sections do
  not turn red on validation error */
  .v-input--selection-controls__input .error--text,
  .v-messages__message,
  .v-input__slot {
    color: $app-lt-gray;
  }
  .v-input__icon .error--text {
    color: $app-lt-gray !important;
  }
}

.invalid-section :deep() {
  /** Inserts red validation styling on invalid sections after the review
  and confirm page has been visted.  */
  .v-input--checkbox .v-input__control .v-input__slot .v-label {
    color: $BCgovInputError !important;
  }
  .v-messages__message,
  .v-input__slot,
  .v-input__icon  {
    color: $BCgovInputError;
  }
  .v-input__icon .error--text {
    color: $BCgovInputError !important;
  }
}

.chk-resolution {
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

.complete-resolution-vcard-title {
  padding-top: 1px;
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

#sample-resolution-section {
  a {
    text-decoration: none;
  }
}

:deep(#confirm-resolution-section .v-input__slot) {
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
  line-height: 1.2rem;
  font-size: $px-14;

  // remove extra space taken by error message
  :deep(.v-text-field__details) {
    margin-bottom: -8px !important;
  }
}

#resolution-text-card {
  // remove extra space taken by error message
  :deep(.v-text-field__details) {
    margin-bottom: -8px !important;
  }
}

#resolution-signature-card {
  // remove extra space taken by error message
  :deep(.date-picker-form .v-text-field__details) {
    margin-bottom: -8px !important;
  }
}

.resolution-date-vcard-title,
.resolution-text-vcard-title,
.resolution-signature-vcard-title {
  font-size: $px-16;
  font-weight: bold;
  color: $gray9 !important;
}
</style>
