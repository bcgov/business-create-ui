<template>
  <div>
    <section class="mt-10">
      <header>
        <h2>Review</h2>
      </header>
      <Summary />
    </section>

    <section class="mt-10">
      <header>
        <h2>Completing Party Statement</h2>
      </header>
      <Certify
        :certifiedBy="certifyState.certifiedBy"
        @valid="onValid($event)"
        @certifiedBy="onCertifiedBy($event)"
        :date="currentDate"
        :certifyStatementResource="certifyStatementResource"
      />
    </section>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Mixins, Vue } from 'vue-property-decorator'
import { State, Action } from 'vuex-class'

// Interfaces
import { CertifyStatementIF, ActionBindingIF, CertifyIF } from '@/interfaces'

// Components
import { Certify, Summary } from '@/components/ReviewConfirm'

@Component({
  components: {
    Certify,
    Summary
  }
})
export default class ReviewConfirm extends Mixins() {
  @State(state => state.stateModel.currentDate)
  readonly currentDate!: string

  @State(state => state.stateModel.certifyState)
  readonly certifyState!: CertifyIF

  @State(state => state.resourceModel.certifyStatementResource)
  readonly certifyStatementResource!: CertifyStatementIF

  @Action setCertifyState!: ActionBindingIF
  @Action setIgnoreChanges!: ActionBindingIF

  /** Called when component is created. */
  private created (): void {
    // ignore data changes until page has loaded
    this.setIgnoreChanges(true)
    Vue.nextTick(() => {
      this.setIgnoreChanges(false)
    })
  }

  /** Handler for Valid change event. */
  private onValid (val: boolean): void {
    this.setCertifyState(
      {
        valid: val,
        certifiedBy: this.certifyState.certifiedBy
      }
    )
  }

  /** Handler for CertifiedBy change event. */
  private onCertifiedBy (val: string): void {
    this.setCertifyState(
      {
        valid: this.certifyState.valid,
        certifiedBy: val
      }
    )
  }
}
</script>

<style lang="scss" scoped>
</style>
