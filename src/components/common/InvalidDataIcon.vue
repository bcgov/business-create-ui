<template>
  <span
    v-if="issues.length"
    class="invalid-data-icon"
  >
    <v-tooltip
      top
      max-width="24rem"
      content-class="top-tooltip"
      transition="fade-transition"
    >
      <template #activator="{ on }">
        <v-icon
          color="error"
          v-on="on"
        >
          mdi-alert
        </v-icon>
      </template>
      <div>
        <div
          v-for="(issue, index) in issues"
          :key="index"
        >
          {{ issue }}
        </div>
      </div>
    </v-tooltip>
  </span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

/** A red warning icon whose tooltip lists the subject's data issues. Renders nothing when there are none. */
@Component({})
export default class InvalidDataIcon extends Vue {
  /** The data issues to list. */
  @Prop({ default: () => [] }) readonly issues!: string[]
}
</script>

<style lang="scss" scoped>
// move the warning icon down a bit to line up with the surrounding text
.v-icon {
  margin-top: 2px;
}
</style>
