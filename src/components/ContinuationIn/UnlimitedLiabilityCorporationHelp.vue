<template>
  <section class="unlimited-liability-corporation-help">
    <header>
      <h3 class="text-center">
        Help with Unlimited Liability Corporation Information
      </h3>
      <div class="mt-6">
        <p>
          There is additional information required by the Registrar for an unlimited liability corporation
          from Alberta. You are required to provide either a Director's Affidavit or a Court Order.
        </p>

        <h4>Director's Affidavit</h4>
        <p class="mt-1">
          An affidavit of a director of the corporation stating that the director believes and has reasonable
          grounds for believing that:
        </p>
        <p class="ml-3">
          (i) the corporation is, and the continued unlimited liability company will be, able to pay its
          liabilities as they become due, and
        </p>
        <p class="ml-3">
          (ii) the realizable value of the continued unlimited liability company's assets will not be less
          than the aggregate of its liabilities.
        </p>

        <h4>Court Order</h4>
        <p class="mt-1">
          An order approving the continuation from a court of competent jurisdiction in Alberta.
        </p>
      </div>
    </header>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({})
export default class UnlimitedLiabilityCorporationHelp extends Vue {}
</script>
