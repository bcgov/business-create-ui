<template>
  <!-- FUTURE: update layout to match other components -->
  <v-card flat id="care-and-custody-select" class="rounded-4 pt-11">
    <div class="section-container py-6 px-8 " :class="{ 'invalid-section': showErrorSummary }">
      <v-row no-gutters>
        <v-col cols="12" sm="3">
          <label class="care-and-custody-title title-label">Care and Custody<br>of Records</label>
        </v-col>
        <v-col cols="12" sm="9">
          <v-radio-group
            column class="pt-0 mt-0 care-and-custody-option-list"
            v-model="liquidatorOrCustodian"
            @change="changeCareAndCustodyType"
          >
            <v-radio id="liquidator-radio-btn" :value="RoleTypes.LIQUIDATOR">
              <template slot="label">
                <span class="care-and-custody-option">
                  A <strong>Liquidator</strong> has been appointed for the care and custody of the
                  Cooperative Association's records
                </span>
              </template>
            </v-radio>
            <v-radio id="custodian-radio-btn" :value="RoleTypes.CUSTODIAN">
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
import { RoleTypes } from '@/enums'

@Component
export default class CareAndCustodySelect extends Vue {
  @Prop({ default: false })
  readonly showErrorSummary: boolean

  readonly RoleTypes = RoleTypes

  private liquidatorOrCustodian: RoleTypes = null

  private changeCareAndCustodyType (): void {
    // Todo: Apply option to store when required
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.care-and-custody-title {
  font-size: $px-16;
  font-weight: bold;
  color: $gray9;
}

.care-and-custody-option-list {
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
