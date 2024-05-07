<template>
  <div id="extrapro-registration">
    <!-- inactive = ready to search to start -->
    <template v-if="!active">
      <v-row no-gutters>
        <v-col
          cols="12"
          sm="3"
        >
          <label>Extraprovincial Registration in B.C.</label>
        </v-col>

        <v-col
          cols="12"
          sm="9"
        >
          <ExtraproBusinessLookup
            class="mr-2"
            @business="setBusiness($event)"
          />
        </v-col>
      </v-row>
    </template>

    <!-- active = display/edit mode -->
    <template v-if="active">
      <v-row no-gutters>
        <v-col
          cols="12"
          sm="3"
        >
          <label>Extraprovincial Registration in B.C.</label>
        </v-col>

        <v-col
          cols="12"
          sm="7"
        >
          <v-text-field
            class="incorporation-number"
            filled
            hide-details
            label="B.C. Extraprovincial Incorporation Number"
            readonly
            :value="incorporationNumber"
          />
        </v-col>

        <v-col
          cols="12"
          sm="2"
        >
          <v-btn
            id="undo-button"
            class="float-sm-right float-none"
            text
            color="primary"
            @click="reset()"
          >
            <v-icon small>
              mdi-undo
            </v-icon>
            <span>Undo</span>
          </v-btn>
        </v-col>
      </v-row>

      <v-row
        class="mt-6"
        no-gutters
      >
        <v-col
          cols="12"
          sm="3"
        >
          <label>Extraprovincial Registration Information</label>
        </v-col>

        <v-col
          cols="12"
          sm="9"
        >
          <p id="home-jurisdiction">
            <label>Home Jurisdiction: </label>
            <span>{{ homeJurisdiction || '[Unknown]' }}</span>
          </p>

          <p id="business-name">
            <label>Business Name: </label>
            <span>{{ businessName }}</span>
          </p>

          <p id="business-number">
            <label>Business Number: </label>
            <span>{{ businessNumber || '[Unknown]' }}</span>
          </p>

          <p id="incorporation-date">
            <label>Incorporation Date: </label>
            <span>{{ incorporationDate || '[Unknown]' }}</span>
          </p>
        </v-col>
      </v-row>

      <template v-if="isBusinessActive">
        <v-row
          class="mt-4"
          no-gutters
        >
          <v-col
            cols="12"
            sm="3"
          >
            <label>Type of Business in Home Jurisdiction</label>
          </v-col>

          <v-col
            cols="12"
            sm="9"
          >
            <v-radio-group
              v-model="business.isUlc"
              row
            >
              <v-radio
                label="Unlimited Liability Company"
                :value="true"
              />
              <v-radio
                label="Other"
                :value="false"
              />
            </v-radio-group>
          </v-col>
        </v-row>

        <v-expand-transition>
          <v-row
            v-if="business.isUlc"
            class="mt-4"
            no-gutters
          >
            <v-col
              cols="12"
              sm="3"
            >
              <label>Upload Affidavit</label>
            </v-col>

            <v-col
              cols="12"
              sm="9"
            >
              <p>
                Upload the affidavit from the directors.
              </p>

              <ul>
                <li>
                  Use a white background and a legible font with contrasting font colour
                </li>
                <li>
                  PDF file type (maximum 30 MB file size)
                </li>
              </ul>

              <FileUploadPreview
                class="mt-4"
                :inputFileLabel="INPUT_FILE_LABEL"
                :maxSize="MAX_FILE_SIZE"
                :pdfPageSize="PdfPageSize.LETTER_SIZE"
                :inputFile="uploadMemorandumDoc"
                :showErrors="getShowErrors"
                :customErrorMessage="UPLOAD_FAILED_MESSAGE"
                @fileSelected="fileSelected($event)"
                @isFileValid="isFileUploadValidFn($event)"
              />
            </v-col>
          </v-row>
        </v-expand-transition>

        <v-row
          class="mt-4"
          no-gutters
        >
          <v-col
            cols="12"
            sm="3"
          >
            <!-- empty column -->
          </v-col>

          <v-col
            cols="12"
            sm="9"
          >
            <MessageBox color="gold">
              <strong>Important:</strong> Verify that this information matches exactly the current information
              in the home jurisdiction.
            </MessageBox>
          </v-col>
        </v-row>

        <v-row
          class="mt-8"
          no-gutters
        >
          <v-col
            cols="12"
            sm="3"
          >
            <label>Confirmation</label>
          </v-col>

          <v-col
            cols="12"
            sm="9"
          >
            <v-checkbox
              id="extrapro-registration-checkbox"
              v-model="business.isConfirmed"
              class="pt-0 mt-0"
              hide-details
              :label="checkboxLabel"
              :rules="getShowErrors ? [(v) => !!v] : []"
            />
          </v-col>
        </v-row>
      </template>

      <template v-else>
        <v-row
          class="mt-2"
          no-gutters
        >
          <v-col
            cols="12"
            sm="3"
          >
            <!-- empty column -->
          </v-col>

          <v-col
            cols="12"
            sm="9"
          >
            <MessageBox color="red">
              <strong>Important:</strong> This extraprovincial registration is historical. Please contact
              BC Registries staff.
            </MessageBox>

            <RegistriesContactInfo class="mt-6" />
          </v-col>
        </v-row>
      </template>
    </template>
    <pre>business={{ business }}</pre>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { isEqual } from 'lodash'
