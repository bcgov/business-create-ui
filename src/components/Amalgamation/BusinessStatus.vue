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
import { BusinessStatuses } from '@/enums'

@Component({})
export default class BusinessStatus extends Vue {
  @Prop({ required: true }) readonly status!: BusinessStatuses

  get icon (): string {
    switch (this.status) {
      case BusinessStatuses.OK: return 'mdi-check'

      case BusinessStatuses.ERROR_AFFILIATION:
      case BusinessStatuses.ERROR_CCC_MISMATCH:
      case BusinessStatuses.ERROR_FOREIGN:
      case BusinessStatuses.ERROR_NIGS: return 'mdi-alert'

      default: return 'mdi-help' // should never happen
    }
  }

  get color (): string {
    switch (this.status) {
      case BusinessStatuses.OK: return 'success'

      case BusinessStatuses.ERROR_AFFILIATION:
      case BusinessStatuses.ERROR_CCC_MISMATCH:
      case BusinessStatuses.ERROR_FOREIGN:
      case BusinessStatuses.ERROR_NIGS: return 'warning'

      default: return 'gray7' // should never happen
    }
  }

  get text (): string {
    switch (this.status) {
      case BusinessStatuses.OK: return 'Ready'

      case BusinessStatuses.ERROR_AFFILIATION:
      case BusinessStatuses.ERROR_CCC_MISMATCH:
      case BusinessStatuses.ERROR_FOREIGN:
      case BusinessStatuses.ERROR_NIGS: return 'Attention Required'

      default: return 'Unknown' // should never happen
    }
  }

  get tooltip (): string {
    switch (this.status) {
      case BusinessStatuses.OK:
        return ''
      case BusinessStatuses.ERROR_AFFILIATION:
        return 'This business is not affiliated with the currently selected BC Registries account. ' +
         'Affiliate this business with the account on My Business Registry page.'
      case BusinessStatuses.ERROR_CCC_MISMATCH:
        return 'A BC Community Contribution Company must amalgamate to form a new BC Community ' +
          'Contribution Company.'
      case BusinessStatuses.ERROR_FOREIGN:
        return 'A foreign corporation must not amalgamate with a limited company and continue as ' +
          'an unlimited liability company.'
      case BusinessStatuses.ERROR_NIGS:
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
