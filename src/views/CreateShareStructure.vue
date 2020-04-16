<template>
   <section class="mt-10">
      <header id="share-structure-header">
        <h2>1. Create Your Authorized Share Structure</h2>
      </header>
    </section>
</template>

<script lang="ts">
// Libraries
import { Component, Vue } from 'vue-property-decorator'
import { Action } from 'vuex-class'

// Interfaces
import { ActionBindingIF } from '@/interfaces'

@Component({})
export default class CreateShareStructure extends Vue {
  @Action setIgnoreChanges!: ActionBindingIF

  /** Called when component is created. */
  private created (): void {
    // ignore data changes until page has loaded
    this.setIgnoreChanges(true)
    Vue.nextTick(() => {
      this.setIgnoreChanges(false)
    })
  }
}
</script>

<style lang="scss" scoped>
</style>
