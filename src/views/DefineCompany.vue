<template>
  <div>
    <section>
      <header>
        <h2>1. Company Name</h2>
      </header>
      <v-card flat class="step-container">
        <div class="meta-container">
          <label>Name Request</label>

          <div class="value name-request">
            <p>Generate a Name Request (NR):</p>

            <v-container id="business-buttons-container" class="list-item justify-space-between">
              <v-btn id="select-bc-btn" large color="primary" :disabled="isEntityType" @click="onClickBC()">
                <span class="font-weight-bold">Benefit Company NR</span>
              </v-btn>

              <v-btn id="select-cp-btn" large color="success" :disabled="isEntityType" @click="onClickCP()">
                <span class="font-weight-bold">Cooperative Association NR</span>
              </v-btn>

              <v-btn id="reset-btn" large :disabled="!isEntityType" @click="onClickReset()">
                <v-icon>mdi-undo</v-icon>
                <span>Reset</span>
              </v-btn>
            </v-container>
          </div>
        </div>
      </v-card>
    </section>
    <p></p>
    <section>
      <header>
        <h2>3. Business Contact Information</h2>
      </header>
      <BusinessContactInfo
        :initialValue="businessContact"
        :isEditing="true"
        :showErrors="showErrors"
        @contactInfoChange="onBusinessContactInfoChange($event)"
        @contactInfoFormValidityChange="onBusinessContactFormValidityChange($event)"
      />
    </section>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Vue } from 'vue-property-decorator'
import { Getter, Action, State } from 'vuex-class'

// Interfaces
import { GetterIF, ActionBindingIF, BusinessContactIF } from '@/interfaces'

// Enums
import { EntityTypes } from '@/enums'

// Components
import { BusinessContactInfo } from '@/components/DefineCompany'

@Component({
  components: {
    BusinessContactInfo
  }
})
export default class DefineCompany extends Vue {
  // State
  @State(state => state.stateModel.defineCompanyStep.businessContact)
  readonly businessContact!: BusinessContactIF

  // Global getters
  @Getter isEntityType!: GetterIF

  // Global actions
  @Action setEntityType!: ActionBindingIF
  @Action setBusinessContact!: ActionBindingIF
  @Action setDefineCompanyStepValidity!: ActionBindingIF

  /**
   * Method called when Benefit Company button is clicked.
   */
  private onClickBC (): void {
    this.setEntityType(EntityTypes.BCOMP)

    // TODO: implement this instead of above?
    // this.setNameRequestData({
    //   entityType: EntityTypes.BCOMP,
    //   companyName: 'XYZ Inc.',
    //   companyNumber: 'NR1234567'
    // })
  }

  /**
   * Method called when Cooperative Association button is clicked.
   */
  private onClickCP (): void {
    this.setEntityType(EntityTypes.COOP)

    // TODO: implement this instead of above?
    // this.setNameRequestData({
    //   entityType: EntityTypes.COOP,
    //   companyName: 'XYZ Inc.',
    //   companyNumber: 'NR1234567'
    // })
  }

  /**
   * Method called when Reset Entity Type button is clicked.
   */
  private onClickReset (): void {
    this.setEntityType(null)
  }

  private onBusinessContactInfoChange (businessContact: BusinessContactIF): void {
    this.setBusinessContact(businessContact)
  }

  private onBusinessContactFormValidityChange (validity: boolean): void {
    this.setDefineCompanyStepValidity(validity)
  }

  private get showErrors (): boolean {
    return Boolean(this.$route.query.showErrors)
  }
}
</script>

<style lang="scss" scoped>
.step-container {
  margin-top: 1rem;
  padding: 1.25rem;
}

.value.name-request {
  width: 100%;
  min-width: 24rem;
}

.meta-container {
  display: flex;
  flex-flow: column nowrap;
  position: relative;

  > label:first-child {
    font-weight: 700;
  }
}

@media (min-width: 768px) {
  .meta-container {
    flex-flow: row nowrap;

    > label:first-child {
      flex: 0 0 auto;
      padding-right: 2rem;
      width: 12rem;
    }
  }
}

#business-buttons-container {
  .v-btn + .v-btn {
    margin-left: 0.5rem;
  }
}
</style>
