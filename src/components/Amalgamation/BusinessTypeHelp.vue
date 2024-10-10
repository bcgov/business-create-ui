<template>
  <section class="business-type-help mt-0">
    <header>
      <h3 class="text-center">
        Help with Resulting Business Type
      </h3>
      <div class="mt-6">
        <p class="ml-1">
          A BC Limited Company and BC Community Contribution Company can amalgamate
          but must form a BC Community Contribution Company. - BCA s. 51.98
        </p>
        <p class="ml-1">
          A BC Unlimited Liability Company and BC Community Contribution
          Company can amalgamate but must form a BC Community Contribution Company. - BCA s. 51.98
        </p>
        <p class="ml-1">
          For assistance with amalgamations involving extraprovincial corporations, please contact BC Registries staff:
        </p>
      </div>
      <br>
      <RegistriesContactInfo />
    </header>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import RegistriesContactInfo from '@/components/common/RegistriesContactInfo.vue'

@Component({
  components: {
    RegistriesContactInfo
  }
})
export default class BusinessTypeHelp extends Vue {}
</script>
