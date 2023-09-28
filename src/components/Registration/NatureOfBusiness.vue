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
import { Component, Emit, Prop, Vue } from 'vue-facing-decorator'
import { Action, Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import { NaicsIF, RegistrationStateIF } from '@/interfaces'
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

  @Action(useStore) setRegistrationNaics!: (x: NaicsIF) => void

  readonly NaicsServices = NaicsServices

  @Emit('valid')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  emitValid (val: boolean): void {}
}
</script>
