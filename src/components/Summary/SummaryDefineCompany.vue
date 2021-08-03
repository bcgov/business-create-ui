<template>
  <v-card flat>
    <div class="define-company-header">
      <v-icon color="#38598A">mdi-domain</v-icon>
      <label class="define-company-title"><strong>Your {{ getDisplayName }}</strong></label>
    </div>
    <section :class="{ 'invalid-section': !valid && getValidateSteps }">
      <div v-if="!valid" class="defineCompanyStepErrorMessage">
        <span>
          <v-icon color="error">mdi-information-outline</v-icon>
          <span class="error-text"> This step is not complete. </span>
          <router-link :to="{ path: `/${RouteNames.DEFINE_COMPANY}`, query: { showErrors: true } }">
            Return to this step to complete it.
          </router-link>
        </span>
      </div>
      <div class="section-container">
        <!--TODO: Replace container content with Name Request Summary when it is ready -->
        <v-layout row>
          <v-flex md4>
            <label><strong>Name</strong></label>
          </v-flex>
          <v-flex md8>
            <div class="company-name">{{ getApprovedName || '[Incorporation Number] B.C. Ltd.' }}</div>
            <div class="company-type">
              <span>{{ getEntityDescription }}</span>
            </div>
          </v-flex>
        </v-layout>
        <v-layout row v-if="getNameTranslations && getNameTranslations.length" class="mt-3">
          <v-flex md4>
            <label><strong>Name Translation</strong></label>
          </v-flex>
          <v-flex md8>
            <div v-for="(nameTranslation, index) in getNameTranslations" :key="`name_translation_${index}`">
              {{nameTranslation.name}}
            </div>
          </v-flex>
        </v-layout>
      </div>
      <v-divider/>
      <div class="section-container">
        <OfficeAddresses :inputAddresses="addresses" :isEditing="false" />
      </div>
      <v-divider/>
      <div class="section-container">
        <BusinessContactInfo :initialValue="businessContact" :isEditing="false" />
      </div>
      <div class="section-container" v-if="isPremiumAccount">
        <FolioNumber :initialValue="folioNumber" :isEditing="false" />
      </div>
    </section>
  </v-card>
</template>

<script lang="ts">
// Libraries
import { Component, Mixins } from 'vue-property-decorator'
import { Getter, State } from 'vuex-class'

// Interfaces
import { BusinessContactIF, GetterIF, IncorporationAddressIf, NameTranslationIF } from '@/interfaces'

// Components
import { FolioNumber, BusinessContactInfo, OfficeAddresses } from '@/components/DefineCompany'

// Mixins
import { EntityFilterMixin, EnumMixin } from '@/mixins'

// Enums
import { CorpTypeCd, RouteNames } from '@/enums'

@Component({
  components: {
    BusinessContactInfo,
    OfficeAddresses,
    FolioNumber
  }
})
export default class SummaryDefineCompany extends Mixins(EntityFilterMixin, EnumMixin) {
  // Getters
  @Getter getApprovedName!: GetterIF
  @Getter getDisplayName!: string
  @Getter getEntityType!: CorpTypeCd
  @Getter isPremiumAccount!: GetterIF
  @Getter getNameTranslations!: NameTranslationIF[]
  @Getter getValidateSteps!: boolean

  // Global state
  @State(state => state.stateModel.defineCompanyStep.valid)
  readonly valid!: boolean

  @State(state => state.stateModel.defineCompanyStep.businessContact)
  readonly businessContact!: BusinessContactIF

  @State(state => state.stateModel.defineCompanyStep.officeAddresses)
  readonly addresses!: IncorporationAddressIf

  @State(state => state.stateModel.defineCompanyStep.folioNumber)
  readonly folioNumber!: string

  /** The entity description  */
  private get getEntityDescription (): string {
    return `${this.getCorpTypeDescription(this.getEntityType)}`
  }

  // Entity Enum
  readonly RouteNames = RouteNames
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.defineCompanyStepErrorMessage {
  padding-top: 1.25rem;
  padding-left: 1.25rem;
  color: $primary-blue;
}

.section-container {
  padding-left: 2rem;
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
  font-size: 0.875rem;
}

.define-company-header {
  display: flex;
  background-color: $BCgovBlue5O;
  padding: 1.25rem;
}

.define-company-title {
 padding-left: 0.5rem;
}

.company-name {
  font-size: 1.375rem;
  font-weight: bold
}

.company-type{
  padding-top: 0.5rem
}

</style>
