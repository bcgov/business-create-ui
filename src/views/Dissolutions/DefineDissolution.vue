<template>
  <div id="define-dissolution">
    <v-card outlined class="message-box mt-10">
      <p>
        <strong>Important:</strong> You are about to voluntarily dissolve [name of cooperative association]. Once this
        process is completed and the required documents are filed, the Cooperative Association is struck from the
        register and dissolved, ceasing to be an incorporated cooperative under the Cooperative Association Act. All
        assets and liabilities must be addressed prior to filing.
      </p>
    </v-card>

    <section class="mt-10">
      <header id="association-details">
        <h2>1. Association Details</h2>
      </header>
      <!-- Component goes here -->
    </section>

    <section class="mt-10">
      <header id="dissolution-statement">
        <h2>2. Dissolution Statement</h2>
      </header>
      <!-- Component goes here -->
    </section>

    <section class="mt-10">
      <header id="liquidator-or-custodian">
        <h2>3. Liquidator or Other Custodian of Records</h2>
      </header>
      <!-- Component goes here -->
    </section>

    <section class="mt-10">
      <header id="delete-certificates">
        <h2>4. Delete and/or Destroy Certificates</h2>
      </header>
      <!-- Component goes here -->
    </section>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Mixins, Vue, Watch } from 'vue-property-decorator'
import { Getter, Action } from 'vuex-class'

@Component({
  components: {}
})
export default class DefineDissolution extends Vue {
  // @Getter
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';
</style>
