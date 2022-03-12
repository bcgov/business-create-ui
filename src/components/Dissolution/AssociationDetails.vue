<template>
  <div id="association-details">
    <div class="section-container">
      <!-- Entity Name, etc -->
      <v-row no-gutters>
        <v-col cols="12" sm="3" class="pr-4">
          <label v-if="isTypeCoop">Cooperative Association</label>
          <label v-else>Company</label>
        </v-col>

        <v-col cols="12" sm="9" class="mt-n1">
          <label class="company-name">{{ entityName }}</label>
          <div class="my-1">
            <span>{{ entityDescription }}</span>
          </div>
          <div>
            <span>{{ getBusinessId }}</span>
          </div>
        </v-col>
      </v-row>
    </div>

    <v-divider class="mx-6" />

    <!-- Address -->
    <div class="section-container">
      <v-row no-gutters>
        <v-col cols="12" sm="3" class="pr-4">
          <label>Address</label>
        </v-col>

        <v-col cols="12" sm="4" class="pr-4">
          <label class="mailing-address-header">Mailing Address</label>
          <MailingAddress
            v-if="!isEmptyAddress(getBusiness.officeAddress.mailingAddress)"
            :address="getBusiness.officeAddress.mailingAddress"
            :editing="false"
          />
          <div v-else>(Not entered)</div>
        </v-col>

        <v-col cols="12" sm="4" class="pr-4">
          <label class="delivery-address-header">Delivery Address</label>
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

    <!-- Folio Number -->
    <template v-if="isPremiumAccount">
      <v-divider class="mx-6" />

      <div class="section-container">
        <v-row no-gutters>
          <v-col cols="12" sm="3" class="pr-4">
            <label>Folio or Reference Number</label>
          </v-col>

          <v-col cols="12" sm="9">
            <div id="lbl-folio-number">{{ getFolioNumber || '(Not entered)' }}</div>
          </v-col>
        </v-row>
      </div>
    </template>

    <v-divider class="mx-6" />

    <!-- Contact Info -->
    <div class="section-container">
      <ContactInfo
        :businessContact="getBusinessContact"
        :disableActions="isSummary"
        :customMsg="contactInfoMsg"
        editLabel="Change"
        @contactInfoChange="onContactInfoChange($event)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { AuthServices } from '@/services'
import { ActionBindingIF, AddressIF, BusinessContactIF, BusinessIF } from '@/interfaces'
import { ContactInfo } from '@bcrs-shared-components/contact-info'
import BaseAddress from 'sbc-common-components/src/components/BaseAddress.vue'
import OfficeAddresses from '@/components/common/OfficeAddresses.vue'
import { CommonMixin, EnumMixin } from '@/mixins'
import { CoopType, CorpTypeCd } from '@/enums'
import { isEmpty } from 'lodash'

@Component({
  components: {
    ContactInfo,
    OfficeAddresses,
    DeliveryAddress: BaseAddress,
    MailingAddress: BaseAddress
  }
})
export default class AssociationDetails extends Mixins(CommonMixin, EnumMixin) {
  @Prop({ default: false })
  readonly isSummary: boolean

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
  @Getter getEntityType!: CorpTypeCd

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

.mailing-address-header,
.delivery-address-header {
  font-size: $px-14;
}

.company-name {
  font-size: $px-22;
}
</style>
