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
import { AmlStatuses } from '@/enums'

@Component({})
export default class BusinessStatus extends Vue {
  @Prop({ required: true }) readonly status!: AmlStatuses

  get icon (): string {
    switch (this.status) {
      case AmlStatuses.OK:
        return 'mdi-check'

      case AmlStatuses.ERROR_NOT_AFFILIATED:
      case AmlStatuses.ERROR_CCC_MISMATCH:
      case AmlStatuses.ERROR_FOREIGN:
      case AmlStatuses.ERROR_FOREIGN_UNLIMITED:
      case AmlStatuses.ERROR_FUTURE_EFFECTIVE_FILING:
      case AmlStatuses.ERROR_LIMITED_RESTORATION:
      case AmlStatuses.ERROR_NOT_IN_GOOD_STANDING:
        return 'mdi-alert'

      default:
        return 'mdi-alert-circle-outline' // should never happen
    }
  }

  get color (): string {
    switch (this.status) {
      case AmlStatuses.OK:
        return 'success'

      case AmlStatuses.ERROR_NOT_AFFILIATED:
      case AmlStatuses.ERROR_CCC_MISMATCH:
      case AmlStatuses.ERROR_FOREIGN:
      case AmlStatuses.ERROR_FOREIGN_UNLIMITED:
      case AmlStatuses.ERROR_FUTURE_EFFECTIVE_FILING:
      case AmlStatuses.ERROR_LIMITED_RESTORATION:
      case AmlStatuses.ERROR_NOT_IN_GOOD_STANDING:
        return 'warning'

      default:
        return 'error' // should never happen
    }
  }

  get text (): string {
    switch (this.status) {
      case AmlStatuses.OK:
        return 'Ready'

      case AmlStatuses.ERROR_NOT_AFFILIATED:
      case AmlStatuses.ERROR_CCC_MISMATCH:
      case AmlStatuses.ERROR_FOREIGN:
      case AmlStatuses.ERROR_FOREIGN_UNLIMITED:
      case AmlStatuses.ERROR_FUTURE_EFFECTIVE_FILING:
      case AmlStatuses.ERROR_LIMITED_RESTORATION:
      case AmlStatuses.ERROR_NOT_IN_GOOD_STANDING:
        return 'Attention Required'

      default:
        return '(Unknown)' // should never happen
    }
  }

  get tooltip (): string {
    switch (this.status) {
      case AmlStatuses.OK:
        return ''
      case AmlStatuses.ERROR_NOT_AFFILIATED:
        return 'This business is not affiliated with the currently selected BC Registries account. ' +
         'Affiliate this business with the account on My Business Registry page.'
      case AmlStatuses.ERROR_CCC_MISMATCH:
        return 'A BC Community Contribution Company must amalgamate to form a new BC Community ' +
          'Contribution Company.'
      case AmlStatuses.ERROR_FOREIGN:
        return 'A foreign corporation cannot be amalgamated except by Registries staff.'
      case AmlStatuses.ERROR_FOREIGN_UNLIMITED:
        return 'A foreign corporation must not amalgamate with a limited company and continue as ' +
          'an unlimited liability company.'
      case AmlStatuses.ERROR_FUTURE_EFFECTIVE_FILING:
        return 'This business has a future effective filing. It cannot be part of an amalgamation ' +
          'until all future effective filings have come into effect.'
      case AmlStatuses.ERROR_LIMITED_RESTORATION:
        return 'This business is under limited restoration. It cannot be part of an amalgamation ' +
          'unless it is fully restored.'
      case AmlStatuses.ERROR_NOT_IN_GOOD_STANDING:
        return 'This business is not in good standing. This filing cannot be submitted until all ' +
          'businesses are in good standing.'

      default:
        return null // should never happen
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
