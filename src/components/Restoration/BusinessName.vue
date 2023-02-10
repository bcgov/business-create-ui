<template>
  <div id="business-name">
    <div class="section-container" :class="{'invalid-section': invalidSection}">
      <!-- Business Name -->
      <v-row no-gutters>
        <v-col cols="12" sm="3" class="pr-4">
          <label :class="{'error-text': invalidSection}">
            <strong>Business Name</strong>
          </label>
        </v-col>

        <!-- Editing Mode -->
        <template v-if="isEditingNames">
          <v-col cols="12" sm="9" class="pt-4 pt-sm-0">
            <CorrectNameOptions
              :correctionNameChoices="nameChangeOptions"
              @isSaved="onNameChange($event)"
              @cancel="isEditingNames = false"
            />
          </v-col>
        </template>

        <!-- Display Mode -->
        <template v-else>
          <v-col cols="12" sm="7" class="mt-n1 pt-4 pt-sm-0">
            <div class="company-name font-weight-bold text-uppercase">{{ companyName }}</div>

            <!-- Name Request Info -->
            <template v-if="hasNewNr">
              <div class="company-name mt-2">{{getNameRequest.nrNum || 'Unknown'}}</div>
              <div class="company-info mt-4">
                <span class="subtitle">Business Type: </span>
                <span :class="{ 'has-conflict': isConflictingLegalType}"
                      class="info-text">{{GetCorpFullDescription(getNameRequest.legalType)}}
                </span>
                <v-tooltip
                  v-if="isConflictingLegalType"
                  top
                  content-class="top-tooltip"
                  transition="fade-transition"
                  nudge-right="3"
                >
                  <template v-slot:activator="{ on }">
                    <v-icon v-on="on" color="error" small>
                      mdi-alert
                    </v-icon>
                  </template>
                  <span>Business Types do not match. The Name Request type must match the business type before
                    you can continue.</span>
                </v-tooltip>
              </div>
              <div class="company-info">
                <span class="subtitle">Request Type: </span>
                <span class="info-text">{{getNrRequestDesc(getNameRequest.requestType)}}</span>
              </div>
              <div class="company-info">
                <span class="subtitle">Expiry Date: </span>
                <span class="info-text">{{expiryDate || 'Unknown'}}</span>
              </div>
              <div class="company-info">
                <span class="subtitle">Status: </span>
                <span class="info-text text-capitalize">{{nrStatus}}</span>
              </div>
            </template>
          </v-col>

          <!-- Actions -->
          <v-col cols="2" class="my-n1">
            <div class="actions mr-4">
              <v-btn v-if="hasCompanyNameChanged" text color="primary" id="btn-undo" @click="resetName()">
                <v-icon small>mdi-undo</v-icon>
                <span>Undo</span>
              </v-btn>
            </div>
          </v-col>
        </template>
      </v-row>

      <!-- Name Request Applicant -->
      <v-row v-if="hasNewNr" no-gutters class="sub-section">
        <v-col cols="12" sm="3" class="pr-4">
          <label class="pr-4">
            <strong>Name Request Applicant</strong>
          </label>
        </v-col>

        <v-col cols="12" sm="9" class="pt-4 pt-sm-0">
          <div class="name-request-applicant-info">
            <span class="subtitle">Name: </span>
            <span class="info-text">{{nrApplicant.fullName}}</span>
          </div>
          <div class="name-request-applicant-info">
            <span class="subtitle">Address: </span>
            <span class="info-text">{{nrApplicant.fullAddress}}</span>
          </div>
          <div class="name-request-applicant-info">
            <span class="subtitle">Email: </span>
            <span class="info-text">{{nrApplicant.emailAddress || 'N/A'}}</span>
          </div>
          <div class="name-request-applicant-info">
            <span class="subtitle">Phone: </span>
            <span class="info-text">{{phoneNumber || 'N/A'}}</span>
          </div>
        </v-col>
      </v-row>
    </div>

    <!-- Name Translation -->
    <NameTranslation @hasNameTranslation="emitHasNameTranslation($event)" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Emit, Prop, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { ActionBindingIF, EntitySnapshotIF, FlagsCompanyInfoIF, NameRequestApplicantIF, NameRequestIF }
  from '@/interfaces/'
