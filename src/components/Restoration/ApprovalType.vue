<template>
  <div id="approval-type">
    <ApprovalTypeShared
      class="pa-8"
      :courtOrderNumber="getRestoration.courtOrder.fileNumber"
      :approvedByRegistrar="approvedByRegistrar"
      :noticeDate="getRestoration.noticeDate"
      :applicationDate="getRestoration.applicationDate"
      :invalidSection="invalidSection"
      :validate="getShowErrors"
      @radioButtonChange="setRestorationApprovalType($event)"
      @courtNumberChange="setRestorationCourtOrder({ fileNumber: $event })"
      @update:noticeDate="setRestorationNoticeDate($event)"
      @update:applicationDate="setRestorationApplicationDate($event)"
      @valid="setRestorationApprovalTypeValid($event)"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
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
  /** Whether this section is invalid. */
  @Prop({ default: false }) readonly invalidSection!: boolean

  @Getter(useStore) getApprovalTypeValid!: boolean
  @Getter(useStore) getRestoration!: RestorationStateIF
  @Getter(useStore) getShowErrors!: boolean

  @Action(useStore) setRestorationApplicationDate!: (x: string) => void
  @Action(useStore) setRestorationApprovalType!: (x: ApprovalTypes) => void
  @Action(useStore) setRestorationApprovalTypeValid!: (x: boolean) => void
  @Action(useStore) setRestorationCourtOrder!: (x: CourtOrderIF) => void
  @Action(useStore) setRestorationNoticeDate!: (x: string) => void

  get approvedByRegistrar (): boolean {
    return (!!this.getRestoration.noticeDate && !!this.getRestoration.applicationDate)
  }
}
</script>
