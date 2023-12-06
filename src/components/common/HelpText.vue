<template>
  <header id="name-header">
    <h2>Help with Resulting Business Type</h2>
    <p class="mt-4">
      A BC Limited Company and BC Community Contribution Company can amalgamate
      but must form a BC Community Contribution Company. - BCA s. 51.98
    </p>
    <p class="mt-4">
      A BC Unlimited Liability Company and BC Community Contribution
      Company can amalgamate but must form a BC Community Contribution Company. - BCA s. 51.98
    </p>
    <p>
      For assistance with amalgamations involving extraprovincial corporations, please contact BC Registries staff:
    </p>
    <RegistriesContactInfo />
  </header>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import RegistriesContactInfo from '@/components/common/RegistriesContactInfo.vue'
@Component({
  components: { RegistriesContactInfo }
})
export default class HelpText extends Vue {}
</script>
