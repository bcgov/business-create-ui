<template>
  <v-form
    id="cooperative-type"
    ref="cooperativeTypeForm"
  >
    <v-row no-gutters>
      <v-col
        cols="12"
        sm="3"
        class="pr-4"
      >
        <label><strong>Select Type</strong></label>
      </v-col>
      <v-col
        cols="12"
        sm="9"
        class="pt-4 pt-sm-0"
      >
        <v-select
          id="cooperative-type-input"
          v-model="cooperativeType"
          variant="filled"
          label="Cooperative Association Type"
          :items="items"
          :rules="cooperativeTypeRules"
        />
      </v-col>
    </v-row>
  </v-form>
</template>

<script lang="ts">
// Libraries
import { Component, Emit, Prop, Vue, Watch } from 'vue-facing-decorator'
import { Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import { CoopTypes } from '@/enums'
import { FormIF } from '@/interfaces'
import { VuetifyRuleFunction } from '@/types'
import { CoopTypeToDescription } from '@/utils'

@Component({})
export default class CooperativeType extends Vue {
  // Refs
  $refs!: {
    cooperativeTypeForm: FormIF
  }

  // Prop
  @Prop({ default: false }) readonly showErrors!: boolean

  // Global getter
  @Getter(useStore) getCooperativeType!: CoopTypes

  // Local properties
  readonly items: Array<any> = [
    {
      value: CoopTypes.COMMUNITY_SERVICE_COOPERATIVE,
      text: CoopTypeToDescription(CoopTypes.COMMUNITY_SERVICE_COOPERATIVE)
    },
    {
      value: CoopTypes.ORDINARY_COOPERATIVE,
      text: CoopTypeToDescription(CoopTypes.ORDINARY_COOPERATIVE)
    },
    {
      value: CoopTypes.HOUSING_COOPERATIVE,
      text: CoopTypeToDescription(CoopTypes.HOUSING_COOPERATIVE)
    }
  ]

  cooperativeType = null as CoopTypes

  // Validation rules
  readonly cooperativeTypeRules: Array<VuetifyRuleFunction> = [
    v => !!v || 'This field is required' // is not empty
  ]

  /** Called when component is mounted. */
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
  private addCooperativeType (): CoopTypes {
    return this.cooperativeType
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

:deep() {
  // remove extra space taken by error message
  .v-text-field__details {
    margin-bottom: -8px !important;
  }

  // Vuetify Overrides
  .v-list-item .v-list-item__title,
  .v-list-item .v-list-item__subtitle {
    color: $gray7;
  }

  .v-list-item--link:hover:not(.v-list-item--active) {
    background-color: $gray1;
    color: $app-blue !important;
  }

  .v-list-item:hover {
    .v-list-item__title {
      color: $app-blue !important;
    }
  }

  .v-list-item--active .v-list-item__title,
  .v-list-item .v-list-item__subtitle {
    color: $app-blue !important;
  }
}
</style>
