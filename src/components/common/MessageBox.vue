<template>
  <v-card
    outlined
    class="ma-0"
    :class="{
      'rounded-0': !rounded,
      rounded,
      'message-box-gold': color === 'gold',
      'message-box-red': color === 'red',
      'message-box-blue': color === 'blue'
    }"
  >
    <div class="mx-7 my-5 pa-0">
      <slot />
    </div>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
@Component({})
export default class MessageBox extends Vue {
  @Prop({ required: true }) readonly color!: 'gold' | 'red' | 'blue'
  @Prop({ default: false }) readonly rounded!: boolean
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.v-card {
  :deep(p),
  :deep(div) {
    font-size: $px-14;
    letter-spacing: 0.01rem;
    color: $gray7;
  }
}
.message-box-gold {
  background-color: $BCgovGold0 !important;
  border-color: $BCgovGold5 !important;
}
.message-box-red {
  background-color: $app-lt-red !important;
  border-color: $app-red !important;
}
.message-box-blue {
  border-color: $app-blue !important;
}
</style>
