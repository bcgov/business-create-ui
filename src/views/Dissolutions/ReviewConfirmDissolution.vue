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

      <section :class="{ 'invalid-section': !mockIsValid }">
        <div v-if="!mockIsValid" class="defineDissolutionError">
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
      </section>
    </v-card>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Vue } from 'vue-property-decorator'

// Components
import { AssociationDetails } from '@/components/DefineDissolution'

// Enums
import { RouteNames } from '@/enums'

@Component({
  components: {
    AssociationDetails
  }
})
export default class ReviewConfirmDissolution extends Vue {
  // Enum for template
  readonly RouteNames = RouteNames

  private mockIsValid = true // TODO: Build out Validation checks when we have Step 1 Complete
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
