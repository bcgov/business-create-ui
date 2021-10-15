<template>
  <v-card flat class="rounded-4 py-2">
    <div class="section-container">
      <v-row no-gutters>
        <v-col md="3" class="pr-6">
          <label>{{ getCompanyDisplayName }}</label>
        </v-col>
        <v-col md="9">
          <div class="company-name">{{ getBusinessLegalName }}</div>
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
          <label>Address</label>
        </v-col>
        <v-col md="4">
          <label class="mailing-address-header">Mailing Address</label>
          <mailing-address
            v-if="!isEmptyAddress(getBusiness.officeAddress.mailingAddress)"
            :address="getBusiness.officeAddress.mailingAddress"
            :editing="false"
          />
          <div v-else>(Not entered)</div>
        </v-col>
        <v-col md="4">
          <label class="mailing-address-header">Delivery Address</label>
          <delivery-address
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

    <div v-if="isPremiumAccount" id='folio-number' class="section-container">
      <v-row no-gutters>
        <v-col md="3" class="pr-6">
          <label>Folio or Reference Number</label>
        </v-col>
        <v-col md="9">
          <div id="lbl-folio-number">{{ getAccountFolioNumber || 'Not entered' }}</div>
        </v-col>
      </v-row>
    </div>

    <v-divider class="mx-8" />

    <div class="section-container">
      <ContactInfo
        :businessContact="businessContact"
        :disableActions="isSummary"
        :customMsg="contactInfoMsg"
        @contactInfoChange="onContactInfoChange($event)"
      />
    </div>
  </v-card>
</template>

<script lang="ts">
// Libraries
import { Component, Mixins, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'

// Services
import { AuthServices } from '@/services'

// Interfaces
import { ActionBindingIF, AddressIF, BusinessContactIF, BusinessIF } from '@/interfaces'

// Components
import { BusinessContactInfo, OfficeAddresses } from '@/components/DefineCompany'
import { ContactInfo } from '@bcrs-shared-components/contact-info'

// Mixins
import { CommonMixin, EntityFilterMixin, EnumMixin } from '@/mixins'

// Enums
import { CoopType } from '@/enums'
import { isEmpty } from 'lodash'
import BaseAddress from 'sbc-common-components/src/components/BaseAddress.vue'

@Component({
  components: {
    BusinessContactInfo,
    ContactInfo,
    OfficeAddresses,
    'delivery-address': BaseAddress,
    'mailing-address': BaseAddress
  }
})
export default class AssociationDetails extends Mixins(CommonMixin, EntityFilterMixin, EnumMixin) {
  @Prop({ default: false })
  private readonly isSummary: boolean

  // Global getters
  @Getter getApprovedName!: string
  @Getter getAccountFolioNumber!: string
  @Getter getBusinessId!: string
  @Getter getBusiness!: BusinessIF
  @Getter getCompanyDisplayName!: string
  @Getter getCooperativeType!: CoopType
  @Getter getBusinessLegalName!: string
  @Getter getUserEmail!: string
  @Getter getUserPhone!: string
  @Getter isPremiumAccount!: boolean

  // Global setters
  @Action setUserEmail!: ActionBindingIF
  @Action setUserPhone: ActionBindingIF

  private contactInfoMsg = `Registered Office Contact Information is required for dissolution documents delivery.
  Any changes made will be applied immediately.`

  /** The entity description.  */
  private get entityDescription (): string {
    return `${this.getCorpTypeDescription(this.getEntityType)}`
  }

  /** The business contact info. */
  private get businessContact (): BusinessContactIF {
    return {
      email: this.getUserEmail,
      phone: this.getUserPhone
    }
  }

  /** Whether the address object is empty. */
  private isEmptyAddress (address: AddressIF): boolean {
    return isEmpty(address)
  }

  /** Event handler for contact information changes. */
  private async onContactInfoChange (event: BusinessContactIF): Promise<void> {
    await AuthServices.updateContactInfo(this.getBusinessId, event).then(response => {
      this.setUserEmail(response.email)
      this.setUserPhone(response.phone)
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
}

.company-name {
  font-size: 1.375rem;
  font-weight: bold;
  color:$gray9
}
</style>
