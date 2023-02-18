<template>
  <v-card flat id="restoration-type" class="pa-6">
    <v-row>

      <v-col cols="12" sm="3" class="pr-4">
        <label class="font-weight-bold">Restoration Type</label>
      </v-col>

      <v-col cols="12" sm="9">
        <v-radio-group column class="pt-0 mt-0" v-model="selectRestorationType">
          <v-radio id="full-radio-button" label="Full Restoration" :value=RestorationTypes.FULL />

          <!-- Relationship To Company Checkboxes -->
          <v-expand-transition>
            <v-card flat v-if="isFull">
              <div class="ml-8">
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
              <RelationshipsPanel :draftRelationships="getRestoration.relationships"
                @changed="setRestorationRelationships($event)" @valid="setRestorationTypeValid($event)" />
            </v-card>
          </v-expand-transition>
          <v-radio id="limited-radio-button" label="Limited Restoration" :value=RestorationTypes.LIMITED />

          <!-- Limited Restoration Radio Panel -->
          <v-expand-transition>
            <v-card flat v-if="isLimited">
              <LimitedRestorationPanel :currentDate="getCurrentDate" :expiryDate="getRestoration.expiry"
                @expiry="setRestorationExpiry($event)" />
            </v-card>
          </v-expand-transition>

        </v-radio-group>
      </v-col>
    </v-row>
    <ApprovalType class="font-weight-bold pl-1"
    :courtOrderNumber="getRestoration.courtOrder.fileNumber"
    :approvedByRegistrar="getRestoration.noticeDate && getRestoration.applicationDate"
    :noticeDate="getRestoration.noticeDate"
    :applicationDate="getRestoration.applicationDate"
    @radioButtonChange="setRestorationApprovalType($event)"
    @courtNumberChange="setRestorationCourtOrder({ fileNumber: $event })"
    @update:noticeDate="setRestorationNoticeDate($event)"
    @update:applicationDate="setRestorationApplicationDate($event)"
    @valid="setApprovalTypeValid($event)"
    />
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Watch, Emit, Prop } from 'vue-property-decorator'
import { DateMixin, CommonMixin } from '@/mixins'
import { Getter, Action } from 'vuex-class'
import { RestorationTypes, RouteNames } from '@/enums'
import { ApprovalType } from '@bcrs-shared-components/approval-type'
import { LimitedRestorationPanel } from '@bcrs-shared-components/limited-restoration-panel'
import { RelationshipsPanel } from '@bcrs-shared-components/relationships-panel'
import { ActionBindingIF } from '@/interfaces'

@Component({
  mixins: [
    DateMixin,
    CommonMixin
  ],
  components: {
    ApprovalType,
    RelationshipsPanel,
    LimitedRestorationPanel
  }
})
export default class RestorationType extends Vue {
  @Getter getApprovalTypeValid!: boolean
  @Getter getRestoration!: RestorationStateIF
  @Getter getCurrentDate!: string
  @Getter getRestorationTypeValid!: boolean

  @Action setRestorationType!: ActionBindingIF
  @Action setRestorationExpiry!: ActionBindingIF
  @Action setRestorationRelationships!: ActionBindingIF
  @Action setRestorationTypeValid!: ActionBindingIF
  @Action setRestorationApprovalType!: ActionBindingIF
  @Action setRestorationCourtOrder!: ActionBindingIF
  @Action setRestorationNoticeDate!: ActionBindingIF
  @Action setRestorationApplicationDate!: ActionBindingIF
  @Action setApprovalTypeValid!: ActionBindingIF

  // Local properties
  protected selectRestorationType:RestorationTypes = null

  readonly RestorationTypes = RestorationTypes

  /**
   * Called when component is mounted.
   * Automatically check limited or full restoration when user continues a draft as per last selection.
   */
  mounted (): void {
    if (this.getRestoration.type === RestorationTypes.LIMITED) {
      this.selectRestorationType = RestorationTypes.LIMITED
    } else {
      this.selectRestorationType = RestorationTypes.FULL
    }
  }

  // Computed value getter that returns true if current restoration is full
  get isFull (): boolean {
    return (this.getRestoration.type === RestorationTypes.FULL)
  }

  // Computed value getter that returns true if current restoration is limited
  get isLimited (): boolean {
    return (this.getRestoration.type === RestorationTypes.LIMITED)
  }

  /**
   * Set the selected Limited Restoration choice
   * @param val The value of the selected radio button
   */
  @Watch('selectRestorationType')
  private setRestorationChoice (val) {
    this.setRestorationType(val)
    if (this.isLimited) {
      this.setRestorationRelationships([])
      this.setRestorationTypeValid(true)
    } else {
      this.setRestorationExpiry(null)
    }
  }

  @Watch('$route')
  private async scrollToInvalidComponent (): Promise<void> {
    if (this.$route.name === RouteNames.RESTORATION_BUSINESS_NAME) {
      // scroll to invalid components
      await this.$nextTick()
      await this.validateAndScroll(
        {
          restorationValid: this.getRestorationTypeValid,
          approvalValid: this.getApprovalTypeValid
        },
        [
          'relationships-panel',
          'approval-type'
        ]
      )
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

</style>
