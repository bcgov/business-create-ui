<template>
  <div id="fee-acknowledgement">
    <v-row no-gutters>
      <v-col cols="12" sm="3" class="pr-4">
        <label :class="{'error-text': invalidSection}">Acknowledgement</label>
      </v-col>
      <v-col cols="12" sm="9" class="pt-4 pt-sm-0">
        <v-checkbox
          id="fee-acknowledgement-checkbox"
          :input-value="getRegistration.feeAcknowledgement"
          @change="setRegistrationFeeAcknowledgement($event)"
          hide-details
        >
          <template v-slot:label>
            <div class="acknowledge-stmt" :class="{'error-text': invalidSection}">
              I acknowledge that additional fees may be required to change this registration after payment
              has been made.
            </div>
          </template>
        </v-checkbox>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import { ActionBindingIF, RegistrationStateIF } from '@/interfaces'

@Component({})
export default class FeeAcknowledgement extends Vue {
  @Getter(useStore) getRegistration!: RegistrationStateIF
  @Getter(useStore) getValidateSteps!: boolean

  @Action(useStore) setRegistrationFeeAcknowledgement!: ActionBindingIF

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

// align checkbox with top of its label
:deep(.v-input--checkbox .v-input__slot) {
  align-items: flex-start;
}
</style>