import { getName } from 'country-list'
import { useStore } from '@/store/store'
import { DocumentMixin } from '@/mixins'
import { BusinessLookupResultIF, ExistingBusinessInfoIF } from '@/interfaces'
import { PdfPageSize } from '@/enums'
import { EntityStates } from '@bcrs-shared-components/enums'
import ExtraproBusinessLookup from './ExtraproBusinessLookup.vue'
import MessageBox from '@/components/common/MessageBox.vue'
import RegistriesContactInfo from '@/components/common/RegistriesContactInfo.vue'
import FileUploadPreview from '@/components/common/FileUploadPreview.vue'
// import { LegalServices } from '@/services'

@Component({
  components: {
    ExtraproBusinessLookup,
    FileUploadPreview,
    MessageBox,
    RegistriesContactInfo
  }
})
export default class ExtraproRegistration extends Mixins(DocumentMixin) {
  readonly PdfPageSize = PdfPageSize

  @Getter(useStore) getExistingBusinessInfo!: ExistingBusinessInfoIF
  @Getter(useStore) getShowErrors!: boolean

  @Action(useStore) setExistingBusinessInfo!: (x: ExistingBusinessInfoIF) => void

  readonly INPUT_FILE_LABEL = 'Affidavit from directors is required'

  // Local properties
  active = false
  business = {} as ExistingBusinessInfoIF
  uploadMemorandumDoc = null as File
  uploadMemorandumDocKey = null as string

  readonly checkboxLabel = 'I understand and acknowledge that the extraprovincial registration of' +
    ' this business will be cancelled and made historical in the B.C. Registry once the continuation' +
    ' application application has been submitted.'

  /** Whether we have a looked-up business. */
  get haveLookupBusiness (): boolean {
    return !isEqual(this.business, {})
  }

  /** The incorporation number in BC (eg, A1234567). */
  get incorporationNumber (): string {
    return this.business.businessIdentifier
  }

  /** The home jurisdiction. */
  get homeJurisdiction (): string {
    const hj = this.business.homeJurisdiction
    if (hj?.country) {
      const country = getName(hj.country)
      const region = (hj.region === 'FEDERAL' ? 'Federal' : hj.region)
      if (region) return `${region}, ${country}`
      return country
    }
    return null
  }

  /** The business name in BC. */
  get businessName (): string {
    return this.business.businessLegalName
  }

  /** The business number (aka tax id). */
  get businessNumber (): string {
    return this.business.taxId
  }

