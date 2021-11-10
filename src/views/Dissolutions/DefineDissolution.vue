<template>
  <div id="define-dissolution">
    <v-card outlined class="message-box mt-10">
      <p>
        <strong>Important:</strong> You are about to voluntarily dissolve <strong>{{ entityName }}</strong>.
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

    <section class="mt-10" v-if="isTypeCoop">
      <header id="delete-certificates">
        <h2>{{isTypeCoop ? 4 : 3 }}. Delete and/or Destroy Certificates</h2>
        <p class="mt-4">After dissolution. all original certificates of incorporation, name change, or amalgamation
          are not valid and must not be used by the Cooperative Association. Any copies of these documents must
          be deleted and/or destroyed.
        </p>
        <p class="mt-4 delete-certificates-note"><strong>Note:</strong> The Cooperative Association Act requires
          that the application for a voluntary dissolution be accompanied by the Certificate of Incorporation.
          The Certificate of Incorporation is on file for this Cooperative Association.
        </p>
      </header>
      <DestroyCertificate class="mt-5"
        :showErrorSummary="showDestroyCertificateErrors"
      />
    </section>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Mixins, Vue } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { AssociationDetails, DestroyCertificate, DissolutionStatement } from '@/components/DefineDissolution'
import { ActionBindingIF, DissolutionStatementIF } from '@/interfaces'
import { EntityFilterMixin, EnumMixin } from '@/mixins'

@Component({
  components: {
    AssociationDetails,
    DestroyCertificate,
    DissolutionStatement
  }
})
export default class DefineDissolution extends Mixins(EntityFilterMixin, EnumMixin) {
  // Global getters
  @Getter getBusinessLegalName!: string
  @Getter getDissolutionStatementStep!: DissolutionStatementIF
  @Getter getHasCertificateDestroyed!: boolean
  @Getter getShowErrors!: boolean
  @Getter isTypeCoop: boolean

  // Global actions
  @Action setIgnoreChanges!: ActionBindingIF

  /** Called when component is created. */
  private created (): void {
    // ignore data changes until page has loaded
    this.setIgnoreChanges(true)
    Vue.nextTick(() => {
      this.setIgnoreChanges(false)
    })
  }

  /** The entity name. */
  private get entityName (): string {
    return this.getBusinessLegalName || `${this.getCorpTypeNumberedDescription(this.getEntityType)}`
  }

  private get showDissolutionStatementErrors () {
    return this.getShowErrors &&
      (this.isTypeCoop && this.getDissolutionStatementStep && !this.getDissolutionStatementStep.valid)
  }

  private get showDestroyCertificateErrors () {
    return this.getShowErrors && (this.isTypeCoop && !this.getHasCertificateDestroyed)
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.delete-certificates-note {
  font-size: 0.875rem;
}
</style>
