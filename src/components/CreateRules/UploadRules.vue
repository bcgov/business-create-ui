<template>
  <v-card flat id="upload-rules">

    <!-- Summary Section -->
    <div id="upload-rules-summary" v-if="isSummary">
      <!-- Summary Header -->
      <div class="upload-rules-summary-header" >
        <v-icon color="dkBlue">mdi-format-list-text</v-icon>
        <label class="upload-rules-title font-weight-bold">Rules</label>
      </div>

      <!-- Summary error message -->
      <div
        v-if="!getCreateRulesStep.valid"
        class="upload-rules-error-message invalid-section"
      >
        <span>
          <v-icon color="error">mdi-information-outline</v-icon>
          &nbsp;
          <span class="error-text">This step is unfinished.</span>
          &nbsp;
          <router-link
            :to="{ path: `/${RouteNames.CREATE_RULES}` }"
          >Return to this step to finish it</router-link>
        </span>
      </div>
    </div>

    <v-card-title>Rules Placeholder component</v-card-title>
  </v-card>
</template>

<script lang="ts">
// Libraries
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'

// Enums
import { RouteNames } from '@/enums'
import { CreateRulesIF } from '@/interfaces'

@Component({})
export default class UploadRules extends Vue {
  @Prop({ default: false })
  private readonly isSummary: boolean

  @Getter getCreateRulesStep!: CreateRulesIF
  @Getter getValidateSteps!: boolean

  // Enum for template
  readonly RouteNames = RouteNames
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';
.upload-rules-summary-header {
  display: flex;
  background-color: $BCgovBlue5O;
  padding: 1.25rem;

  .upload-rules-title {
    padding-left: 0.5rem;
  }
}

.upload-rules-error-message {
  padding-top: 1.25rem;
  padding-left: 1.25rem;
  color: $primary-blue;
}

.v-icon.mdi-information-outline {
  margin-top: -2px;
}
</style>
