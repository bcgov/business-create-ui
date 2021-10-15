<template>
  <div>
    <div v-if="isSummary" class="dissolution-summary-description" v-html="dissolutionStatementDescription"></div>
    <v-card v-else flat class="rounded-4">
      <div class="section-container" :class="{ 'invalid-section': showErrorSummary }">
        <v-row no-gutters>
          <v-col md="3">
            <label class="dissolution-statement-title">Dissolution Statement</label>
          </v-col>
          <v-col md="9">
            <v-radio-group v-model="dissolutionStatementType"
                        @change="changeDissolutionStatementType"
                        class="dissolution-statement-option-list"
            >
              <v-radio v-for="(item, index) in getDissolutionStatements"
                        :key="index" :value="item.code" :id="`dissolution-statement-${item.code}`"
              >
                <template slot="label">
                  <div v-html="item.description" class="dissolution-statement-option" />
                </template>
              </v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
      </div>
    </v-card>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'

// Interfaces & enums
import { ActionBindingIF, DissolutionStatementIF, KeyValueIF } from '@/interfaces'
import { DissolutionStatementTypes } from '@/enums'

@Component
export default class DissolutionStatement extends Vue {
  @Prop({ default: false })
  private readonly showErrorSummary: boolean

  @Prop({ default: false })
  private readonly isSummary: boolean

  // Global getters
  @Getter getDissolutionStatements!: Array<KeyValueIF>
  @Getter getDissolutionStatementStep!: DissolutionStatementIF

  // Global setters
  @Action setIgnoreChanges!: ActionBindingIF
  @Action setDissolutionStatementStepData!: ActionBindingIF

  private dissolutionStatementType: DissolutionStatementTypes = null

  // Lifecycle methods
  private created (): void {
    // temporarily ignore data changes
    this.setIgnoreChanges(true)
    if (this.getDissolutionStatementStep) {
      this.dissolutionStatementType = this.getDissolutionStatementStep.dissolutionStatementType
    }
    // watch data changes once page has loaded (in next tick)
    Vue.nextTick(() => {
      this.setIgnoreChanges(false)
    })
  }

  /** The dissolution statement description. */
  private get dissolutionStatementDescription (): string {
    return this.getDissolutionStatements
      .find(x => x.code === this.getDissolutionStatementStep.dissolutionStatementType)?.description ||
      '(Not entered)'
  }

  private changeDissolutionStatementType (): void {
    this.setDissolutionStatementStepData({
      valid: !!this.dissolutionStatementType,
      dissolutionStatementType: this.dissolutionStatementType
    })
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

.dissolution-statement-title {
  font-size: 1rem;
  font-weight: bold;
  color: $gray9;
}

.dissolution-statement-option-list {
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

.dissolution-statement-option {
  color: $gray7;
  line-height: 1.5rem;
}

</style>
