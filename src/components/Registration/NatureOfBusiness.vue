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
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { ActionBindingIF, RegistrationStateIF } from '@/interfaces'
import { NaicsServices } from '@/services/'
import { NatureOfBusiness as NatureOfBusinessShared } from '@bcrs-shared-components/nature-of-business'

/** This is a shim between the view and the atomic component. */
@Component({
  components: { NatureOfBusinessShared }
})
export default class NatureOfBusiness extends Vue {
  @Prop({ required: true }) readonly showErrors!: boolean

  @Getter getRegistration!: RegistrationStateIF

  @Action setRegistrationNaics!: ActionBindingIF

  readonly NaicsServices = NaicsServices

  @Emit('valid')
  private emitValid (val: boolean): void {}
}
</script>
