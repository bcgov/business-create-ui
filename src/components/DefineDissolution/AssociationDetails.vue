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

    <v-divider />

    <div class="section-container">
      <v-row no-gutters>
        <v-col md="3">
          <label>Address</label>
        </v-col>
        <v-col md="4">
          <label class="mailing-address-header"><strong>Mailing Address</strong></label>
          <mailing-address
            v-if="!isEmptyAddress(getBusiness.officeAddress.mailingAddress)"
            :address="getBusiness.officeAddress.mailingAddress"
            :editing="false"
          />
          <div v-else>(Not entered)</div>
        </v-col>
        <v-col md="4">
          <label class="mailing-address-header"><strong>Delivery Address</strong></label>
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

    <v-divider />

    <div v-if="isPremiumAccount" id='folio-number' class="section-container">
      <v-row no-gutters>
        <v-col md="3" class="pr-6">
          <label>Folio or Reference Number</label>
        </v-col>
        <v-col md="9">
          <div id="lbl-folio-number">{{ !!getFolioNumber ? getFolioNumber : 'Not entered' }}</div>
        </v-col>
      </v-row>
    </div>

    <v-divider />

    <div class="section-container">
      <ContactInfo
        :businessContact="businessContact"
        @contactInfoChange="onContactInfoChange($event)"
      />
    </div>
  </v-card>
</template>

<script lang="ts">
// Libraries
import { Component, Mixins } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'

// Interfaces
import { ActionBindingIF, AddressIF, BusinessContactIF, BusinessIF } from '@/interfaces'

// Components
import { BusinessContactInfo, OfficeAddresses } from '@/components/DefineCompany'
import { ContactInfo } from '@bcrs-shared-components/contact-info'

// Mixins
import { CommonMixin, EntityFilterMixin, EnumMixin } from '@/mixins'

// Enums
import { CoopType, RouteNames } from '@/enums'
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
  // Global getters
  @Getter getApprovedName!: string
  @Getter getBusinessId!: string
  @Getter getBusiness!: BusinessIF
  @Getter getCompanyDisplayName!: string
  @Getter getCooperativeType!: CoopType
  @Getter getBusinessLegalName!: string
  @Getter getUserEmail!: string
  @Getter getUserPhone!: string
  @Getter getFolioNumber!: string
  @Getter isPremiumAccount!: boolean

  // Global setters
  @Action setUserEmail!: ActionBindingIF
  @Action setUserPhone: ActionBindingIF

  private folioNumber!: string // WHERE DO WE GET THIS..

  /** The entity description  */
  private get entityDescription (): string {
    return `${this.getCorpTypeDescription(this.getEntityType)}`
  }

  private get businessContact (): BusinessContactIF {
    return {
      email: this.getUserEmail,
      phone: this.getUserPhone
    }
  }

  // Enum for template
  readonly RouteNames = RouteNames

  /** Whether the address object is empty. */
  private isEmptyAddress (address: AddressIF): boolean {
    return isEmpty(address)
  }

  private onContactInfoChange (event: BusinessContactIF): void {
    this.setUserEmail(event.email)
    this.setUserPhone(event.phone)
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.section-container {
  padding: 1.5rem 2rem;
  font-size: 1rem;
  color: $gray7;
}

.company-name {
  font-size: 1.375rem;
  font-weight: bold;
  color:$gray9
}
</style>
