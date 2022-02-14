<template>
  <v-form ref="cooperativeTypeForm" id="cooperative-type">
    <v-row class="py-3" no-gutters>
      <v-col>
        <label><strong>Select Type</strong></label>
      </v-col>
      <v-col class="ml-n1">
        <v-select
          filled
          persistent-hint
          id="cooperative-type-input"
          label="Cooperative Association Type"
          :items="items"
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
import { Component, Emit, Watch, Mixins, Prop } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { CoopType } from '@/enums'
import { FormIF } from '@/interfaces'
import { EnumMixin } from '@/mixins'

@Component({})
export default class CooperativeType extends Mixins(EnumMixin) {
  // Refs
  $refs!: {
    cooperativeTypeForm: FormIF
  }

  @Prop({ default: false })
  private readonly showErrors: boolean

  // Global getter
  @Getter getCooperativeType!: CoopType

  // Local properties
  private readonly items: Array<any> = [
    {
      value: CoopType.COMMUNITY_SERVICE_COOPERATIVE,
      text: this.coopTypeToDescription(CoopType.COMMUNITY_SERVICE_COOPERATIVE)
    },
    {
      value: CoopType.ORDINARY_COOPERATIVE,
      text: this.coopTypeToDescription(CoopType.ORDINARY_COOPERATIVE)
    },
    {
      value: CoopType.HOUSING_COOPERATIVE,
      text: this.coopTypeToDescription(CoopType.HOUSING_COOPERATIVE)
    }
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
  private addCooperativeType (): CoopType {
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

::v-deep .v-list-item--link:hover:not(.v-list-item--active) {
  background-color: $gray1;
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
