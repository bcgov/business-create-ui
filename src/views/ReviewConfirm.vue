<template>
  <div>
    <v-container>
      <section>
        <header>
          <h2>Review</h2>
        </header>
      </section>
      <section>
          <header>
            <h2>Completing Party Statement</h2>
          </header>
          <Certify
          :isCertified.sync="isCertified"
          :certifiedBy.sync="certifiedBy"
          @valid="certifyFormValid=$event"
          :date="currentDate"
          :certifyStatementResource="certifyStatementResource"/>
      </section>
    </v-container>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Vue, Mixins, Watch } from 'vue-property-decorator'
import { State, Action, Getter } from 'vuex-class'

import { Certify } from '@/components/ReviewConfirm'
import { ResourceLookupMixin } from '@/mixins'
import { CertifyStatementIF, ActionBindingIF, GetterIF } from '@/interfaces'

@Component({
  components: {
    Certify
  }
})
export default class ReviewConfirm extends Mixins(ResourceLookupMixin) {
   @State(state => state.stateModel.currentDate) readonly currentDate!: string

   @State(state => state.resourceModel.certifyStatementResource)
   readonly certifyStatementResource!: CertifyStatementIF

   @Action('setCertifyState') setCertifyState!: ActionBindingIF

   // Global getters
  @Getter isEntityType!: GetterIF

  // Lifecycle event
  private created (): void {
    // if basic stuff isn't set, route back to step 1
    if (!this.isEntityType) {
      this.$router.push('/')
    }
  }

  // properties for Certify component
  private certifiedBy:string = ''
  private isCertified:boolean = false
  private certifyFormValid:boolean = false

  @Watch('certifyFormValid')
  private onCertifyFormValid (val: boolean): void {
    this.setCertifyState(
      {
        certifyFormValid: val,
        certifiedBy: this.certifiedBy
      }
    )
  }

  @Watch('certifiedBy')
  private onCertifiedByChange (val: boolean): void {
    this.setCertifyState(
      {
        certifyFormValid: this.certifyFormValid,
        certifiedBy: val
      }
    )
  }
}
</script>

<style lang="scss">
.step-container {
  margin-top: 1rem;
  padding: 1.25rem;
}
</style>
