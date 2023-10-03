<template>
  <div id="approval-type">
    <div
      class="section-container"
    >
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
import { Component, Vue } from 'vue-property-decorator'
import { Getter, Action } from 'pinia-class'
import { useStore } from '@/store/store'
import { ApprovalTypes } from '@/enums'
import { CourtOrderIF, RestorationStateIF } from '@/interfaces'
import { ApprovalType as ApprovalTypeShared } from '@bcrs-shared-components/approval-type'

@Component({
  components: {
    ApprovalTypeShared
  }
})
export default class ApprovalType extends Vue {
  @Getter(useStore) getApprovalTypeValid!: boolean
  @Getter(useStore) getRestoration!: RestorationStateIF
  @Getter(useStore) getShowErrors!: boolean

  @Action(useStore) setApprovalTypeValid!: (x: boolean) => void
  @Action(useStore) setRestorationApplicationDate!: (x: string) => void
  @Action(useStore) setRestorationApprovalType!: (x: ApprovalTypes) => void
  @Action(useStore) setRestorationCourtOrder!: (x: CourtOrderIF) => void
  @Action(useStore) setRestorationNoticeDate!: (x: string) => void

  /** This section's validity state (when prompted by app). */
  get invalidSection (): boolean {
    return (this.getShowErrors && !this.getApprovalTypeValid)
  }

  get approvedByRegistrar (): boolean {
    return (!!this.getRestoration.noticeDate && !!this.getRestoration.applicationDate)
  }
}
</script>
