<template>
  <div id="registration-review-confirm">
    <!-- Review and Confirm -->
    <section class="mt-10">
      <header>
        <h2>Review and Confirm</h2>
        <p class="mt-1">Review the information in your registration. If you need to change or complete anything, return
          to the step to make the necessary change.</p>
      </header>
      <DefineRegistrationSummary class="mt-6" />
    </section>

    <!-- Document Delivery -->
    <section id="document-delivery-section" class="mt-10">
      <header>
        <h2>Document Delivery</h2>
        <p class="mt-1">Copies of the registration documents will be sent to the following email addresses listed
          below.
        </p>
      </header>
      <DocumentDelivery
        :registeredOfficeEmail="getBusinessContact.email"
        :userEmail="getUserEmail" />
    </section>

    <!-- Certify -->
    <section class="mt-10">
      <header>
        <h2>Certify</h2>
        <p class="mt-1">Confirm the legal name of the person authorized to complete and submit this application.</p>
      </header>
      <div :class="{ 'invalid-section': false }">
        <Certify
          :currentDate="getCurrentDate"
          :statements="[]"
          :message="getCompletingPartyStatement.certifyClause"
        />
      </div>
    </section>

    <!-- Fee Acknowledgement-->
    <section class="mt-10">
      <header>
        <h2>Fee Acknowledgement</h2>
      </header>
      <div :class="{ 'invalid-section': false }">
        *** ACKNOWLEDGEMENT PLACEHOLDER ***
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { BusinessContactIF, CertifyStatementIF } from '@/interfaces'
import { Certify } from '@bcrs-shared-components/certify'
import DefineRegistrationSummary from '@/components/Registration/DefineRegistrationSummary.vue'
import DocumentDelivery from '@/components/common/DocumentDelivery.vue'

@Component({
  components: {
    Certify,
    DefineRegistrationSummary,
    DocumentDelivery
  }
})
export default class RegistrationReviewConfirm extends Vue {
  @Getter getBusinessContact!: BusinessContactIF
  @Getter getCompanyTitle!: string
  @Getter getCompanyDescription!: string
  @Getter getCompletingPartyStatement!: CertifyStatementIF
  @Getter getCurrentDate!: string
  @Getter getUserEmail!: string
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

#registration-review-confirm {
  /* Set "header-counter" to 0 */
  counter-reset: header-counter;
}

h2::before {
  /* Increment "header-counter" by 1 */
  counter-increment: header-counter;
  content: counter(header-counter) '. ';
}

::v-deep #document-delivery-section {
  .v-card {
    padding: 1.5rem 1.25rem !important;
  }

  .row {
    padding: 0.75rem 0;

    .col-3 {
      font-size: 0.875rem;
      color: $gray9;
      padding: 0 0 0 0.75rem !important;
    }

    .col-9 {
      padding: 0 0.5rem 0 0 !important;
    }
  }
}
</style>
