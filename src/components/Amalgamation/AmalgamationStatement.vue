<template>
  <v-card
    id="amalgamation-statement"
    flat
    class="py-8 px-6"
  >
    <v-row>
      <v-col
        cols="12"
        sm="3"
        class="pr-4"
      >
        <label>
          Amalgamation Statement
        </label>
      </v-col>

      <v-col
        cols="12"
        sm="9"
        class="pr-0"
      >
        <v-radio-group
          v-model="courtApproval"
          class="mt-0 pt-0"
          hide-details="auto"
          @change="setCourtApproval()"
        >
          <v-radio
            class="radio-button"
            label="With Court Approval"
            :value="true"
          />
          <p
            class="ml-8 mb-5 statement-text"
          >
            This amalgamation has been approved by the court and a copy of the
            entered court order approving the amalgamation has been obtained
            and has been deposited in the records office of each of the
            amalgamating companies.
          </p>

          <v-radio
            class="radio-button"
            label="Without Court Approval"
            :value="false"
          />
          <p
            class="ml-8 mb-0 statement-text"
          >
            This amalgamation has been effected without court approval.
            A copy of all of the required affidavits under section 277(1)
            have been obtained and the affidavit obtained from each
            amalgamating company has been deposited in that company’s
            records office.
          </p>
        </v-radio-group>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Emit } from 'vue-property-decorator'
import { AmalgamationStateIF } from '@/interfaces/store-interfaces/state-interfaces/amalgamation-state-interface'
import { Getter } from 'pinia-class'
import { useStore } from '@/store/store'

@Component({})
export default class AmalgamationStatement extends Vue {
  @Getter(useStore) getAmalgamationCourtApproval!: boolean

  // Local properties
  courtApproval: AmalgamationStateIF['courtApproval'] = null

  /** Called when component is mounted. */
  mounted (): void {
    this.courtApproval = this.getAmalgamationCourtApproval
    if (this.courtApproval !== null) {
      this.amalgamationStatementValid(true)
    }
  }

  /**
   * Emit a value and event to the parent to handle updating.
   * @param courtApproval The value to emit.
   */
  @Emit('update')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private courtApprovalUpdate (courtApproval: boolean): void {}

  /**
   * Emit a value and event to the parent to handle validation.
   * @param valid The value to emit.
   */
  @Emit('valid')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private amalgamationStatementValid (valid: boolean): void {}

  /** Update court approval and validation when either option is being selected. */
  setCourtApproval (): void {
    this.courtApprovalUpdate(this.courtApproval)
    this.amalgamationStatementValid(true)
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

#amalgamation-statement {
  font-size: $px-16;
}

.statement-text {
  color: $gray7;
  font-size: $px-16;
}

:deep() {
  // Fix text color for all the radio buttons
  .radio-button {
    label {
      color: $gray7;
      }
  }
}

label {
  font-weight: bold;
  color: $gray9;
}

</style>
