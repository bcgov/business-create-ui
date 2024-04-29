<template>
  <div id="manual-business-info">
    <!-- inactive = ready to click link to start -->
    <template v-if="!active">
      <v-row no-gutters>
        <v-col
          cols="12"
          sm="3"
        >
          <!-- empty column to line up with ExtraproRegistration label -->
        </v-col>

        <v-col
          cols="12"
          sm="9"
        >
          <div class="font-14 ml-3">
            Not extraprovincially registered in B.C.?
            &nbsp; &nbsp;
            <a @click="onClick()">Enter your business information manually</a>
          </div>
        </v-col>
      </v-row>
    </template>

    <!-- active = display/edit mode -->
    <template v-if="active">
      <v-row no-gutters>
        <v-col
          cols="12"
          sm="3"
        >
          <label>Jurisdiction</label>
        </v-col>

        <v-col
          cols="12"
          sm="7"
        >
          ** Jurisdiction selector goes here **
        </v-col>

        <v-col
          cols="12"
          sm="2"
        >
          <v-btn
            id="undo-button"
            class="float-sm-right float-none"
            text
            color="primary"
            @click="reset()"
          >
            <v-icon small>
              mdi-undo
            </v-icon>
            <span>Undo</span>
          </v-btn>
        </v-col>
      </v-row>

      <v-row
        class="mt-4"
        no-gutters
      >
        <v-col
          cols="12"
          sm="3"
        >
          <label>Identifying Number</label>
        </v-col>

        <v-col
          cols="12"
          sm="7"
        >
          ** Identifying number input goes here **
        </v-col>

        <v-col
          cols="12"
          sm="2"
        >
          <!-- empty column to line up with Undo button above -->
        </v-col>
      </v-row>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Vue, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import { isEqual } from 'lodash'
import { BusinessLookupResultIF, EmptyBusinessLookup } from '@/interfaces'
import ExtraproBusinessLookup from './ExtraproBusinessLookup.vue'

@Component({
  components: {
    ExtraproBusinessLookup
  }
})
export default class ManualBusinessInfo extends Vue {
  @Getter(useStore) getContinuationInBusinessInfo!: any
  @Getter(useStore) getShowErrors!: boolean

  @Action(useStore) setContinuationInBusinessInfo!: (x: any) => void

  // Local properties
  active = false
  businessLookup = null
  manualBusinessInfoValid = false

  /** Whether to show this component. */
  get showComponent (): boolean {
    return true
  }

  /** Whether we have a looked-up business. */
  get haveLookupBusiness (): boolean {
    return !isEqual(this.businessLookup, EmptyBusinessLookup)
  }

  /** The jurisdiction. */
  get jurisdiction (): string {
    return 'Unknown'
  }

  /** The business name. */
  get businessName (): string {
    return this.businessLookup.name
  }

  /** The business number. */
  get businessNumber (): string {
    return this.businessLookup.bn || ''
  }

  /** The incorporation date. */
  get incorporationDate (): string {
    return 'Unknown'
  }

  mounted (): void {
    // get the business info object from the store or initialize it
    this.businessLookup = this.getContinuationInBusinessInfo || { ...EmptyBusinessLookup }

    // if mode is MANUAL, set this component to active (which hides the other component)
    if (this.businessLookup.mode === 'MANUAL') this.active = true
  }

  onClick (): void {
    this.active = true
  }

  setBusiness (businessLookup: BusinessLookupResultIF) {
    this.businessLookup = { ...businessLookup } // for reactivity
    this.businessLookup.mode = 'MANUAL'
    this.setContinuationInBusinessInfo(this.businessLookup)
  }

  /** Resets this component back to its initial state. */
  reset () {
    this.businessLookup = { ...EmptyBusinessLookup }
    this.setContinuationInBusinessInfo(this.businessLookup)
    // set this component to inactive (which shows the other component)
    this.active = false
  }

  @Watch('manualBusinessInfoValid', { immediate: true })
  @Emit('valid')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private onComponentValid (val: boolean): void {}

  @Watch('active', { immediate: true })
  @Emit('active')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private onActiveChanged (val: boolean): void {}
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

// set style for all root labels
label {
  font-weight: bold;
  color: $gray9;
}

// add whitespace between first and second columns
.col-sm-3 {
  padding-right: 1rem !important;
}
</style>