  /** The incorporation date in the home jurisdiction. */
  get incorporationDate (): string {
    // FUTURE: format date as needed
    return this.business.incorporationDate
  }

  /** Whether the business is Active (otherwise it's Historical). */
  get isBusinessActive (): boolean {
    return (this.business.status === EntityStates.ACTIVE)
  }

  mounted (): void {
    // set existing business info object from the store, if it exists
    if (this.getExistingBusinessInfo) this.business = this.getExistingBusinessInfo

    // if mode is LOOKUP, set this component to active (which hides the other component)
    if (this.business.mode === 'LOOKUP') this.active = true
  }

  async setBusiness (result: BusinessLookupResultIF): Promise<void> {
    // FUTURE: fetch extra business data from COLIN and add to business object
    // NOTE: fetch for both active and historical businesses
    // const businessInfo = await LegalServices.fetchColinBusinessInfo(business.identifier)
    //   .catch(() => {})

    // FUTURE: convert FD to FEDERAL and add other COLIN conversions here

    this.business = {
      homeJurisdiction: null, // get from COLIN
      businessIdentifier: result.identifier,
      businessLegalName: result.name,
      identifier: null, // get from COLIN
      incorporationDate: null, // get from COLIN
      legalName: null, // get from COLIN
      mode: 'LOOKUP',
      status: result.status,
      taxId: result.bn?.substring(0, 9) || null
    }
    this.setExistingBusinessInfo(this.business)
    this.active = true
  }

  /** Resets this component back to its initial state. */
  reset () {
    this.business = {} as unknown as ExistingBusinessInfoIF
    this.setExistingBusinessInfo(this.business)
    // set this component to inactive (which shows the other component)
    this.active = false
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async fileSelected (file): Promise<void> {
    // *** TODO: finish implementing -- see UploadMemorandum.vue
    if (file) {
      // add reactive property to business object
      this.$set(this.business, 'affidavitFileKey', '123')
    } else {
      // delete the affidavit property if the file is cleared
      this.$delete(this.business, 'affidavitFileKey')
      // FUTURE: should also delete the file from Minio
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isFileUploadValidFn (val): void {
    // *** TODO: implement -- see UploadMemorandum.vue
  }

  @Watch('business.isUlc')
  onIsUlcChanged (val: boolean): void {
    // delete the affidavit property if the business is not a ULC
    if (!val) {
      delete this.business.affidavitFileKey
    }
  }

  @Watch('business', { deep: true })
  @Emit('valid')
  private onComponentValid (): boolean {
    // this component is valid if we have looked up an active business
    // and we have the affidavit if the business in the home jurisdiction is ULC
    // and the user has checked the confirmation
    return (
      this.haveLookupBusiness &&
      this.isBusinessActive &&
      ((this.business.isUlc === false) || !!this.business.affidavitFileKey) &&
      (this.business.isConfirmed === true)
    )
  }

  @Watch('active', { immediate: true })
  @Emit('active')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private onActiveChanged (val: boolean): void {}
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

// set style for all root labels
label {
  font-weight: bold;
  color: $gray9;
}

// add whitespace between the first and second columns
.col-sm-3 {
  padding-right: 1rem !important;
}

// disable the clickable v-textfield label
:deep(.incorporation-number label) {
  pointer-events: none;
}

// style the radio buttons
:deep(.v-radio) {
  background: rgba(0, 0, 0, 0.06); // same as Vuetify
  height: 3.5rem;
  padding: 1rem;
  width: 47%;

  label {
    font-weight: normal;
    color: $gray7;
  }
}

// align the checkbox with its label
:deep(.v-input--checkbox .v-input__slot) {
  align-items: flex-start;
}

// style the checkbox label
:deep(.v-input--checkbox label) {
  margin-top: 1px;
  font-size: $px-14;
  color: $gray9;
}

ul {
  list-style: none;
  color: $gray7;

  li::before {
    content: "\2022";
    display: inline-block;
    width: 1.5em;
    margin-left: -1.5em;
    padding-left: 0.25rem;
  }
}
</style>
