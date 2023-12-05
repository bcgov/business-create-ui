<template>
  <div class="business-status d-flex align-start">
    <v-tooltip
      top
      max-width="24rem"
      content-class="top-tooltip"
      transition="fade-transition"
      :disabled="!tooltip"
    >
      <template #activator="{ on }">
        <v-icon
          small
          :color="color"
          v-on="on"
        >
          {{ icon }}
        </v-icon>
      </template>
      <span>{{ tooltip }}</span>
    </v-tooltip>

    <span class="ml-2">{{ text }}</span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { AmalgamatingStatuses } from '@/enums'

@Component({})
export default class BusinessStatus extends Vue {
  @Prop({ required: true }) readonly status!: AmalgamatingStatuses

  get icon (): string {
    switch (this.status) {
      case AmalgamatingStatuses.OK: return 'mdi-check'

      case AmalgamatingStatuses.ERROR_AFFILIATION:
      case AmalgamatingStatuses.ERROR_CCC_MISMATCH:
      case AmalgamatingStatuses.ERROR_FOREIGN:
      case AmalgamatingStatuses.ERROR_NIGS: return 'mdi-alert'

      default: return 'mdi-alert-circle-outline' // should never happen
    }
  }

  get color (): string {
    switch (this.status) {
      case AmalgamatingStatuses.OK: return 'success'

      case AmalgamatingStatuses.ERROR_AFFILIATION:
      case AmalgamatingStatuses.ERROR_CCC_MISMATCH:
      case AmalgamatingStatuses.ERROR_FOREIGN:
      case AmalgamatingStatuses.ERROR_NIGS: return 'warning'

      default: return 'error' // should never happen
    }
  }

  get text (): string {
    switch (this.status) {
      case AmalgamatingStatuses.OK: return 'Ready'

      case AmalgamatingStatuses.ERROR_AFFILIATION:
      case AmalgamatingStatuses.ERROR_CCC_MISMATCH:
      case AmalgamatingStatuses.ERROR_FOREIGN:
      case AmalgamatingStatuses.ERROR_NIGS: return 'Attention Required'

      default: return '(Unknown)' // should never happen
    }
  }

  get tooltip (): string {
    switch (this.status) {
      case AmalgamatingStatuses.OK:
        return ''
      case AmalgamatingStatuses.ERROR_AFFILIATION:
        return 'This business is not affiliated with the currently selected BC Registries account. ' +
         'Affiliate this business with the account on My Business Registry page.'
      case AmalgamatingStatuses.ERROR_CCC_MISMATCH:
        return 'A BC Community Contribution Company must amalgamate to form a new BC Community ' +
          'Contribution Company.'
      case AmalgamatingStatuses.ERROR_FOREIGN:
        return 'A foreign corporation must not amalgamate with a limited company and continue as ' +
          'an unlimited liability company.'
      case AmalgamatingStatuses.ERROR_NIGS:
        return 'This business is not in good standing. This filing cannot be submitted until all ' +
          'businesses are in good standing.'

      default: return null // should never happen
    }
  }
}
</script>

<style lang="scss" scoped>
// @import '@/assets/styles/theme.scss';

.v-icon {
  margin-top: 3px;
}
</style>
