<template>
  <div id="approval-type">
    <div class="section-container" :class="{ 'invalid-section': invalidSection }">
      <ApprovalTypeShared
        :courtOrderNumber="getRestoration.courtOrder.fileNumber"
        :approvedByRegistrar="approvedByRegistrar"
        :noticeDate="getRestoration.noticeDate"
        :applicationDate="getRestoration.applicationDate"
        :invalidSection="invalidSection"
        @radioButtonChange="setRestorationApprovalType($event)"
        @courtNumberChange="setRestorationCourtOrder({ fileNumber: $event })"
        @update:noticeDate="setRestorationNoticeDate($event)"
        @update:applicationDate="setRestorationApplicationDate($event)"
        @valid="setApprovalTypeValid($event)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { Getter, Action } from 'vuex-class'
import { ActionBindingIF, RestorationStateIF } from '@/interfaces'
import { ApprovalType as ApprovalTypeShared } from '@bcrs-shared-components/approval-type'

@Component({
  components: {
    ApprovalTypeShared
  }
})
export default class ApprovalType extends Vue {
  @Getter getApprovalTypeValid!: boolean
  @Getter getRestoration!: RestorationStateIF
  @Getter getShowErrors!: boolean

  @Action setRestorationApprovalType!: ActionBindingIF
  @Action setRestorationCourtOrder!: ActionBindingIF
  @Action setRestorationNoticeDate!: ActionBindingIF
  @Action setRestorationApplicationDate!: ActionBindingIF
  @Action setApprovalTypeValid!: ActionBindingIF

  /** This section's validity state (when prompted by app). */
  get invalidSection (): boolean {
    return (this.getShowErrors && !this.getApprovalTypeValid)
  }

  get approvedByRegistrar (): boolean {
    return (!!this.getRestoration.noticeDate && !!this.getRestoration.applicationDate)
  }
}
</script>
