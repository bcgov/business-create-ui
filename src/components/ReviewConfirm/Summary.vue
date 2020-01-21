<template>
  <div class="summary-container">
    <SummaryDefineCompany/>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Vue } from 'vue-property-decorator'
import { Getter, Action, State } from 'vuex-class'

// Interfaces
import { BusinessContactIF } from '@/interfaces/stepper-interfaces/DefineCompany/business-contact-interface'

// Components
import SummaryDefineCompany from '@/components/Summary/SummaryDefineCompany.vue'

@Component({
  components: {
    SummaryDefineCompany
  }
})
export default class Summary extends Vue { }
</script>

<style lang="scss">
.summary-container {
  margin-top:1rem;
  padding-top:1rem;
}
</style>
