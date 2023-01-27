<template>
  <v-card flat id="restoration-type">

    <v-row>
      <v-col cols="12" sm="3" class="pr-4">
        <label>Restoration Type</label>
      </v-col>

      <v-col cols="12" sm="9">
        <v-radio-group column class="radio-group" v-model="selectRestorationType">
          <v-radio label="Full Restoration" value="isFull" />
          <!-- Relationship To Company Checkboxes -->

          <v-expand-transition>
            <v-card flat v-if="isFull">
              <RelationshipsPanel/>
            </v-card>
          </v-expand-transition>

          <v-radio label="Limited Restoration" value="isLimited" />
          <!-- Limited Restoration Radio Panel -->
          <v-expand-transition>
            <v-card flat v-if="isLimited">
             <LimitedRestorationRadioPanel/>
            </v-card>
          </v-expand-transition>
        </v-radio-group>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">

import Vue from 'vue'
import { Component, Watch, Emit, Prop } from 'vue-property-decorator'
import { DateMixin, AddEditOrgPersonMixin } from '@/mixins'
import { ISLIMITEDRESTORATION } from '@/constants'
import { EffectiveDateTimeIF, FormIF } from '@/interfaces'
import { VuetifyRuleFunction } from '@/types'
import { Getter, Action } from 'vuex-class'
import RelationshipsPanel from '@/components/common/RelationshipsPanel.vue'
import LimitedRestorationRadioPanel from '@/components/common/LimitedRestorationRadioPanel.vue'
import RestorationTypeSummary from './RestorationTypeSummary.vue'
import { RestorationTypes } from '@/enums'

@Component({
  mixins: [
    DateMixin,
    AddEditOrgPersonMixin
  ],
  components: {
    RelationshipsPanel,
    LimitedRestorationRadioPanel,
    RestorationTypeSummary
  }
})
export default class RestorationType extends Vue {
  @Action setRestorationType!: ActionBindingIF
  @Action setRestorationExpiry!: ActionBindingIF

  // Local properties
  protected isFull = false
  protected isLimited = false
  protected selectRestorationType = ''

  /** Called when component is mounted. */
  mounted (): void {
  }

  /**
   * Set the selected Limited Restoration choice
   * @param val The value of the selected radio button
   */
  @Watch('selectRestorationType')
  private setLimitedRestorationChoice (val) {
    this.isLimited = val === ISLIMITEDRESTORATION
    this.isFull = !this.isLimited
    if (this.isLimited) {
      this.setRestorationType(RestorationTypes.LIMITED)
    } else {
      this.setRestorationType(RestorationTypes.FULL)
      this.setRestorationExpiry(null)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

label {
  font-weight: bold;
}

#restoration-type {
  padding: 1.5rem;
  font-size: $px-16;
}

.radio-group {
  padding-top: 0;
  margin-top: 0;
}
</style>
