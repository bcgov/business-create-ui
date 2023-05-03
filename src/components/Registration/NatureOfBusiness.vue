<template>
  <NatureOfBusinessShared
    :showErrors="showErrors"
    :naics="getRegistration.naics"
    :NaicsServices="NaicsServices"
    @setNaics="setRegistrationNaics"
    @valid="emitValid($event)"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Emit, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import { ActionBindingIF, RegistrationStateIF } from '@/interfaces'
import { NaicsServices } from '@/services/'
import { NatureOfBusiness as NatureOfBusinessShared } from '@bcrs-shared-components/nature-of-business'

/** This is a shim between the view and the atomic component. */
@Component({
  components: {
    NatureOfBusinessShared
  }
})
export default class NatureOfBusiness extends Vue {
  @Prop({ required: true }) readonly showErrors!: boolean

  @Getter(useStore) getRegistration!: RegistrationStateIF

  @Action(useStore) setRegistrationNaics!: ActionBindingIF

  readonly NaicsServices = NaicsServices

  @Emit('valid')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private emitValid (val: boolean): void {}
}
</script>
