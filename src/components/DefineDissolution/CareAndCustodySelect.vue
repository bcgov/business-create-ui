<template>
  <v-card flat class="rounded-4">
    <div class="section-container pt-11" :class="{ 'invalid-section': showErrorSummary }">
      <v-row no-gutters>
        <v-col cols="12" md="3" lg="3">
          <label class="care-and-custody-title title-label">Care and Custody <br>of Records</label>
        </v-col>
        <v-col cols="12" md="9" lg="9">
          <v-radio-group
            column class="pt-0 mt-0 case-and-custody-option-list"
            v-model="liquidatorOrCustodian"
            @change="changeCareAndCustodyType"
          >
            <v-radio :value=RoleTypes.LIQUIDATOR>
              <template slot="label">
                <span class="care-and-custody-option">
                  A <strong>Liquidator</strong> has been appointed for the care and custody of the
                  Cooperative Association's records
                </span>
              </template>
            </v-radio>
            <v-radio :value=RoleTypes.CUSTODIAN>
              <template slot="label">
                <span class="care-and-custody-option">
                  A <strong>Custodian of Records</strong> has been appointed for the care and custody of the Cooperative
                  Association's records.
                </span>
              </template>
            </v-radio>
          </v-radio-group>
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>

<script lang="ts">
// Libraries
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'

// Interfaces & enums
import { ActionBindingIF, DissolutionStatementIF, KeyValueIF, RolesIF } from '@/interfaces'
import { DissolutionStatementTypes, RoleTypes } from '@/enums'

@Component
export default class CareAndCustodySelect extends Vue {
  @Prop({ default: false })
  private readonly showErrorSummary: boolean

  // Global setters
  @Action setDissolutionStatementStepData!: ActionBindingIF

  private readonly RoleTypes = RoleTypes
  private liquidatorOrCustodian: RoleTypes = null

  private changeCareAndCustodyType (): void {
    // Todo: Apply option to store when required
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

.care-and-custody-title {
  font-size: 1rem;
  font-weight: bold;
  color: $gray9;
}

.case-and-custody-option-list {
  padding-top: 0;
  margin-top: 0;

  ::v-deep .v-input--selection-controls__input {
    margin-right: 1rem;
  }

  .v-radio {
    align-items: start;
  }

  .v-radio:not(:first-child) {
    padding-top: 1.5rem;
  }
}

.care-and-custody-option {
  color: $gray7;
  line-height: 1.5rem;
  font-weight: normal;
}
</style>
