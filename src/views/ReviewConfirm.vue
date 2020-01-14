<template>
  <div>
    <header>
      <h2>5. Review</h2>
    </header>

    <v-card flat class="step-container">
      <section>
        Review/confirm component goes here.
      </section>
    </v-card>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'

// Interfaces
import { GetterIF } from '@/interfaces'

@Component({})
export default class ReviewConfirm extends Vue {
  // Global getters
  @Getter isEntityType!: GetterIF

  // Lifecycle event
  private created (): void {
    // if basic stuff isn't set, go to step 1
    if (!this.isEntityType) {
      this.$router.push('/')
    }
  }
}
</script>

<style lang="scss">
.step-container {
  height: 15rem; // FOR TESTING ONLY
}
</style>
