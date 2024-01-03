<template>
  <v-card
    id="amalgamation-statement"
    flat
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
      >
        <v-radio-group
          v-model="courtApproval"
          class="mt-0 pt-0"
          @change="setCourtApproval()"
        >
          <v-radio
            class="radio-button"
            label="With Court Approval"
            :value="true"
          />
          <div
            class="ml-8 statement-text"
          >
            This amalgamation has been approved by the court and a copy of the
            entered court order approving the amalgamation has been obtained
            and has been deposited in the records office of each of the
            amalgamating companies.
          </div>

          <v-radio
            class="pt-4 radio-button"
            label="Without Court Approval"
            :value="false"
          />
          <div
            class="ml-8 statement-text"
          >
            This amalgamation has been effected without court approval.
            A copy of all of the required affidavits under section 277(1)
            have been obtained and the affidavit obtained from each
            amalgamating company has been deposited in that company’s
            records office.
          </div>
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
    if (this.getAmalgamationCourtApproval != null) {
      this.courtApproval = this.getAmalgamationCourtApproval
    }
  }

  // Emit a boolean which is whether the court approval have been selected
  @Emit('update')
  private courtApprovalUpdate (): boolean {
    console.log(this.courtApproval)
    return this.courtApproval
  }

  // Emit a boolean (validation) which is either option being selected
  @Emit('valid')
  private amalgamationStatementValid (event: boolean): boolean {
    return event
  }

  // Once either option being selected, update court approval and validation
  setCourtApproval (): void {
    this.courtApprovalUpdate()
    this.amalgamationStatementValid(true)
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

#amalgamation-statement {
  padding: 1.25rem;
  line-height: 1.2rem;
  font-size: 1rem;
}

.statement-text {
  color: $gray7;
}

label {
  font-weight: bold;
}

</style>
