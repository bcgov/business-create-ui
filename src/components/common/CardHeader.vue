<template>
  <header class="v-card-header rounded-t">
    <v-icon
      v-if="icon"
      color="appDkBlue"
    >
      {{ icon }}
    </v-icon>
    <label
      v-if="label"
      class="v-card-label"
      :class="{ 'pl-2': !!icon }"
    >
      {{ label }}
    </label>
  </header>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({})
export default class CardHeader extends Vue {
  @Prop({ default: null }) readonly icon!: string
  @Prop({ default: null }) readonly label!: string
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.v-card-header {
  display: flex;
  background-color: $BCgovBlue5O;
  padding: 1.25rem;

  .v-card-label {
    font-weight: bold;
    color: $gray9;
  }
}
</style>
