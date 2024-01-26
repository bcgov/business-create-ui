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
          :color="status === AmlStatuses.OK ? 'success' : 'warning'"
        >
          {{ status === AmlStatuses.OK ? 'mdi-check' : 'mdi-alert' }}
        </v-icon>
        <span
          class="ml-2 text-decoration-dotted-underline"
          v-on="on"
        >
          {{ status === AmlStatuses.OK ? 'Ready' : 'Attention Required' }}
        </span>
      </template>
      <span>{{ tooltip }}</span>
    </v-tooltip>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { AmlStatuses } from '@/enums'

@Component({})
export default class BusinessStatus extends Vue {
  readonly AmlStatuses = AmlStatuses

  @Prop({ required: true }) readonly status!: AmlStatuses

  /**
   * The tooltip text for the current status.
   * Note that the status is evaluated in amalgamation-mixin.ts.
   */
  get tooltip (): string {
    /* eslint-disable indent */
    switch (this.status) {
      case AmlStatuses.OK:
        return 'The currently selected BC Registries account has access to this business.'

      case AmlStatuses.ERROR_CCC_MISMATCH:
        return 'A BC community contribution company must amalgamate to form a new BC community ' +
          'contribution company.'

      case AmlStatuses.ERROR_DRAFT_TASK:
        return 'This business has a draft task. It cannot be part of an amalgamation.'

      case AmlStatuses.ERROR_FROZEN:
        return 'This business is frozen. Frozen businesses cannot be part of an amalgamation.'

      case AmlStatuses.ERROR_FOREIGN:
        return 'A foreign corporation cannot be amalgamated except by Registries staff.'

      case AmlStatuses.ERROR_FOREIGN_HORIZONTAL:
        return 'A foreign company (including an extraprovincial company) cannot be part of a ' +
          'horizontal short form amalgamation. '

      case AmlStatuses.ERROR_FOREIGN_UNLIMITED:
        return 'A foreign corporation must not amalgamate with a BC company and continue as an ' +
          'unlimited liability company.'

      case AmlStatuses.ERROR_FOREIGN_UNLIMITED2:
        return 'A BC company cannot amalgamate with an existing foreign corporation to form a BC ' +
          'unlimited liability company.'

      case AmlStatuses.ERROR_FOREIGN_UNLIMITED3:
        return 'A BC unlimited liability company cannot amalgamate with a foreign company.'

      case AmlStatuses.ERROR_FUTURE_EFFECTIVE_FILING:
        return 'This business has a future effective filing. It cannot be part of an amalgamation ' +
          'until all future effective filings have come into effect.'

      case AmlStatuses.ERROR_HISTORICAL:
        return 'This business is historical. It cannot be part of an amalgamation.'

      case AmlStatuses.ERROR_LIMITED_RESTORATION:
        return 'This business is under limited restoration. It cannot be part of an amalgamation ' +
          'unless it is fully restored.'

      case AmlStatuses.ERROR_NEED_BC_COMPANY:
        return 'You must add at least one BC company.'

      case AmlStatuses.ERROR_NOT_AFFILIATED:
        return 'This business is not affiliated with the currently selected BC Registries account. ' +
         'Affiliate this business with the account on My Business Registry page.'

      case AmlStatuses.ERROR_NOT_IN_GOOD_STANDING:
        return 'This business is not in good standing. This filing cannot be submitted until all ' +
          'businesses are in good standing.'

      case AmlStatuses.ERROR_PENDING_FILING:
        return 'This business has a pending filing. It cannot be part of an amalgamation.'

      case AmlStatuses.ERROR_XPRO_ULC_CCC:
        return 'An extraprovincial company cannot amalgamate to form a new BC unlimited liability ' +
          'company or a new BC community contribution company.'

      default:
        return '(Unknown)' // should never happen
    }
    /* eslint-enable indent */
  }
}
</script>

<style lang="scss" scoped>
// @import '@/assets/styles/theme.scss';

.v-icon {
  margin-top: 3px;
}
</style>
