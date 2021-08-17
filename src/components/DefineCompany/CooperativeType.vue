<template>
  <v-form ref="cooperativeTypeForm" id="cooperative-type">
    <v-row class="py-3" no-gutters>
      <v-col>
        <label class="font-weight-bold">Select Type</label>
      </v-col>
      <v-col class="ml-n1">
        <v-select
          filled
          persistent-hint
          id="cooperative-type-input"
          label="Cooperative Association Type"
          :items="cooperativeTypes"
          v-model="cooperativeType"
          :rules="cooperativeTypeRules"
        >
        </v-select>
      </v-col>
    </v-row>
  </v-form>
</template>

<script lang="ts">
// Libraries
import { Component, Emit, Watch, Vue, Prop } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { CoopType } from '@/enums'
import { FormType } from '@/interfaces'

@Component({})
export default class CooperativeType extends Vue {
  // Refs
  $refs!: {
    cooperativeTypeForm: FormType,
  }

  @Prop({ default: false })
  private readonly showErrors: boolean

  // Global getter
  @Getter getCooperativeType!: CoopType

  // Local properties
  private cooperativeTypes: Array<CoopType> = [
    CoopType.COOPERATIVE,
    CoopType.HOUSING_COOPERATIVE,
    CoopType.COMMUNITY_SERVICE_COOPERATIVE
  ]

  private cooperativeType: CoopType = null

  // Validation rules
  private readonly cooperativeTypeRules: Array<Function> = [
    v => !!v || 'This field is required' // is not empty
  ]

  mounted (): void {
    // Set local model when resuming draft
    if (this.getCooperativeType) this.cooperativeType = this.getCooperativeType
  }

  @Watch('showErrors')
  private validateCooperativeType (): void {
    this.$refs.cooperativeTypeForm.validate()
  }

  // Events
  @Watch('cooperativeType')
  @Emit('hasCooperativeType')
  private addCooperativeType (): string {
    return this.cooperativeType
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.row .col:first-child {
  width: 12rem;
  max-width: 12rem;
}

// Vuetify Overrides
::v-deep .v-list-item .v-list-item__title, .v-list-item .v-list-item__subtitle {
  color: $gray7;
}

::v-deep .v-list-item--link:hover {
  background-color: #E4EDF7;
  color: $app-blue !important;
}

::v-deep .v-list-item:hover {
  .v-list-item__title {
    color: $app-blue !important;
  }
}

::v-deep .v-list-item--active .v-list-item__title, .v-list-item .v-list-item__subtitle {
  color: $app-blue !important;
}
</style>
