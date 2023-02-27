<template>
  <CertifyShared
    :certifiedBy="getCertifyState.certifiedBy"
    :currentDate="getCurrentDate"
    :disableEdit="disableEdit"
    :entityDisplay="getCompletingPartyStatement.entityDisplay"
    :firstColumn="3"
    :invalidSection="invalidSection"
    :isCertified="getCertifyState.valid"
    :isStaff="isStaff"
    :message="getCompletingPartyStatement.certifyClause"
    :secondColumn="9"
    :statements="getCompletingPartyStatement.certifyStatements"
    @update:certifiedBy="onCertifiedBy($event)"
    @update:isCertified="onIsCertified($event)"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { ActionBindingIF, CertifyIF, CompletingPartyStatementIF } from '@/interfaces'
import { Certify as CertifyShared } from '@bcrs-shared-components/certify'

/** This is a shim between the view and the atomic component. */
@Component({
  components: {
    CertifyShared
  }
})
export default class Certify extends Vue {
  @Prop({ required: true }) readonly disableEdit!: boolean
  @Prop({ required: true }) readonly invalidSection!: boolean
  @Prop({ required: true }) readonly isStaff!: boolean

  @Getter getCertifyState!: CertifyIF
  @Getter getCompletingPartyStatement!: CompletingPartyStatementIF
  @Getter getCurrentDate!: string

  @Action setCertifyState!: ActionBindingIF

  /** Handler for CertifiedBy change event. */
  onCertifiedBy (val: string): void {
    this.setCertifyState(
      {
        valid: this.getCertifyState.valid,
        certifiedBy: val
      }
    )
  }

  /** Handler for Valid change event. */
  onIsCertified (val: boolean): void {
    this.setCertifyState(
      {
        valid: val,
        certifiedBy: this.getCertifyState.certifiedBy
      }
    )
  }
}
</script>
