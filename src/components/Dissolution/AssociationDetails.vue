<template>
  <v-card flat class="rounded-4 py-2">
    <div class="section-container">
      <v-row no-gutters>
        <v-col md="3" class="pr-6">
          <label v-if="isTypeCoop">Cooperative Association</label>
          <label v-else>Company</label>
        </v-col>
        <v-col md="9">
          <div class="company-name">{{ entityName }}</div>
          <div class="my-1">
            <span>{{ entityDescription }}</span>
          </div>
          <div>
            <span>{{ getBusinessId }}</span>
          </div>
        </v-col>
      </v-row>
    </div>

    <v-divider class="mx-8" />

    <div class="section-container">
      <v-row no-gutters>
        <v-col md="3">
          <label>{{addressLabel}}</label>
        </v-col>
        <v-col md="4">
          <label class="mailing-address-header">Mailing Address</label>
          <MailingAddress
            v-if="!isEmptyAddress(getBusiness.officeAddress.mailingAddress)"
            :address="getBusiness.officeAddress.mailingAddress"
            :editing="false"
          />
          <div v-else>(Not entered)</div>
        </v-col>
        <v-col md="4">
          <label class="mailing-address-header">Delivery Address</label>
          <DeliveryAddress
            v-if="!isEmptyAddress(getBusiness.officeAddress.deliveryAddress) &&
             !isSame(getBusiness.officeAddress.mailingAddress, getBusiness.officeAddress.deliveryAddress)"
            :address="getBusiness.officeAddress.deliveryAddress"
            :editing="false"
          />
          <div v-else-if="isEmptyAddress(getBusiness.officeAddress.deliveryAddress)">(Not entered)</div>
          <div v-else>Same as Mailing Address</div>
        </v-col>
      </v-row>
    </div>

    <v-divider class="mx-8" v-if="isPremiumAccount" />

    <div v-if="isPremiumAccount" id="folio-number" class="section-container">
      <v-row no-gutters>
        <v-col md="3" class="pr-6">
          <label>Folio or Reference Number</label>
        </v-col>
        <v-col md="9">
          <div id="lbl-folio-number">{{ getFolioNumber || 'None' }}</div>
        </v-col>
      </v-row>
    </div>

    <v-divider class="mx-8" />

    <div class="section-container">
      <ContactInfo
        :businessContact="getBusinessContact"
        :disableActions="isSummary"
        :customMsg="contactInfoMsg"
        editLabel="Change"
        @update="onContactInfoChange($event)"
      />
    </div>
  </v-card>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { AuthServices } from '@/services'
import { ActionBindingIF, AddressIF, BusinessContactIF, BusinessIF } from '@/interfaces'
import { ContactInfo } from '@bcrs-shared-components/contact-info'
import BaseAddress from 'sbc-common-components/src/components/BaseAddress.vue'
import OfficeAddresses from '@/components/common/OfficeAddresses.vue'
import { CommonMixin, EntityFilterMixin, EnumMixin } from '@/mixins'
import { CoopType } from '@/enums'
import { isEmpty } from 'lodash'

@Component({
  components: {
    ContactInfo,
    OfficeAddresses,
    DeliveryAddress: BaseAddress,
    MailingAddress: BaseAddress
  }
})
export default class AssociationDetails extends Mixins(CommonMixin, EntityFilterMixin, EnumMixin) {
  @Prop({ default: false })
  readonly isSummary: boolean

   @Prop({ default: 'Address' })
  readonly addressLabel: ''

  // Global getters
  @Getter getApprovedName!: string
  @Getter getFolioNumber!: string
  @Getter getBusinessId!: string
  @Getter getBusiness!: BusinessIF
  @Getter getBusinessContact!: BusinessContactIF
  @Getter getCompanyDisplayName!: string
  @Getter getCooperativeType!: CoopType
  @Getter getBusinessLegalName!: string
  @Getter isPremiumAccount!: boolean
  @Getter isTypeCoop!: boolean

  // Global setters
  @Action setBusinessContact!: ActionBindingIF

  private contactInfoMsg = `Registered Office Contact Information is required for dissolution documents delivery.
  Any changes made will be applied immediately.`

  /** The entity name. */
  private get entityName (): string {
    return this.getBusinessLegalName || `${this.getCorpTypeNumberedDescription(this.getEntityType)}`
  }

  /** The entity description.  */
  private get entityDescription (): string {
    return `${this.getCorpTypeDescription(this.getEntityType)}`
  }

  /** Whether the address object is empty. */
  private isEmptyAddress (address: AddressIF): boolean {
    return isEmpty(address)
  }

  /** Event handler for contact information changes. */
  private async onContactInfoChange (event: BusinessContactIF): Promise<void> {
    await AuthServices.updateContactInfo(this.getBusinessId, event).then(response => {
      this.setBusinessContact(response)
    }).catch(error => {
      this.$root.$emit('save-error-event', error)
    })
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.section-container {
  padding: 1.5rem 2rem;

  .mailing-address-header {
    font-size: $px-14;
  }

  ::v-deep .subtitle {
    font-size: $px-14;
    font-weight: bold;
  }
}

.company-name {
  font-size: $px-22;
  font-weight: bold;
  color:$gray9
}
</style>
