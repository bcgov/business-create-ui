<template>
  <v-card flat id="restoration-type" class="pa-6">
    <v-row>

      <v-col cols="12" sm="3" class="pr-4">
        <label>Restoration Type</label>
      </v-col>

      <v-col cols="12" sm="9">
        <v-radio-group column class="pt-0 mt-0" v-model="selectRestorationType">
          <v-radio label="Full Restoration" value="isFull" />

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
          <v-radio label="Limited Restoration" value="isLimited" />

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
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Watch, Emit, Prop } from 'vue-property-decorator'
import { DateMixin, CommonMixin } from '@/mixins'
import { ISLIMITEDRESTORATION, ISFULLRESTORATION } from '@/constants'
import { Getter, Action } from 'vuex-class'
import { RestorationTypes, RouteNames } from '@/enums'
import { RelationshipsPanel } from '@bcrs-shared-components/relationships-panel'
import { LimitedRestorationPanel } from '@bcrs-shared-components/limited-restoration-panel'

@Component({
  mixins: [
    DateMixin,
    CommonMixin
  ],
  components: {
    RelationshipsPanel,
    LimitedRestorationPanel
  }
})
export default class RestorationType extends Vue {
  @Getter getRestoration!: RestorationStateIF
  @Getter getCurrentDate!: string
  @Getter isRestorationTypeValid!: boolean

  @Action setRestorationType!: ActionBindingIF
  @Action setRestorationExpiry!: ActionBindingIF
  @Action setRestorationRelationships!: ActionBindingIF
  @Action setRestorationTypeValid!: ActionBindingIF

  // Local properties
  protected isFull = false
  protected isLimited = false
  protected selectRestorationType = ''

  /**
   * Called when component is mounted.
   * Automatically check limited or full restoration when user continues a draft as per last selection.
   */
  mounted (): void {
    if (this.getRestoration.type === RestorationTypes.LIMITED) {
      this.selectRestorationType = ISLIMITEDRESTORATION
      this.isFull = !this.isLimited
    } else if (this.getRestoration.type === RestorationTypes.FULL) {
      this.selectRestorationType = ISFULLRESTORATION
    }
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
      this.setRestorationRelationships([])
      this.setRestorationTypeValid(true)
    } else {
      this.setRestorationType(RestorationTypes.FULL)
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
          restorationValid: this.isRestorationTypeValid
        },
        [
          'relationships-panel'
        ]
      )
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

label {
  font-weight: bold;
}

</style>
