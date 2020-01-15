<template>
  <div>
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
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Vue } from 'vue-property-decorator'
import { Getter, Action } from 'vuex-class'

// Interfaces
import { GetterIF, ActionBindingIF } from '@/interfaces'

// Enums
import { EntityTypes } from '@/enums'

@Component({})
export default class DefineCompany extends Vue {
  // Global getters
  @Getter isEntityType!: GetterIF

  // Global actions
  @Action setEntityType!: ActionBindingIF

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
}
</script>

<style lang="scss">
.step-container {
  height: 15rem; // FOR TESTING ONLY
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
