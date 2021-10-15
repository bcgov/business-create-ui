<template>
  <div id="review-confirm-dissolution">

    <section class="mt-10 pb-2 section-container">
      <header>
        <h2>Review and Confirm</h2>
        <p class="mt-1">Review the information in your filing. If you need to change or complete anything, return
          to the step to make the necessary change.</p>
      </header>
    </section>

    <!-- Define Dissolution Summary -->
    <v-card flat class="rounded-4">
      <div class="review-header">
        <v-icon class="ml-2" color="appDkBlue">mdi-domain</v-icon>
        <label class="pl-2"><strong>Dissolution</strong></label>
      </div>

      <section :class="{ 'invalid-section': isDefineDissolutionInvalid }">
        <div v-if="isDefineDissolutionInvalid" class="defineDissolutionError">
          <span>
            <v-icon color="error">mdi-information-outline</v-icon>
            &nbsp;
            <span class="error-text">This step is unfinished.</span>
            &nbsp;
            <router-link
              :to="{ path: `/${RouteNames.DEFINE_DISSOLUTION}` }"
            >Return to this step to finish it</router-link>
          </span>
        </div>
        <AssociationDetails :isSummary="true"/>

        <div class="gray-container px-8 pb-8">
          <DissolutionStatement :isSummary="true" v-if="isTypeCoop"/>
        </div>
      </section>
    </v-card>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'

// Components
import { AssociationDetails, DissolutionStatement } from '@/components/DefineDissolution'

// Enums
import { RouteNames } from '@/enums'
import { DissolutionStatementIF } from '@/interfaces'

@Component({
  components: {
    AssociationDetails,
    DissolutionStatement
  }
})
export default class ReviewConfirmDissolution extends Vue {
  // @Getter
  @Getter isTypeCoop: boolean
  @Getter getDissolutionStatementStep!: DissolutionStatementIF

  // Enum for template
  readonly RouteNames = RouteNames

  // TODO: Build out validation checks with each component
  /** Is true when the Define Dissolution conditions are not met. */
  private get isDefineDissolutionInvalid () {
    return (this.isTypeCoop && !this.getDissolutionStatementStep.valid)
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.defineDissolutionError {
  padding-top: 1.25rem;
  padding-left: 1.25rem;
  color: $app-red;
}

.section-container {
  font-size: 1rem;
  color: $gray7;

  label {
    color: $gray9;
  }
}

.gray-container {
  .theme--light.v-card {
    background-color: $gray1;
  }
}

.review-header {
  display: flex;
  background-color: $BCgovBlue5O;
  padding: 1.25rem;
  color: $gray9;
}

.v-icon.mdi-information-outline {
  margin-top: -2px;
}
</style>
