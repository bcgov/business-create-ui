<template>
  <div>
    <header>
      <h2>5. Review</h2>
    </header>

    <v-card flat class="review-confirm-container">
      <section>
        Review/confirm component goes here.
      </section>
    </v-card>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Vue } from 'vue-property-decorator'

@Component({})
export default class ReviewConfirm extends Vue {}
</script>

<style lang="scss">
.review-confirm-container {
  margin-top: 1rem;
  padding: 1.25rem;
}
</style>
