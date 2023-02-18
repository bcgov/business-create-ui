<template>
    <v-card flat id="approval-type-summary" class="ma-4">

        <div v-if="!getApprovalTypeValid" class="error-message pb-4">
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
          <label class="font-weight-bold">Approval Type</label>
        </v-col>

        <v-col cols="12" sm="9">
          <template v-if="getRestoration.approvalType === ApprovalTypes.VIA_COURT_ORDER">
            <label class="font-weight-bold">Approved by Court Order</label><br/>
            <span class="text-color">Court Order Number: {{ this.getRestoration.courtOrder.fileNumber }}</span>
          </template>
          <template v-else-if="getRestoration.approvalType === ApprovalTypes.VIA_REGISTRAR">
            <label class="font-weight-bold">Approved by Registrar</label><br/>
            <span class="text-color">
              BC Gazette publish date: {{ this.yyyyMmDdToPacificDate(this.getRestoration.noticeDate) }}<br/>
              Application for Restoration mailed date:
              {{ this.yyyyMmDdToPacificDate(this.getRestoration.applicationDate) }}
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
import { RouteNames, ApprovalTypes } from '@/enums'

  @Component({
    mixins: [
      DateMixin
    ]
  })

export default class ApprovalTypeSummary extends Vue {
  @Getter getApprovalTypeValid!: boolean
  @Getter getRestoration!: RestorationStateIF

  readonly RouteNames = RouteNames
  readonly ApprovalTypes = ApprovalTypes
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.error-message {
  color: $app-red;
}

.text-color {
    color: $gray7
}
</style>
