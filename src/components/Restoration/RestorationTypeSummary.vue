<template>
    <v-card flat id="restoration-type-summary">

      <v-row>
        <v-col cols="12" sm="3" class="pr-4">
          <label>Restoration Type</label>
        </v-col>

        <v-col cols="12" sm="9">
          <template v-if="getRestoration.type === 'limitedRestoration'">
            <label>Limited Restoration</label><br/>
            <span>Expire on {{ this.yyyyMmDdToPacificDate(this.getRestoration.expiry) }}</span>
          </template>
          <template v-else>
            <label>Full Restoration</label><br/>
            <span></span>
          </template>
        </v-col>
      </v-row>
    </v-card>
  </template>

<script lang="ts">

import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { DateMixin, AddEditOrgPersonMixin } from '@/mixins'
import { VuetifyRuleFunction } from '@/types'
import { Getter, Action } from 'vuex-class'
import { RestorationTypes } from '@/enums'

  @Component({
    mixins: [
      DateMixin,
      AddEditOrgPersonMixin
    ]
  })

export default class RestorationTypeSummary extends Vue {
  @Getter getRestoration!: RestorationStateIF

  // Local properties
  protected type = ''
  protected expiryDate = ''

  /** Called before the component is mounted. */
  beforeMount (): void {
    if (this.getRestoration.type === RestorationTypes.LIMITED) {
      this.type = 'Limited Restoration'
      this.expiryDate = 'Expire on ' + this.yyyyMmDdToPacificDate(this.getRestoration.expiry)
    } else {
      this.type = 'Full Restoration'
    }
  }
}

</script>

  <style lang="scss" scoped>
  @import '@/assets/styles/theme.scss';

  label {
    font-weight: bold;
  }

  #restoration-type-summary {
    margin: 1rem;
    font-size: $px-16;
  }

  </style>
