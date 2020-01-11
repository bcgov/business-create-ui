<template>
  <div>
    <header>
      <h2>1. Company Name</h2>
    </header>

    <v-card flat class="define-company-container">
      <section>
        Company Name component goes here.
      </section>
    </v-card>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Vue } from 'vue-property-decorator'

@Component({})
export default class DefineCompany extends Vue {}
</script>

<style lang="scss">
.define-company-container {
  margin-top: 1rem;
  padding: 1.25rem;
}
</style>
