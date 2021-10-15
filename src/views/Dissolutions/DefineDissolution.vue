<template>
  <div id="define-dissolution">
    <v-card outlined class="message-box mt-10">
      <p>
        <strong>Important:</strong> You are about to voluntarily dissolve <strong>{{ getBusinessLegalName }}</strong>.
        Once this process is completed and the required documents are filed, the Cooperative Association is struck from
        the register and dissolved, ceasing to be an incorporated cooperative under the Cooperative Association Act. All
        assets and liabilities must be addressed prior to filing.
      </p>
    </v-card>

    <section class="mt-10">
      <header id="association-details">
        <h2>1. Association Details</h2>
      </header>
      <AssociationDetails class="mt-5"/>
    </section>

    <section class="mt-10" v-if="isTypeCoop">
      <header id="dissolution-statement">
        <h2>2. Dissolution Statement</h2>
        <p class="mt-4">Choose a dissolution statement regarding dissolution and
          the Cooperative Association's assets and liabilities:
        </p>
      </header>
      <DissolutionStatement class="mt-5"
        :showErrorSummary="showDissolutionStatementErrors"
      />
    </section>

    <section class="mt-10">
      <header id="liquidator-or-custodian">
        <h2>{{isTypeCoop ? 3 : 2 }}. Liquidator or Other Custodian of Records</h2>
      </header>
      <!-- Component goes here -->
    </section>

    <section class="mt-10">
      <header id="delete-certificates">
        <h2>{{isTypeCoop ? 4 : 3 }}. Delete and/or Destroy Certificates</h2>
      </header>
      <!-- Component goes here -->
    </section>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Mixins, Vue, Watch } from 'vue-property-decorator'
import { Getter, Action } from 'vuex-class'
import { AssociationDetails, DissolutionStatement } from '@/components/DefineDissolution'
import { DissolutionStatementIF } from '@/interfaces'

@Component({
  components: {
    AssociationDetails,
    DissolutionStatement
  }
})
export default class DefineDissolution extends Vue {
  // @Getter
  @Getter getBusinessLegalName!: string
  @Getter getShowErrors!: boolean
  @Getter getDissolutionStatementStep!: DissolutionStatementIF
  @Getter isTypeCoop: boolean

  private get showDissolutionStatementErrors () {
    return this.getShowErrors &&
    (this.isTypeCoop && this.getDissolutionStatementStep && !this.getDissolutionStatementStep.valid)
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';
</style>