import { ContactPointIF } from '@bcrs-shared-components/interfaces/'
import { CommonMixin, DateMixin, NameRequestMixin } from '@/mixins/'
import { CoopTypes, NameChangeOptions } from '@/enums/'
import { CorpTypeCd, GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module/'
import CorrectNameOptions from '@/components/Restoration/CorrectNameOptions.vue'
import NameTranslation from '@/components/common/NameTranslation.vue'

@Component({
  components: {
    CorrectNameOptions,
    NameTranslation
  },
  mixins: [
    CommonMixin,
    DateMixin,
    NameRequestMixin
  ]
})
export default class BusinessName extends Vue {
  // for template
  readonly GetCorpFullDescription = GetCorpFullDescription

  @Prop({ default: false }) getComponentValidate!: boolean

  // Global getters
  @Getter getNameRequest!: NameRequestIF
  @Getter getBusinessNumber!: string
  @Getter getNameRequest!: NameRequestIF
  @Getter getEntityType!: CorpTypeCd

  // Global actions
  // @Action setEditingCompanyName!: ActionBindingIF
  // @Action setValidComponent!: ActionBindingIF

  // *** TODO
  private setEditingCompanyName (): void {}
  private setValidComponent (): void {}

  protected dropdown: boolean = null
  protected hasCompanyNameChanged = false
  protected correctNameChoices: Array<string> = []
  protected isEditingNames = false
  protected isEditingType = false
  protected isEditingTranslations = false

  /** The current NR number. */
  get nrNum (): string {
    return this.getNameRequest.nrNum
  }

  /** True if a new NR number has been entered. */
  get hasNewNr (): boolean {
    return !!this.getNameRequest.nrNum
  }

  /** True if entity type is different from NR legal type. */
  get isConflictingLegalType (): boolean {
    return (this.getEntityType !== this.getNameRequest.legalType)
  }

  /** The section validity state (when prompted by app). */
  get invalidSection (): boolean {
    return (this.getComponentValidate && this.isEditingNames)
  }

  /** The translation section validity state (when prompted by app). */
  get invalidTranslationSection (): boolean {
    return (this.getComponentValidate && this.isEditingTranslations)
  }

  /** The company name (from NR, or incorporation number). */
  get companyName (): string {
    if (this.nameRequestLegalName) return this.nameRequestLegalName

    return `${this.getBusinessNumber || '[Incorporation Number]'} B.C. Ltd.`
  }

  /** Name Request applicant info */
  get nrApplicant (): NameRequestApplicantIF {
    return this.getNameRequest.applicants // not an array
  }

  /** Name Request status */
  get nrStatus (): string {
    return (this.getNameRequest.status || '').toLowerCase()
  }

  /** Name Request expiry */
  get expiryDate (): string {
    const expiry = this.getNameRequest.expiry
    if (expiry) {
      return this.apiToPacificDateTime(expiry)
    }
    return null
  }

  /** The Name Request Legal Name (approved name). */
  // *** TODO: reconcile this with getNameRequestApprovedName()
  get nameRequestLegalName (): string {
    return this.getNrApprovedName(this.getNameRequest)
  }

  /** Name Request phone number */
  get phoneNumber (): string {
    return this.toDisplayPhone(this.nrApplicant.phoneNumber)
  }

  /** The current options for change of name correction or edit. */
  get nameChangeOptions (): Array<NameChangeOptions> {
    return [
      NameChangeOptions.CORRECT_NAME_TO_NUMBER,
      NameChangeOptions.CORRECT_NEW_NR
    ]
  }

  /** Whether a new business legal name was entered.. */
  // *** TODO: combine this with isNewName ?
  get isNewName () {
    const originalName = this.nameRequestLegalName
    const currentName = this.getEntitySnapshot?.businessInfo.legalName
    return (originalName !== currentName)
  }

  /** Reset company name values to original. */
  protected resetName () {
    // *** TODO: implement
    // // reset business information, except for association type.
    // const businessInfo = { ...this.getEntitySnapshot.businessInfo, associationType: this.getAssociationType }
    // this.setBusinessInformation(businessInfo)

    // // reset name request
    // this.setNameRequest({
    //   legalType: this.getEntitySnapshot.businessInfo.legalType,
    //   legalName: this.getEntitySnapshot.businessInfo.legalName,
    //   nrNumber: this.getEntitySnapshot.businessInfo.nrNumber
    // })

    // reset flag
    this.hasCompanyNameChanged = false
  }

  /**
   * Updates UI when Name Request is updated (ie, on resume draft)
   * or when correct name options are done.
   */
  @Watch('getNameRequest')
  private onNameChange (isSaved = false): void {
    this.hasCompanyNameChanged = this.isNewName
    if (isSaved) this.isEditingNames = false
  }

  /** Updates store initially and when isEditingName property has changed. */
  @Watch('isEditingNames', { immediate: true })
  private onEditingNameChanged (val: boolean): void {
    this.setValidComponent({ key: 'isValidCompanyName', value: !val })
    this.setEditingCompanyName(val)
  }

  /** Updates store initially and when isEditingType property has changed. */
  @Watch('isEditingType', { immediate: true })
  private onEditingTypeChanged (val: boolean): void {
    this.setValidComponent({ key: 'isValidBusinessType', value: !val })
  }

  /** Updates store initially and when isEditingTranslations property has changed. */
  @Watch('isEditingTranslations', { immediate: true })
  private onEditingTranslationChanged (val: boolean): void {
    this.setValidComponent({ key: 'isValidNameTranslation', value: !val })
  }

  @Emit('hasNameTranslation')
  protected emitHasNameTranslation (val: boolean): void {}
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.company-name {
  font-size: $px-24;
}

.company-info {
  padding-top: 0.5rem;
}

.name-request-applicant-info:not(:first-child) {
  padding-top: 0.5rem
}

.actions {
  position: absolute;
  right: 0;

  .v-btn {
    min-width: 0.5rem;
  }
}
</style>
