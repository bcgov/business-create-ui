<template>
  <div class="naics-result">
    <!-- *** TODO: format this as per comps -->
    <v-btn text @click="emitClick(result)">
      {{result.classTitle}}
    </v-btn>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'

@Component({})
export default class NaicsResult extends Vue {
  @Prop({ required: true })
  readonly result!: any

  @Emit('click')
  private emitClick (result: any): void {}
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.naics-result {
  border-bottom: 1px solid $gray3;
}

.v-btn {
  display: block;
  width: 100%;
  background-color: $gray1;
}

// button text
::v-deep .v-btn__content {
  color: $gray7;
  white-space: normal; // for wrapping
}
</style>
