<template>
  <header class="v-card-header rounded-t">
    <v-icon color="appDkBlue">
      {{ icon }}
    </v-icon>
    <label class="v-card-label pl-2">{{ label }}</label>
  </header>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-facing-decorator'

@Component({})
export default class CardHeader extends Vue {
  @Prop({ required: true }) readonly icon!: string
  @Prop({ required: true }) readonly label!: string
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
