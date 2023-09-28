<template>
  <li class="rule-list-item">
    <v-icon
      v-if="valid"
      color="green-darken-2"
      class="rule-valid"
    >
      mdi-check
    </v-icon>
    <v-icon
      v-else-if="showErrors"
      color="error"
      class="rule-invalid"
    >
      mdi-close
    </v-icon>
    <v-icon
      v-else
      class="rule-initial"
    >
      mdi-circle-small
    </v-icon>
    <span class="rule-text ml-2">{{ text }}</span>
  </li>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-facing-decorator'

@Component({})
export default class RuleListItem extends Vue {
  @Prop({ required: true }) readonly valid!: boolean
  @Prop({ required: true }) readonly showErrors!: boolean
  @Prop({ required: true }) readonly text!: string
}
</script>

<style lang="scss" scoped>
.v-icon.mdi-circle-small {
  margin-top: -2px;
}
</style>
