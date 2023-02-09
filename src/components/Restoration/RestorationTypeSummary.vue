<template>
    <v-card flat id="restoration-type-summary" class="ma-4">

      <div v-if="!getRestorationTypeValid" class="error-message pb-4">
        <span>
          <v-icon color="error">mdi-information-outline</v-icon>
          <span class="error-text mx-1">This step is unfinished.</span>
          <router-link
            :to="{ path: `/${RouteNames.RESTORATION_BUSINESS_NAME}` }"
          >Return to this step to finish it</router-link>
        </span>
      </div>

      <v-row>
        <v-col cols="12" sm="3" class="pr-4">
          <label class="font-weight-bold">Restoration Type</label>
        </v-col>

        <v-col cols="12" sm="9">
          <template v-if="getRestoration.type === RestorationTypes.LIMITED">
            <label class="font-weight-bold">Limited Restoration</label><br/>
            <span class="limited-text">Expire on {{ this.yyyyMmDdToPacificDate(this.getRestoration.expiry) }}</span>
          </template>
          <template v-else>
            <label class="font-weight-bold">Full Restoration</label><br/>
            <span class="full-text" v-if="getRestorationTypeValid">
              Applicant's relationship: {{ (this.getRestoration.relationships).join(', ') }}.
            </span>
          </template>
        </v-col>
      </v-row>
    </v-card>
  </template>

<script lang="ts">
import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { DateMixin } from '@/mixins'
import { Getter, Action } from 'vuex-class'
import { RouteNames, RestorationTypes } from '@/enums'

  @Component({
    mixins: [
      DateMixin
    ]
  })

export default class RestorationTypeSummary extends Vue {
  @Getter getRestoration!: RestorationStateIF
  @Getter getRestorationTypeValid!: boolean

  readonly RouteNames = RouteNames
  readonly RestorationTypes = RestorationTypes
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.error-message {
  color: $app-red;
}
</style>
