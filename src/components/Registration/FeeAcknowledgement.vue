<template>
  <v-card flat id="fee-acknowledgement" :class="{ 'invalid-section': invalidSection }">
    <v-row no-gutters>
      <v-col cols="3">
        <label :class="{'error-text': invalidSection}">Acknowledgement</label>
      </v-col>
      <v-col cols="9">
        <v-checkbox
          hide-details
          id="fee-acknowledgement-checkbox"
          :input-value="getRegistration.feeAcknowledgement"
          @change="setRegistrationFeeAcknowledgement($event)"
        >
          <template slot="label">
            <div class="acknowledge-stmt" :class="{'error-text': invalidSection}">
              I acknowledge that additional fees may be required to change this registration after payment
              has been made.
            </div>
          </template>
        </v-checkbox>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { ActionBindingIF, RegistrationStateIF } from '@/interfaces'

@Component({})
export default class FeeAcknowledgement extends Vue {
  @Getter getRegistration!: RegistrationStateIF
  @Getter getValidateSteps!: boolean

  @Action setRegistrationFeeAcknowledgement!: ActionBindingIF

  get invalidSection (): boolean {
    return this.getValidateSteps && !this.getRegistration.feeAcknowledgement
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

label {
  font-size: $px-16;
  font-weight: bold;
  color: $gray9;
}

.acknowledge-stmt {
  display: inline;
  font-size: $px-14;
  color: $gray7;
  font-weight: normal;
}

.v-input--checkbox {
  margin-top: 0 !important;
  padding-top: 0 !important;
}

// Vuetify overrides
::v-deep .v-input--checkbox .v-input__slot {
  align-items: flex-start;
}
</style>
