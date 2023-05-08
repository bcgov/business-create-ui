<template>
  <div id="restoration-type">
    <div class="section-container" :class="{ 'invalid-section': invalidSection }">
      <v-row no-gutters>
        <v-col cols="12" sm="3" class="pr-4">
          <label :class="{ 'error-text': invalidSection }">
            <strong>Restoration Type</strong>
          </label>
        </v-col>

        <v-col cols="12" sm="9">
          <v-radio-group
            class="mt-0 pt-0"
            v-model="selectRestorationType"
            @change="changeRestorationType()"
          >
            <v-radio
              class="radio-button"
              id="full-radio-button"
              label="Full Restoration"
              :value=RestorationTypes.FULL />

            <!-- Relationship To Company Checkboxes -->
            <v-expand-transition>
              <div v-if="isFullRestorationFiling">
                <div class="ml-8 tooltip-text" :class="{ 'error-text': invalidSection }">
                  Please select
                  <v-tooltip content-class="top-tooltip" transition="fade-transition" top>
                    <template v-slot:activator="{ on, attrs }">
                      <span class="dotted-underline" v-bind="attrs" v-on="on">
                        applicant's relationship
                      </span>
                    </template>
                    Full restoration application must be related to the dissolved business.
                  </v-tooltip>
                  to the company at the time the company was dissolved:
                </div>
                <RelationshipsPanel
                  :draftRelationships="getRestoration.relationships"
                  @changed="setRestorationRelationships($event)"
                  @valid="setRestorationTypeValid($event)"
                />
              </div>
            </v-expand-transition>

            <v-radio
              class="pt-4 radio-button"
              id="limited-radio-button"
              label="Limited Restoration"
              :value=RestorationTypes.LIMITED />

            <!-- Limited Restoration Radio Panel -->
            <v-expand-transition>
              <div v-if="isLimitedRestorationFiling">
                <LimitedRestorationPanel
                  :currentDate="getCurrentDate"
                  :expiryDate="getRestoration.expiry"
                  @expiry="setRestorationExpiry($event)"
                  @valid="setRestorationTypeValid($event)"
                />
              </div>
            </v-expand-transition>
          </v-radio-group>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import { DateMixin, CommonMixin } from '@/mixins'
import { Getter, Action } from 'pinia-class'
import { useStore } from '@/store/store'
import { RestorationTypes } from '@/enums'
import { ActionBindingIF, RestorationStateIF } from '@/interfaces'
import { RelationshipsPanel } from '@bcrs-shared-components/relationships-panel'
import { LimitedRestorationPanel } from '@bcrs-shared-components/limited-restoration-panel'

@Component({
  components: {
    RelationshipsPanel,
    LimitedRestorationPanel
  }
})
export default class RestorationType extends Mixins(DateMixin, CommonMixin) {
  @Getter(useStore) getCurrentDate!: string
  @Getter(useStore) getRestoration!: RestorationStateIF
  @Getter(useStore) getRestorationTypeValid!: boolean
  @Getter(useStore) getShowErrors!: boolean
  @Getter(useStore) isLimitedRestorationFiling!: boolean
  @Getter(useStore) isFullRestorationFiling!: boolean

  @Action(useStore) setRestorationExpiry!: ActionBindingIF
  @Action(useStore) setRestorationRelationships!: ActionBindingIF
  @Action(useStore) setRestorationType!: ActionBindingIF
  @Action(useStore) setRestorationTypeValid!: ActionBindingIF

  // Local properties
  selectRestorationType: RestorationTypes = null

  // Enum for template
  readonly RestorationTypes = RestorationTypes

  /** This section's validity state (when prompted by app). */
  get invalidSection (): boolean {
    return (this.getShowErrors && !this.getRestorationTypeValid)
  }

  /**
   * Sets the selected Limited Restoration choice.
   * @param val the value of the selected radio button
   */
  changeRestorationType (): void {
    this.setRestorationType(this.selectRestorationType)
    if (this.isLimitedRestorationFiling) {
      this.setRestorationRelationships([])
    } else {
      this.setRestorationExpiry(null)
    }
  }

  /** Initially and when restoration type changes, updates local property. */
  @Watch('getRestoration.type', { immediate: true })
  private onRestorationType (val: RestorationTypes): void {
    this.selectRestorationType = val
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';
.tooltip-text {
  color: $gray7;
}

:deep() {
  // Fix font of all the radio buttons.
  .radio-button {
    label {
      font-weight: normal;
      color: $gray7;
    }
  }

  // Fix font of the relationships panel & center text with the checkboxes.
  .v-input--checkbox .v-input__control .v-input__slot .v-label {
    color: $gray7;
    font-weight: normal;
    align-items: stretch;
    height: 1.25rem;
  }
}
</style>
